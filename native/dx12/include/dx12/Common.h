#pragma once

#include <array>
#include <atomic>
#include <chrono>
#include <cstdint>
#include <deque>
#include <filesystem>
#include <functional>
#include <future>
#include <mutex>
#include <optional>
#include <shared_mutex>
#include <span>
#include <stdexcept>
#include <string>
#include <string_view>
#include <thread>
#include <unordered_map>
#include <utility>
#include <vector>

#include <windows.h>
#include <d3d12.h>
#include <dxgi1_6.h>
#include <wrl/client.h>

namespace dx12 {

using Microsoft::WRL::ComPtr;

inline void ThrowIfFailed(HRESULT hr, const char* message) {
  if (FAILED(hr)) {
    throw std::runtime_error(message ? message : "DirectX call failed.");
  }
}

constexpr std::uint32_t kFrameBufferCount = 3;

struct FrameToken {
  std::uint32_t index = 0;
  std::uint64_t fenceValue = 0;
};

}  // namespace dx12
