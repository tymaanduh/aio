#pragma once

#include "dx12/Common.h"
#include "dx12/ShaderBindingSystem.h"

namespace dx12 {

struct RootSignatureDesc {
  std::uint32_t id = 0;
  std::string name;
  D3D12_VERSIONED_ROOT_SIGNATURE_DESC nativeDesc{};
};

struct PipelineStateDesc {
  std::uint32_t id = 0;
  std::string name;
  std::uint32_t rootSignatureId = 0;
  D3D12_GRAPHICS_PIPELINE_STATE_DESC nativeDesc{};
};

class PipelineCache {
 public:
  void Initialize(ID3D12Device* device);
  void SetRuntimeRebuildEnabled(bool enabled);
  void BakeRootSignatures(std::span<const RootSignatureDesc> rootSignatures);
  void BakeGraphicsPsos(std::span<const PipelineStateDesc> psos);
  void QueueGraphicsPsoBuild(const PipelineStateDesc& desc, bool replaceExisting);
  void PumpAsyncBuilds();
  void RebuildGraphicsPso(const PipelineStateDesc& desc);
  static std::vector<std::uint8_t> LoadShaderBinaryFile(const std::filesystem::path& path);

  ID3D12RootSignature* GetRootSignature(std::uint32_t id) const;
  ID3D12PipelineState* GetGraphicsPso(std::uint32_t id) const;
  ShaderBindingSystem& GetShaderBindingSystem() { return shaderBindingSystem_; }
  const ShaderBindingSystem& GetShaderBindingSystem() const { return shaderBindingSystem_; }

 private:
  struct PendingGraphicsPso {
    std::uint32_t id = 0;
    bool replaceExisting = false;
    std::future<ComPtr<ID3D12PipelineState>> future;
  };

  ComPtr<ID3D12PipelineState> BuildGraphicsPso(const PipelineStateDesc& desc) const;

  ComPtr<ID3D12Device> device_;
  std::unordered_map<std::uint32_t, ComPtr<ID3D12RootSignature>> rootSignatures_;
  std::unordered_map<std::uint32_t, ComPtr<ID3D12PipelineState>> graphicsPsos_;
  std::vector<PendingGraphicsPso> pendingGraphicsPsos_;
  bool runtimeRebuildEnabled_ = false;
  mutable std::mutex mutex_;
  ShaderBindingSystem shaderBindingSystem_;
};

}  // namespace dx12
