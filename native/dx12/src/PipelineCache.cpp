#include "dx12/PipelineCache.h"

#include <fstream>

namespace dx12 {

namespace {

std::vector<std::uint8_t> CopyShaderBytecode(const D3D12_SHADER_BYTECODE& bytecode) {
  if (!bytecode.pShaderBytecode || bytecode.BytecodeLength == 0) {
    return {};
  }
  const auto* begin = static_cast<const std::uint8_t*>(bytecode.pShaderBytecode);
  return {begin, begin + bytecode.BytecodeLength};
}

void AssignShaderBytecode(D3D12_SHADER_BYTECODE* target, const std::vector<std::uint8_t>& bytes) {
  if (!target) {
    return;
  }
  target->pShaderBytecode = bytes.empty() ? nullptr : bytes.data();
  target->BytecodeLength = bytes.size();
}

struct OwnedPipelineStateDesc {
  PipelineStateDesc desc;
  std::vector<std::uint8_t> vs;
  std::vector<std::uint8_t> ps;
  std::vector<std::uint8_t> ds;
  std::vector<std::uint8_t> hs;
  std::vector<std::uint8_t> gs;
};

OwnedPipelineStateDesc OwnPipelineStateDesc(const PipelineStateDesc& source) {
  OwnedPipelineStateDesc owned{};
  owned.desc = source;
  owned.vs = CopyShaderBytecode(source.nativeDesc.VS);
  owned.ps = CopyShaderBytecode(source.nativeDesc.PS);
  owned.ds = CopyShaderBytecode(source.nativeDesc.DS);
  owned.hs = CopyShaderBytecode(source.nativeDesc.HS);
  owned.gs = CopyShaderBytecode(source.nativeDesc.GS);

  AssignShaderBytecode(&owned.desc.nativeDesc.VS, owned.vs);
  AssignShaderBytecode(&owned.desc.nativeDesc.PS, owned.ps);
  AssignShaderBytecode(&owned.desc.nativeDesc.DS, owned.ds);
  AssignShaderBytecode(&owned.desc.nativeDesc.HS, owned.hs);
  AssignShaderBytecode(&owned.desc.nativeDesc.GS, owned.gs);
  return owned;
}

void ReflectShaderStage(
  ShaderBindingSystem* bindingSystem,
  const std::string& baseName,
  const char* stageName,
  const D3D12_SHADER_BYTECODE& bytecode
) {
  if (!bindingSystem || !bytecode.pShaderBytecode || bytecode.BytecodeLength == 0 || !stageName) {
    return;
  }
  auto bytes = CopyShaderBytecode(bytecode);
  if (bytes.empty()) {
    return;
  }
  bindingSystem->ReflectAndCache(baseName + ":" + stageName, bytes);
}

void ReflectPipelineShaders(ShaderBindingSystem* bindingSystem, const PipelineStateDesc& desc) {
  if (!bindingSystem) {
    return;
  }
  const auto baseName = desc.name.empty() ? ("pso-" + std::to_string(desc.id)) : desc.name;
  ReflectShaderStage(bindingSystem, baseName, "vs", desc.nativeDesc.VS);
  ReflectShaderStage(bindingSystem, baseName, "ps", desc.nativeDesc.PS);
  ReflectShaderStage(bindingSystem, baseName, "ds", desc.nativeDesc.DS);
  ReflectShaderStage(bindingSystem, baseName, "hs", desc.nativeDesc.HS);
  ReflectShaderStage(bindingSystem, baseName, "gs", desc.nativeDesc.GS);
}

}  // namespace

void PipelineCache::Initialize(ID3D12Device* device) {
  if (!device) {
    throw std::runtime_error("PipelineCache::Initialize requires a valid device.");
  }
  std::lock_guard<std::mutex> lock(mutex_);
  device_ = device;
}

void PipelineCache::SetRuntimeRebuildEnabled(bool enabled) {
  std::lock_guard<std::mutex> lock(mutex_);
  runtimeRebuildEnabled_ = enabled;
}

void PipelineCache::BakeRootSignatures(std::span<const RootSignatureDesc> rootSignatures) {
  ComPtr<ID3D12Device> device;
  {
    std::lock_guard<std::mutex> lock(mutex_);
    device = device_;
  }
  if (!device) {
    throw std::runtime_error("PipelineCache must be initialized before baking root signatures.");
  }

  for (const auto& desc : rootSignatures) {
    ComPtr<ID3DBlob> serialized;
    ComPtr<ID3DBlob> errorBlob;
    ThrowIfFailed(
      D3D12SerializeVersionedRootSignature(&desc.nativeDesc, &serialized, &errorBlob),
      "Failed to serialize root signature."
    );
    ComPtr<ID3D12RootSignature> rootSig;
    ThrowIfFailed(
      device->CreateRootSignature(0, serialized->GetBufferPointer(), serialized->GetBufferSize(), IID_PPV_ARGS(&rootSig)),
      "Failed to create root signature."
    );

    std::lock_guard<std::mutex> lock(mutex_);
    if (rootSignatures_.contains(desc.id)) {
      throw std::runtime_error("Duplicate root signature id.");
    }
    rootSignatures_.emplace(desc.id, std::move(rootSig));
  }
}

void PipelineCache::BakeGraphicsPsos(std::span<const PipelineStateDesc> psos) {
  for (const auto& desc : psos) {
    ReflectPipelineShaders(&shaderBindingSystem_, desc);
    auto pso = BuildGraphicsPso(desc);
    std::lock_guard<std::mutex> lock(mutex_);
    if (graphicsPsos_.contains(desc.id)) {
      throw std::runtime_error("Duplicate graphics PSO id.");
    }
    graphicsPsos_.emplace(desc.id, std::move(pso));
  }
}

void PipelineCache::QueueGraphicsPsoBuild(const PipelineStateDesc& desc, bool replaceExisting) {
  OwnedPipelineStateDesc snapshot = OwnPipelineStateDesc(desc);
  ReflectPipelineShaders(&shaderBindingSystem_, snapshot.desc);
  PendingGraphicsPso pending{};
  pending.id = snapshot.desc.id;
  pending.replaceExisting = replaceExisting;
  pending.future = std::async(std::launch::async, [this, snapshot = std::move(snapshot)]() {
    return BuildGraphicsPso(snapshot.desc);
  });

  std::lock_guard<std::mutex> lock(mutex_);
  pendingGraphicsPsos_.push_back(std::move(pending));
}

void PipelineCache::PumpAsyncBuilds() {
  std::vector<PendingGraphicsPso> pending;
  {
    std::lock_guard<std::mutex> lock(mutex_);
    pending.swap(pendingGraphicsPsos_);
  }

  std::vector<PendingGraphicsPso> stillPending;
  for (auto& item : pending) {
    if (item.future.wait_for(std::chrono::seconds(0)) != std::future_status::ready) {
      stillPending.push_back(std::move(item));
      continue;
    }
    auto pso = item.future.get();
    std::lock_guard<std::mutex> lock(mutex_);
    if (graphicsPsos_.contains(item.id) && !item.replaceExisting) {
      continue;
    }
    graphicsPsos_[item.id] = std::move(pso);
  }

  if (!stillPending.empty()) {
    std::lock_guard<std::mutex> lock(mutex_);
    for (auto& pendingItem : stillPending) {
      pendingGraphicsPsos_.push_back(std::move(pendingItem));
    }
  }
}

void PipelineCache::RebuildGraphicsPso(const PipelineStateDesc& desc) {
  {
    std::lock_guard<std::mutex> lock(mutex_);
    if (!runtimeRebuildEnabled_) {
      throw std::runtime_error("PipelineCache runtime rebuilds are disabled.");
    }
  }

  ReflectPipelineShaders(&shaderBindingSystem_, desc);
  auto pso = BuildGraphicsPso(desc);
  std::lock_guard<std::mutex> lock(mutex_);
  graphicsPsos_[desc.id] = std::move(pso);
}

std::vector<std::uint8_t> PipelineCache::LoadShaderBinaryFile(const std::filesystem::path& path) {
  std::ifstream stream(path, std::ios::binary);
  if (!stream.is_open()) {
    throw std::runtime_error("Failed to open shader binary file.");
  }
  stream.seekg(0, std::ios::end);
  const auto size = static_cast<std::size_t>(stream.tellg());
  stream.seekg(0, std::ios::beg);
  std::vector<std::uint8_t> bytes(size);
  if (size > 0) {
    stream.read(reinterpret_cast<char*>(bytes.data()), static_cast<std::streamsize>(size));
  }
  return bytes;
}

ID3D12RootSignature* PipelineCache::GetRootSignature(std::uint32_t id) const {
  std::lock_guard<std::mutex> lock(mutex_);
  const auto it = rootSignatures_.find(id);
  return it == rootSignatures_.end() ? nullptr : it->second.Get();
}

ID3D12PipelineState* PipelineCache::GetGraphicsPso(std::uint32_t id) const {
  std::lock_guard<std::mutex> lock(mutex_);
  const auto it = graphicsPsos_.find(id);
  return it == graphicsPsos_.end() ? nullptr : it->second.Get();
}

ComPtr<ID3D12PipelineState> PipelineCache::BuildGraphicsPso(const PipelineStateDesc& desc) const {
  ComPtr<ID3D12Device> device;
  ComPtr<ID3D12RootSignature> rootSig;
  {
    std::lock_guard<std::mutex> lock(mutex_);
    device = device_;
    if (!device) {
      throw std::runtime_error("PipelineCache must be initialized before building PSOs.");
    }
    const auto rootIt = rootSignatures_.find(desc.rootSignatureId);
    if (rootIt == rootSignatures_.end()) {
      throw std::runtime_error("PSO references unknown root signature.");
    }
    rootSig = rootIt->second;
  }

  auto native = desc.nativeDesc;
  native.pRootSignature = rootSig.Get();

  ComPtr<ID3D12PipelineState> pso;
  ThrowIfFailed(device->CreateGraphicsPipelineState(&native, IID_PPV_ARGS(&pso)), "Failed to create graphics PSO.");
  return pso;
}

}  // namespace dx12
