#pragma once

#include "dx12/Common.h"

namespace dx12 {

enum class QueueType : std::uint8_t {
  Graphics = 0,
  Compute = 1,
  Copy = 2
};

enum class ResourceUsage : std::uint8_t {
  Read = 0,
  Write = 1,
  ReadWrite = 2
};

struct DrawSortKey {
  std::uint32_t rootSignatureId = 0;
  std::uint32_t psoId = 0;
  std::uint32_t descriptorLayoutId = 0;
  std::uint32_t materialId = 0;
  std::uint32_t meshId = 0;
};

struct DrawPacket {
  DrawSortKey sort;
  D3D12_GPU_VIRTUAL_ADDRESS rootConstantsAddress = 0;
  std::uint32_t rootConstantCount32 = 0;
  D3D12_VERTEX_BUFFER_VIEW vertexBuffer{};
  D3D12_INDEX_BUFFER_VIEW indexBuffer{};
  std::uint32_t indexCount = 0;
  std::uint32_t instanceCount = 1;
  std::uint32_t firstIndex = 0;
  std::int32_t baseVertex = 0;
  std::uint32_t firstInstance = 0;
};

struct PartitionBatch {
  std::uint32_t partitionId = 0;
  std::vector<DrawPacket> draws;
};

struct ComputeTask {
  std::string name;
  bool requiresGraphicsWait = false;
  std::function<void(ID3D12GraphicsCommandList*)> record;
};

struct CopyTask {
  std::string name;
  std::function<void(ID3D12GraphicsCommandList*)> record;
};

}  // namespace dx12
