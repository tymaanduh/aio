#pragma once

#include "dx12/Common.h"
#include "dx12/RenderTypes.h"

namespace dx12 {

struct FrameGraphResourceDesc {
  std::string name;
  ID3D12Resource* resource = nullptr;
  std::uint32_t subresourceCount = 1;
  D3D12_RESOURCE_STATES initialState = D3D12_RESOURCE_STATE_COMMON;
};

struct FrameGraphResourceUsage {
  std::uint32_t resourceId = 0;
  ResourceUsage usage = ResourceUsage::Read;
  std::uint32_t subresource = D3D12_RESOURCE_BARRIER_ALL_SUBRESOURCES;
  D3D12_RESOURCE_STATES state = D3D12_RESOURCE_STATE_COMMON;
};

struct FrameGraphPassDesc {
  std::string name;
  QueueType queue = QueueType::Graphics;
  std::vector<FrameGraphResourceUsage> resources;
};

struct CompiledBarrierBatch {
  std::uint32_t passIndex = 0;
  QueueType queue = QueueType::Graphics;
  std::vector<D3D12_RESOURCE_BARRIER> barriers;
};

struct CompiledFrameGraph {
  std::vector<FrameGraphPassDesc> passes;
  std::vector<CompiledBarrierBatch> barrierBatches;
};

class FrameGraphBuilder {
 public:
  std::uint32_t AddResource(const FrameGraphResourceDesc& desc);
  std::uint32_t AddPass(const FrameGraphPassDesc& pass);

  void Reset();
  CompiledFrameGraph Compile() const;

 private:
  std::vector<FrameGraphResourceDesc> resources_;
  std::vector<FrameGraphPassDesc> passes_;
};

}  // namespace dx12
