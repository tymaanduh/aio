#pragma once

#include "dx12/Common.h"
#include "dx12/RenderTypes.h"

namespace dx12 {

class ResourceLifetimeTracker;

struct DescriptorRange {
  std::uint32_t begin = 0;
  std::uint32_t count = 0;
};

struct DescriptorHandle {
  D3D12_CPU_DESCRIPTOR_HANDLE cpu{};
  D3D12_GPU_DESCRIPTOR_HANDLE gpu{};
  std::uint32_t index = 0;
};

class DescriptorAllocator {
 public:
  struct Config {
    std::uint32_t totalDescriptors = 65536;
    std::uint32_t frameDynamicDescriptors = 4096;
    D3D12_DESCRIPTOR_HEAP_TYPE type = D3D12_DESCRIPTOR_HEAP_TYPE_CBV_SRV_UAV;
    bool shaderVisible = true;
  };

  void Initialize(ID3D12Device* device, const Config& config);
  void SetLifetimeTracker(ResourceLifetimeTracker* tracker);

  DescriptorRange AllocateStatic(std::uint32_t count);
  void FreeStatic(DescriptorRange range);
  void RetireStatic(DescriptorRange range, QueueType queue, std::uint64_t fenceValue);

  void BeginFrame(std::uint32_t frameIndex);
  DescriptorRange AllocateDynamic(std::uint32_t count, std::uint32_t frameIndex);

  DescriptorHandle GetHandle(std::uint32_t index) const;

  ID3D12DescriptorHeap* Heap() const { return heap_.Get(); }
  std::uint32_t Increment() const { return descriptorIncrement_; }
  const Config& GetConfig() const { return config_; }

 private:
  struct FreeBlock {
    std::uint32_t begin = 0;
    std::uint32_t count = 0;
  };

  void CoalesceFreeList();

  Config config_{};
  ComPtr<ID3D12DescriptorHeap> heap_;
  std::uint32_t descriptorIncrement_ = 0;
  std::uint32_t staticHead_ = 0;
  std::array<std::uint32_t, kFrameBufferCount> dynamicHeads_{};
  std::vector<FreeBlock> freeList_;
  ResourceLifetimeTracker* lifetimeTracker_ = nullptr;
  std::mutex mutex_;
};

}  // namespace dx12
