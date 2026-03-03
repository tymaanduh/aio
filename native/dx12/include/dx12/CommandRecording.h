#pragma once

#include "dx12/Common.h"
#include "dx12/RenderTypes.h"

namespace dx12 {

struct WorkerRecordOutput {
  std::uint32_t partitionId = 0;
  std::vector<ComPtr<ID3D12CommandList>> commandLists;
};

class CommandRecordingSystem {
 public:
  void Initialize(ID3D12Device* device, std::uint32_t workerCount, std::uint32_t frameCount = kFrameBufferCount);
  void Shutdown();

  std::vector<WorkerRecordOutput> RecordGraphicsBatches(
    const std::vector<PartitionBatch>& batches,
    std::uint32_t frameIndex,
    std::function<void(ID3D12GraphicsCommandList*, const PartitionBatch&)> recordBatch
  );

 private:
  struct WorkerContext {
    std::uint32_t workerIndex = 0;
    std::vector<ComPtr<ID3D12CommandAllocator>> graphicsAllocators;
    ComPtr<ID3D12GraphicsCommandList> graphicsList;
  };

  ComPtr<ID3D12Device> device_;
  std::vector<WorkerContext> workers_;
  std::uint32_t frameCount_ = kFrameBufferCount;
};

}  // namespace dx12
