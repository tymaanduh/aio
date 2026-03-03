#pragma once

#include "dx12/Common.h"

#include <d3d12shader.h>

namespace dx12 {

struct ShaderBindingDesc {
  std::string name;
  D3D_SHADER_INPUT_TYPE type = D3D_SIT_TEXTURE;
  std::uint32_t bindPoint = 0;
  std::uint32_t bindCount = 0;
  std::uint32_t space = 0;
};

struct ShaderReflectionLayout {
  std::vector<ShaderBindingDesc> bindings;
  std::uint32_t constantBufferBytes = 0;
};

class ShaderBindingSystem {
 public:
  ShaderReflectionLayout ReflectAndCache(const std::string& shaderKey, std::span<const std::uint8_t> bytecode);
  const ShaderReflectionLayout* Find(const std::string& shaderKey) const;
  std::optional<ShaderBindingDesc> FindBinding(const std::string& shaderKey, std::string_view name) const;
  void Clear();

 private:
  mutable std::shared_mutex mutex_;
  std::unordered_map<std::string, ShaderReflectionLayout> layouts_;
};

}  // namespace dx12
