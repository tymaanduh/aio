#include "dx12/GpuMemoryAllocator.h"

#include <algorithm>

namespace dx12 {

namespace {

constexpr std::uint64_t kDefaultAlignment = D3D12_DEFAULT_RESOURCE_PLACEMENT_ALIGNMENT;
constexpr std::uint64_t kMinHeapAlignment = 64ull * 1024ull;

}  // namespace

void GpuMemoryAllocator::Initialize(ID3D12Device* device, ResourceLifetimeTracker* lifetimeTracker) {
  Initialize(device, lifetimeTracker, Config{});
}

void GpuMemoryAllocator::Initialize(ID3D12Device* device, ResourceLifetimeTracker* lifetimeTracker, const Config& config) {
  if (!device) {
    throw std::runtime_error("GpuMemoryAllocator::Initialize requires a valid device.");
  }
  std::lock_guard<std::mutex> lock(mutex_);
  device_ = device;
  lifetimeTracker_ = lifetimeTracker;
  config_ = config;
  pages_.clear();
  nextHeapId_ = 1;
}

void GpuMemoryAllocator::Shutdown() {
  std::lock_guard<std::mutex> lock(mutex_);
  pages_.clear();
  device_.Reset();
  lifetimeTracker_ = nullptr;
  nextHeapId_ = 1;
}

GpuAllocation GpuMemoryAllocator::Allocate(
  std::uint64_t size,
  std::uint64_t alignment,
  D3D12_HEAP_TYPE heapType,
  D3D12_HEAP_FLAGS heapFlags
) {
  if (!device_) {
    throw std::runtime_error("GpuMemoryAllocator must be initialized before Allocate.");
  }
  if (size == 0) {
    return {};
  }

  const std::uint64_t resolvedAlignment = std::max<std::uint64_t>(1, alignment);
  std::lock_guard<std::mutex> lock(mutex_);

  for (auto& page : pages_) {
    if (page.heapType != heapType || page.heapFlags != heapFlags) {
      continue;
    }
    auto allocation = TryAllocateFromPage(page, size, resolvedAlignment);
    if (allocation.IsValid()) {
      return allocation;
    }
  }

  auto& page = CreatePage(size + resolvedAlignment, heapType, heapFlags);
  auto allocation = TryAllocateFromPage(page, size, resolvedAlignment);
  if (!allocation.IsValid()) {
    throw std::runtime_error("GpuMemoryAllocator failed to allocate from a freshly created page.");
  }
  return allocation;
}

void GpuMemoryAllocator::Retire(const GpuAllocation& allocation, QueueType queue, std::uint64_t fenceValue) {
  if (!allocation.IsValid()) {
    return;
  }
  if (!lifetimeTracker_) {
    FreeImmediate(allocation);
    return;
  }
  lifetimeTracker_->Retire(queue, fenceValue, [this, allocation]() {
    FreeImmediate(allocation);
  });
}

void GpuMemoryAllocator::FreeImmediate(const GpuAllocation& allocation) {
  if (!allocation.IsValid()) {
    return;
  }
  std::lock_guard<std::mutex> lock(mutex_);
  auto* page = FindPage(allocation.heapId);
  if (!page) {
    return;
  }
  page->freeRanges.push_back({allocation.offset, allocation.size});
  if (page->liveAllocations > 0) {
    page->liveAllocations -= 1;
  }
  CoalesceRanges(*page);
}

ComPtr<ID3D12Resource> GpuMemoryAllocator::CreatePlacedBuffer(
  std::uint64_t size,
  D3D12_RESOURCE_FLAGS flags,
  D3D12_RESOURCE_STATES initialState,
  D3D12_HEAP_TYPE heapType,
  GpuAllocation* outAllocation
) {
  D3D12_RESOURCE_DESC desc{};
  desc.Dimension = D3D12_RESOURCE_DIMENSION_BUFFER;
  desc.Alignment = 0;
  desc.Width = std::max<std::uint64_t>(size, 1);
  desc.Height = 1;
  desc.DepthOrArraySize = 1;
  desc.MipLevels = 1;
  desc.Format = DXGI_FORMAT_UNKNOWN;
  desc.SampleDesc.Count = 1;
  desc.SampleDesc.Quality = 0;
  desc.Layout = D3D12_TEXTURE_LAYOUT_ROW_MAJOR;
  desc.Flags = flags;

  return CreatePlacedResource(
    desc,
    nullptr,
    initialState,
    heapType,
    D3D12_HEAP_FLAG_ALLOW_ONLY_BUFFERS,
    kDefaultAlignment,
    outAllocation
  );
}

ComPtr<ID3D12Resource> GpuMemoryAllocator::CreatePlacedTexture(
  const D3D12_RESOURCE_DESC& desc,
  const D3D12_CLEAR_VALUE* clearValue,
  D3D12_RESOURCE_STATES initialState,
  D3D12_HEAP_TYPE heapType,
  GpuAllocation* outAllocation
) {
  D3D12_HEAP_FLAGS heapFlags = D3D12_HEAP_FLAG_NONE;
  if (desc.Dimension == D3D12_RESOURCE_DIMENSION_BUFFER) {
    heapFlags = D3D12_HEAP_FLAG_ALLOW_ONLY_BUFFERS;
  } else if ((desc.Flags & (D3D12_RESOURCE_FLAG_ALLOW_RENDER_TARGET | D3D12_RESOURCE_FLAG_ALLOW_DEPTH_STENCIL)) != 0) {
    heapFlags = D3D12_HEAP_FLAG_ALLOW_ONLY_RT_DS_TEXTURES;
  } else {
    heapFlags = D3D12_HEAP_FLAG_ALLOW_ONLY_NON_RT_DS_TEXTURES;
  }

  const std::uint64_t alignment = desc.Alignment > 0
    ? static_cast<std::uint64_t>(desc.Alignment)
    : (desc.SampleDesc.Count > 1 ? D3D12_DEFAULT_MSAA_RESOURCE_PLACEMENT_ALIGNMENT : kDefaultAlignment);
  return CreatePlacedResource(desc, clearValue, initialState, heapType, heapFlags, alignment, outAllocation);
}

std::uint64_t GpuMemoryAllocator::AlignUp(std::uint64_t value, std::uint64_t alignment) {
  if (alignment <= 1) {
    return value;
  }
  const auto mask = alignment - 1;
  return (value + mask) & ~mask;
}

std::uint64_t GpuMemoryAllocator::ResolvePageSize(D3D12_HEAP_TYPE heapType) const {
  switch (heapType) {
    case D3D12_HEAP_TYPE_UPLOAD:
      return std::max<std::uint64_t>(config_.uploadHeapBytes, kMinHeapAlignment);
    case D3D12_HEAP_TYPE_READBACK:
      return std::max<std::uint64_t>(config_.readbackHeapBytes, kMinHeapAlignment);
    case D3D12_HEAP_TYPE_DEFAULT:
    default:
      return std::max<std::uint64_t>(config_.defaultHeapBytes, kMinHeapAlignment);
  }
}

GpuMemoryAllocator::HeapPage* GpuMemoryAllocator::FindPage(std::uint64_t id) {
  for (auto& page : pages_) {
    if (page.id == id) {
      return &page;
    }
  }
  return nullptr;
}

const GpuMemoryAllocator::HeapPage* GpuMemoryAllocator::FindPage(std::uint64_t id) const {
  for (const auto& page : pages_) {
    if (page.id == id) {
      return &page;
    }
  }
  return nullptr;
}

GpuAllocation GpuMemoryAllocator::TryAllocateFromPage(HeapPage& page, std::uint64_t size, std::uint64_t alignment) {
  for (std::size_t index = 0; index < page.freeRanges.size(); ++index) {
    const auto range = page.freeRanges[index];
    const auto alignedStart = AlignUp(range.offset, alignment);
    const auto padding = alignedStart - range.offset;
    if (padding + size > range.size) {
      continue;
    }

    const auto usedEnd = alignedStart + size;
    const auto rangeEnd = range.offset + range.size;
    std::vector<FreeRange> replacements;
    if (padding > 0) {
      replacements.push_back({range.offset, padding});
    }
    if (usedEnd < rangeEnd) {
      replacements.push_back({usedEnd, rangeEnd - usedEnd});
    }

    page.freeRanges.erase(page.freeRanges.begin() + static_cast<std::ptrdiff_t>(index));
    page.freeRanges.insert(
      page.freeRanges.begin() + static_cast<std::ptrdiff_t>(index),
      replacements.begin(),
      replacements.end()
    );
    page.liveAllocations += 1;
    return {
      page.id,
      alignedStart,
      size,
      alignment,
      page.heapType,
      page.heapFlags
    };
  }
  return {};
}

GpuMemoryAllocator::HeapPage& GpuMemoryAllocator::CreatePage(
  std::uint64_t minSize,
  D3D12_HEAP_TYPE heapType,
  D3D12_HEAP_FLAGS heapFlags
) {
  if (!device_) {
    throw std::runtime_error("GpuMemoryAllocator::CreatePage requires an initialized device.");
  }
  const auto pageSize = AlignUp(std::max(ResolvePageSize(heapType), minSize), kMinHeapAlignment);

  D3D12_HEAP_DESC heapDesc{};
  heapDesc.SizeInBytes = pageSize;
  heapDesc.Alignment = 0;
  heapDesc.Flags = heapFlags;
  heapDesc.Properties.Type = heapType;
  heapDesc.Properties.CPUPageProperty = D3D12_CPU_PAGE_PROPERTY_UNKNOWN;
  heapDesc.Properties.MemoryPoolPreference = D3D12_MEMORY_POOL_UNKNOWN;
  heapDesc.Properties.CreationNodeMask = 0;
  heapDesc.Properties.VisibleNodeMask = 0;

  ComPtr<ID3D12Heap> heap;
  ThrowIfFailed(
    device_->CreateHeap(&heapDesc, IID_PPV_ARGS(&heap)),
    "Failed to create D3D12 heap page for GPU allocator."
  );

  HeapPage page{};
  page.id = nextHeapId_++;
  page.size = pageSize;
  page.heapType = heapType;
  page.heapFlags = heapFlags;
  page.liveAllocations = 0;
  page.heap = std::move(heap);
  page.freeRanges.push_back({0, pageSize});
  pages_.push_back(std::move(page));
  return pages_.back();
}

void GpuMemoryAllocator::CoalesceRanges(HeapPage& page) {
  if (page.freeRanges.empty()) {
    return;
  }
  std::sort(page.freeRanges.begin(), page.freeRanges.end(), [](const FreeRange& left, const FreeRange& right) {
    return left.offset < right.offset;
  });

  std::vector<FreeRange> merged;
  merged.reserve(page.freeRanges.size());
  merged.push_back(page.freeRanges.front());
  for (std::size_t i = 1; i < page.freeRanges.size(); ++i) {
    auto& tail = merged.back();
    const auto& current = page.freeRanges[i];
    const auto tailEnd = tail.offset + tail.size;
    if (current.offset <= tailEnd) {
      tail.size = std::max(tailEnd, current.offset + current.size) - tail.offset;
      continue;
    }
    merged.push_back(current);
  }
  page.freeRanges.swap(merged);
}

ComPtr<ID3D12Resource> GpuMemoryAllocator::CreatePlacedResource(
  const D3D12_RESOURCE_DESC& desc,
  const D3D12_CLEAR_VALUE* clearValue,
  D3D12_RESOURCE_STATES initialState,
  D3D12_HEAP_TYPE heapType,
  D3D12_HEAP_FLAGS heapFlags,
  std::uint64_t alignment,
  GpuAllocation* outAllocation
) {
  if (!device_) {
    throw std::runtime_error("GpuMemoryAllocator::CreatePlacedResource requires an initialized allocator.");
  }

  D3D12_RESOURCE_ALLOCATION_INFO allocationInfo = device_->GetResourceAllocationInfo(0, 1, &desc);
  const auto size = std::max<std::uint64_t>(allocationInfo.SizeInBytes, 1);
  const auto resolvedAlignment = std::max<std::uint64_t>(alignment, std::max<std::uint64_t>(allocationInfo.Alignment, 1));
  auto allocation = Allocate(size, resolvedAlignment, heapType, heapFlags);

  ComPtr<ID3D12Resource> resource;
  {
    std::lock_guard<std::mutex> lock(mutex_);
    auto* page = FindPage(allocation.heapId);
    if (!page) {
      throw std::runtime_error("Placed resource allocation references an unknown heap page.");
    }
    HRESULT hr = device_->CreatePlacedResource(
      page->heap.Get(),
      allocation.offset,
      &desc,
      initialState,
      clearValue,
      IID_PPV_ARGS(&resource)
    );
    if (FAILED(hr)) {
      page->freeRanges.push_back({allocation.offset, allocation.size});
      if (page->liveAllocations > 0) {
        page->liveAllocations -= 1;
      }
      CoalesceRanges(*page);
      ThrowIfFailed(hr, "Failed to create placed resource.");
    }
  }

  if (outAllocation) {
    *outAllocation = allocation;
  }
  return resource;
}

}  // namespace dx12
