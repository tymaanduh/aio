#include "dx12/DescriptorAllocator.h"

#include <algorithm>

#include "dx12/ResourceLifetimeTracker.h"

namespace dx12 {

void DescriptorAllocator::Initialize(ID3D12Device* device, const Config& config) {
  if (!device) {
    throw std::runtime_error("DescriptorAllocator::Initialize requires a valid device.");
  }

  config_ = config;
  const std::uint64_t reservedDynamic = static_cast<std::uint64_t>(config.frameDynamicDescriptors) * kFrameBufferCount;
  if (reservedDynamic > config.totalDescriptors) {
    throw std::runtime_error("DescriptorAllocator config reserves more dynamic descriptors than heap capacity.");
  }
  D3D12_DESCRIPTOR_HEAP_DESC desc{};
  desc.Type = config.type;
  desc.NumDescriptors = config.totalDescriptors;
  desc.Flags = config.shaderVisible ? D3D12_DESCRIPTOR_HEAP_FLAG_SHADER_VISIBLE : D3D12_DESCRIPTOR_HEAP_FLAG_NONE;
  desc.NodeMask = 0;

  ThrowIfFailed(device->CreateDescriptorHeap(&desc, IID_PPV_ARGS(&heap_)), "Failed to create descriptor heap.");
  descriptorIncrement_ = device->GetDescriptorHandleIncrementSize(config.type);

  staticHead_ = 0;
  freeList_.clear();
  dynamicHeads_.fill(config.totalDescriptors - config.frameDynamicDescriptors * kFrameBufferCount);
}

void DescriptorAllocator::SetLifetimeTracker(ResourceLifetimeTracker* tracker) {
  std::lock_guard<std::mutex> lock(mutex_);
  lifetimeTracker_ = tracker;
}

DescriptorRange DescriptorAllocator::AllocateStatic(std::uint32_t count) {
  if (count == 0) {
    return {};
  }

  std::lock_guard<std::mutex> lock(mutex_);

  for (std::size_t index = 0; index < freeList_.size(); ++index) {
    auto& block = freeList_[index];
    if (block.count < count) {
      continue;
    }
    DescriptorRange allocated{block.begin, count};
    block.begin += count;
    block.count -= count;
    if (block.count == 0) {
      freeList_.erase(freeList_.begin() + static_cast<std::ptrdiff_t>(index));
    }
    return allocated;
  }

  const std::uint32_t dynamicBase = config_.totalDescriptors - config_.frameDynamicDescriptors * kFrameBufferCount;
  if (staticHead_ + count > dynamicBase) {
    throw std::runtime_error("Static descriptor heap exhausted.");
  }

  DescriptorRange range{staticHead_, count};
  staticHead_ += count;
  return range;
}

void DescriptorAllocator::FreeStatic(DescriptorRange range) {
  if (range.count == 0) {
    return;
  }
  std::lock_guard<std::mutex> lock(mutex_);
  freeList_.push_back({range.begin, range.count});
  CoalesceFreeList();
}

void DescriptorAllocator::RetireStatic(DescriptorRange range, QueueType queue, std::uint64_t fenceValue) {
  if (range.count == 0) {
    return;
  }
  ResourceLifetimeTracker* tracker = nullptr;
  {
    std::lock_guard<std::mutex> lock(mutex_);
    tracker = lifetimeTracker_;
  }
  if (!tracker) {
    FreeStatic(range);
    return;
  }
  tracker->Retire(queue, fenceValue, [this, range]() {
    FreeStatic(range);
  });
}

void DescriptorAllocator::BeginFrame(std::uint32_t frameIndex) {
  const std::uint32_t slot = frameIndex % kFrameBufferCount;
  const std::uint32_t dynamicBase = config_.totalDescriptors - config_.frameDynamicDescriptors * kFrameBufferCount;
  dynamicHeads_[slot] = dynamicBase + slot * config_.frameDynamicDescriptors;
}

DescriptorRange DescriptorAllocator::AllocateDynamic(std::uint32_t count, std::uint32_t frameIndex) {
  if (count == 0) {
    return {};
  }

  const std::uint32_t slot = frameIndex % kFrameBufferCount;
  const std::uint32_t frameBase = config_.totalDescriptors - config_.frameDynamicDescriptors * kFrameBufferCount
    + slot * config_.frameDynamicDescriptors;
  const std::uint32_t frameEnd = frameBase + config_.frameDynamicDescriptors;
  const std::uint32_t head = dynamicHeads_[slot];
  if (head + count > frameEnd) {
    throw std::runtime_error("Per-frame dynamic descriptor ring exhausted.");
  }
  dynamicHeads_[slot] = head + count;
  return {head, count};
}

DescriptorHandle DescriptorAllocator::GetHandle(std::uint32_t index) const {
  DescriptorHandle handle{};
  if (!heap_) {
    return handle;
  }
  auto cpu = heap_->GetCPUDescriptorHandleForHeapStart();
  cpu.ptr += static_cast<SIZE_T>(index) * descriptorIncrement_;
  handle.cpu = cpu;
  handle.index = index;

  if (config_.shaderVisible) {
    auto gpu = heap_->GetGPUDescriptorHandleForHeapStart();
    gpu.ptr += static_cast<UINT64>(index) * descriptorIncrement_;
    handle.gpu = gpu;
  }
  return handle;
}

void DescriptorAllocator::CoalesceFreeList() {
  if (freeList_.empty()) {
    return;
  }
  std::sort(
    freeList_.begin(),
    freeList_.end(),
    [](const FreeBlock& left, const FreeBlock& right) { return left.begin < right.begin; }
  );

  std::vector<FreeBlock> merged;
  merged.reserve(freeList_.size());
  merged.push_back(freeList_.front());
  for (std::size_t i = 1; i < freeList_.size(); ++i) {
    auto& tail = merged.back();
    const auto& current = freeList_[i];
    if (tail.begin + tail.count == current.begin) {
      tail.count += current.count;
      continue;
    }
    merged.push_back(current);
  }
  freeList_.swap(merged);
}

}  // namespace dx12
