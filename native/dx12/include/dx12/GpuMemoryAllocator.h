#pragma once

#include "dx12/Common.h"
#include "dx12/RenderTypes.h"
#include "dx12/ResourceLifetimeTracker.h"

namespace dx12 {

struct GpuAllocation {
  std::uint64_t heapId = 0;
  std::uint64_t offset = 0;
  std::uint64_t size = 0;
  std::uint64_t alignment = 0;
  D3D12_HEAP_TYPE heapType = D3D12_HEAP_TYPE_DEFAULT;
  D3D12_HEAP_FLAGS heapFlags = D3D12_HEAP_FLAG_NONE;

  bool IsValid() const { return heapId != 0 && size > 0; }
};

class GpuMemoryAllocator {
 public:
  struct Config {
    std::uint64_t defaultHeapBytes = 256ull * 1024ull * 1024ull;
    std::uint64_t uploadHeapBytes = 64ull * 1024ull * 1024ull;
    std::uint64_t readbackHeapBytes = 32ull * 1024ull * 1024ull;
  };

  void Initialize(ID3D12Device* device, ResourceLifetimeTracker* lifetimeTracker);
  void Initialize(ID3D12Device* device, ResourceLifetimeTracker* lifetimeTracker, const Config& config);
  void Shutdown();

  GpuAllocation Allocate(
    std::uint64_t size,
    std::uint64_t alignment,
    D3D12_HEAP_TYPE heapType,
    D3D12_HEAP_FLAGS heapFlags
  );
  void Retire(const GpuAllocation& allocation, QueueType queue, std::uint64_t fenceValue);
  void FreeImmediate(const GpuAllocation& allocation);

  ComPtr<ID3D12Resource> CreatePlacedBuffer(
    std::uint64_t size,
    D3D12_RESOURCE_FLAGS flags,
    D3D12_RESOURCE_STATES initialState,
    D3D12_HEAP_TYPE heapType,
    GpuAllocation* outAllocation
  );

  ComPtr<ID3D12Resource> CreatePlacedTexture(
    const D3D12_RESOURCE_DESC& desc,
    const D3D12_CLEAR_VALUE* clearValue,
    D3D12_RESOURCE_STATES initialState,
    D3D12_HEAP_TYPE heapType,
    GpuAllocation* outAllocation
  );

 private:
  struct FreeRange {
    std::uint64_t offset = 0;
    std::uint64_t size = 0;
  };

  struct HeapPage {
    std::uint64_t id = 0;
    std::uint64_t size = 0;
    D3D12_HEAP_TYPE heapType = D3D12_HEAP_TYPE_DEFAULT;
    D3D12_HEAP_FLAGS heapFlags = D3D12_HEAP_FLAG_NONE;
    std::uint32_t liveAllocations = 0;
    ComPtr<ID3D12Heap> heap;
    std::vector<FreeRange> freeRanges;
  };

  static std::uint64_t AlignUp(std::uint64_t value, std::uint64_t alignment);
  std::uint64_t ResolvePageSize(D3D12_HEAP_TYPE heapType) const;
  HeapPage* FindPage(std::uint64_t id);
  const HeapPage* FindPage(std::uint64_t id) const;
  GpuAllocation TryAllocateFromPage(HeapPage& page, std::uint64_t size, std::uint64_t alignment);
  HeapPage& CreatePage(
    std::uint64_t minSize,
    D3D12_HEAP_TYPE heapType,
    D3D12_HEAP_FLAGS heapFlags
  );
  void CoalesceRanges(HeapPage& page);
  ComPtr<ID3D12Resource> CreatePlacedResource(
    const D3D12_RESOURCE_DESC& desc,
    const D3D12_CLEAR_VALUE* clearValue,
    D3D12_RESOURCE_STATES initialState,
    D3D12_HEAP_TYPE heapType,
    D3D12_HEAP_FLAGS heapFlags,
    std::uint64_t alignment,
    GpuAllocation* outAllocation
  );

  Config config_{};
  ComPtr<ID3D12Device> device_;
  ResourceLifetimeTracker* lifetimeTracker_ = nullptr;
  std::vector<HeapPage> pages_;
  std::uint64_t nextHeapId_ = 1;
  mutable std::mutex mutex_;
};

}  // namespace dx12
