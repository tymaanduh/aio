#pragma once

#include "dx12/Common.h"

namespace dx12 {

enum class HotAssetType : std::uint8_t {
  Shader = 0,
  Texture = 1,
  Mesh = 2
};

struct HotAssetWatch {
  std::string key;
  std::filesystem::path path;
  HotAssetType type = HotAssetType::Shader;
  std::function<void(const HotAssetWatch&)> onReload;
};

class AssetHotReloadSystem {
 public:
  void Watch(const HotAssetWatch& watch);
  void Unwatch(const std::string& key);
  void Clear();
  void Poll();

 private:
  struct WatchEntry {
    HotAssetWatch watch;
    std::filesystem::file_time_type lastWrite{};
    bool initialized = false;
  };

  std::unordered_map<std::string, WatchEntry> watches_;
  std::mutex mutex_;
};

}  // namespace dx12
