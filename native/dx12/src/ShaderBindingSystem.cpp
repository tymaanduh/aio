#include "dx12/ShaderBindingSystem.h"

#include <d3dcompiler.h>

namespace dx12 {

ShaderReflectionLayout ShaderBindingSystem::ReflectAndCache(
  const std::string& shaderKey,
  std::span<const std::uint8_t> bytecode
) {
  if (shaderKey.empty()) {
    throw std::runtime_error("ShaderBindingSystem::ReflectAndCache requires a non-empty key.");
  }
  if (bytecode.empty()) {
    throw std::runtime_error("ShaderBindingSystem::ReflectAndCache requires shader bytecode.");
  }

  ComPtr<ID3D12ShaderReflection> reflection;
  ThrowIfFailed(
    D3DReflect(bytecode.data(), bytecode.size(), IID_PPV_ARGS(&reflection)),
    "Failed to reflect shader bytecode."
  );

  D3D12_SHADER_DESC shaderDesc{};
  ThrowIfFailed(reflection->GetDesc(&shaderDesc), "Failed to read shader reflection descriptor.");

  ShaderReflectionLayout layout{};
  for (UINT index = 0; index < shaderDesc.BoundResources; ++index) {
    D3D12_SHADER_INPUT_BIND_DESC bindDesc{};
    ThrowIfFailed(reflection->GetResourceBindingDesc(index, &bindDesc), "Failed to read shader resource binding.");
    layout.bindings.push_back({
      bindDesc.Name ? bindDesc.Name : "",
      bindDesc.Type,
      bindDesc.BindPoint,
      bindDesc.BindCount,
      bindDesc.Space
    });
  }

  std::uint32_t totalCbufferSize = 0;
  for (UINT index = 0; index < shaderDesc.ConstantBuffers; ++index) {
    auto* cbuffer = reflection->GetConstantBufferByIndex(index);
    if (!cbuffer) {
      continue;
    }
    D3D12_SHADER_BUFFER_DESC bufferDesc{};
    ThrowIfFailed(cbuffer->GetDesc(&bufferDesc), "Failed to read constant buffer reflection.");
    totalCbufferSize += static_cast<std::uint32_t>(std::max<UINT>(0, bufferDesc.Size));
  }
  layout.constantBufferBytes = totalCbufferSize;

  {
    std::unique_lock lock(mutex_);
    layouts_[shaderKey] = layout;
  }
  return layout;
}

const ShaderReflectionLayout* ShaderBindingSystem::Find(const std::string& shaderKey) const {
  std::shared_lock lock(mutex_);
  const auto it = layouts_.find(shaderKey);
  return it == layouts_.end() ? nullptr : &it->second;
}

std::optional<ShaderBindingDesc> ShaderBindingSystem::FindBinding(const std::string& shaderKey, std::string_view name) const {
  std::shared_lock lock(mutex_);
  const auto it = layouts_.find(shaderKey);
  if (it == layouts_.end()) {
    return std::nullopt;
  }
  for (const auto& binding : it->second.bindings) {
    if (binding.name == name) {
      return binding;
    }
  }
  return std::nullopt;
}

void ShaderBindingSystem::Clear() {
  std::unique_lock lock(mutex_);
  layouts_.clear();
}

}  // namespace dx12
