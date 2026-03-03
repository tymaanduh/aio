#pragma once

#include "dx12/Common.h"
#include "dx12/RenderTypes.h"

namespace dx12 {

class ResourceLifetimeTracker {
 public:
  using ReleaseCallback = std::function<void()>;

  void Retire(QueueType queue, std::uint64_t fenceValue, ReleaseCallback release);
  void Poll(std::uint64_t graphicsCompleted, std::uint64_t computeCompleted, std::uint64_t copyCompleted);
  void FlushAll();

 private:
  struct RetiredItem {
    std::uint64_t fenceValue = 0;
    ReleaseCallback release;
  };

  std::vector<RetiredItem>& QueueFor(QueueType queue);
  static void CollectCompleted(std::vector<RetiredItem>& queue, std::uint64_t completedFence, std::vector<ReleaseCallback>& ready);

  std::vector<RetiredItem> graphicsQueue_;
  std::vector<RetiredItem> computeQueue_;
  std::vector<RetiredItem> copyQueue_;
  std::mutex mutex_;
};

}  // namespace dx12
