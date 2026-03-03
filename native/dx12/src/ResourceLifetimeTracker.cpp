#include "dx12/ResourceLifetimeTracker.h"

#include <algorithm>

namespace dx12 {

void ResourceLifetimeTracker::Retire(QueueType queue, std::uint64_t fenceValue, ReleaseCallback release) {
  if (!release) {
    return;
  }
  std::lock_guard<std::mutex> lock(mutex_);
  auto& target = QueueFor(queue);
  target.push_back({fenceValue, std::move(release)});
}

void ResourceLifetimeTracker::Poll(
  std::uint64_t graphicsCompleted,
  std::uint64_t computeCompleted,
  std::uint64_t copyCompleted
) {
  std::vector<ReleaseCallback> ready;
  {
    std::lock_guard<std::mutex> lock(mutex_);
    CollectCompleted(graphicsQueue_, graphicsCompleted, ready);
    CollectCompleted(computeQueue_, computeCompleted, ready);
    CollectCompleted(copyQueue_, copyCompleted, ready);
  }

  for (auto& callback : ready) {
    callback();
  }
}

void ResourceLifetimeTracker::FlushAll() {
  std::vector<ReleaseCallback> ready;
  {
    std::lock_guard<std::mutex> lock(mutex_);
    for (auto& item : graphicsQueue_) {
      if (item.release) {
        ready.push_back(std::move(item.release));
      }
    }
    for (auto& item : computeQueue_) {
      if (item.release) {
        ready.push_back(std::move(item.release));
      }
    }
    for (auto& item : copyQueue_) {
      if (item.release) {
        ready.push_back(std::move(item.release));
      }
    }
    graphicsQueue_.clear();
    computeQueue_.clear();
    copyQueue_.clear();
  }

  for (auto& callback : ready) {
    callback();
  }
}

std::vector<ResourceLifetimeTracker::RetiredItem>& ResourceLifetimeTracker::QueueFor(QueueType queue) {
  switch (queue) {
    case QueueType::Graphics:
      return graphicsQueue_;
    case QueueType::Compute:
      return computeQueue_;
    case QueueType::Copy:
      return copyQueue_;
    default:
      return graphicsQueue_;
  }
}

void ResourceLifetimeTracker::CollectCompleted(
  std::vector<RetiredItem>& queue,
  std::uint64_t completedFence,
  std::vector<ReleaseCallback>& ready
) {
  if (queue.empty()) {
    return;
  }

  std::stable_sort(queue.begin(), queue.end(), [](const RetiredItem& left, const RetiredItem& right) {
    return left.fenceValue < right.fenceValue;
  });

  auto split = std::find_if(queue.begin(), queue.end(), [completedFence](const RetiredItem& item) {
    return item.fenceValue > completedFence;
  });

  for (auto it = queue.begin(); it != split; ++it) {
    if (it->release) {
      ready.push_back(std::move(it->release));
    }
  }
  queue.erase(queue.begin(), split);
}

}  // namespace dx12
