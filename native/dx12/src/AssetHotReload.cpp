#include "dx12/AssetHotReload.h"

namespace dx12 {

void AssetHotReloadSystem::Watch(const HotAssetWatch& watch) {
  if (watch.key.empty() || watch.path.empty()) {
    throw std::runtime_error("AssetHotReloadSystem::Watch requires non-empty key and path.");
  }

  WatchEntry entry{};
  entry.watch = watch;
  if (std::filesystem::exists(watch.path)) {
    entry.lastWrite = std::filesystem::last_write_time(watch.path);
    entry.initialized = true;
  }

  std::lock_guard<std::mutex> lock(mutex_);
  watches_[watch.key] = std::move(entry);
}

void AssetHotReloadSystem::Unwatch(const std::string& key) {
  std::lock_guard<std::mutex> lock(mutex_);
  watches_.erase(key);
}

void AssetHotReloadSystem::Clear() {
  std::lock_guard<std::mutex> lock(mutex_);
  watches_.clear();
}

void AssetHotReloadSystem::Poll() {
  std::vector<HotAssetWatch> toReload;
  {
    std::lock_guard<std::mutex> lock(mutex_);
    for (auto& [key, entry] : watches_) {
      (void)key;
      if (!std::filesystem::exists(entry.watch.path)) {
        continue;
      }
      const auto writeTime = std::filesystem::last_write_time(entry.watch.path);
      if (!entry.initialized) {
        entry.initialized = true;
        entry.lastWrite = writeTime;
        continue;
      }
      if (writeTime <= entry.lastWrite) {
        continue;
      }
      entry.lastWrite = writeTime;
      toReload.push_back(entry.watch);
    }
  }

  for (const auto& watch : toReload) {
    if (watch.onReload) {
      watch.onReload(watch);
    }
  }
}

}  // namespace dx12
