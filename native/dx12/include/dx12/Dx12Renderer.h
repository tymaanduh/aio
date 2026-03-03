#pragma once

#include "dx12/AssetHotReload.h"
#include "dx12/CommandRecording.h"
#include "dx12/Common.h"
#include "dx12/DescriptorAllocator.h"
#include "dx12/FrameGraph.h"
#include "dx12/GpuMemoryAllocator.h"
#include "dx12/PipelineCache.h"
#include "dx12/RenderTypes.h"
#include "dx12/ResourceLifetimeTracker.h"

namespace dx12 {

struct RendererConfig {
  std::uint32_t width = 1920;
  std::uint32_t height = 1080;
  std::uint32_t workerThreads = 0;
  bool enableAsyncCompute = true;
  bool enableHotReload = false;
};

struct FrameInput {
  std::vector<PartitionBatch> graphicsBatches;
  std::vector<ComputeTask> asyncComputeTasks;
  std::vector<CopyTask> copyTasks;
  bool allowAsyncCompute = true;
};

class Dx12Renderer {
 public:
  void Initialize(HWND windowHandle, const RendererConfig& config);
  void Shutdown();

  void RenderFrame(const FrameInput& input);
  void WaitForGpuIdle();

  void SetHotReloadEnabled(bool enabled);
  void WatchAsset(const HotAssetWatch& watch);
  void UnwatchAsset(const std::string& key);

 private:
  struct FrameContext {
    ComPtr<ID3D12CommandAllocator> graphicsAllocator;
    ComPtr<ID3D12CommandAllocator> computeAllocator;
    ComPtr<ID3D12CommandAllocator> copyAllocator;
    ComPtr<ID3D12GraphicsCommandList> computeList;
    ComPtr<ID3D12GraphicsCommandList> copyList;
    ComPtr<ID3D12GraphicsCommandList> graphicsFallbackList;
    std::uint64_t fenceValue = 0;
  };

  void CreateDeviceAndQueues();
  void CreateSwapChain();
  void CreateFrameContexts();
  void CreatePersistentHeaps();
  void CreatePipelineStateCache();
  void ResetFrameContext(std::uint32_t frameIndex);
  void SubmitGraphicsLists(std::vector<ComPtr<ID3D12CommandList>>&& lists);
  void SubmitAsyncCompute(const std::vector<ComputeTask>& tasks, std::uint32_t frameIndex, bool allowAsyncCompute);
  void SubmitCopyTasks(const std::vector<CopyTask>& tasks, std::uint32_t frameIndex);
  void ExecuteFrameGraph(ID3D12GraphicsCommandList* list, const CompiledFrameGraph& graph);
  void PollHotReload();

  HWND windowHandle_ = nullptr;
  RendererConfig config_{};

  ComPtr<IDXGIFactory6> factory_;
  ComPtr<IDXGIAdapter1> adapter_;
  ComPtr<ID3D12Device> device_;
  ComPtr<ID3D12CommandQueue> graphicsQueue_;
  ComPtr<ID3D12CommandQueue> computeQueue_;
  ComPtr<IDXGISwapChain3> swapChain_;
  ComPtr<ID3D12Fence> graphicsFence_;
  ComPtr<ID3D12Fence> computeFence_;
  ComPtr<ID3D12CommandQueue> copyQueue_;
  ComPtr<ID3D12Fence> copyFence_;
  HANDLE graphicsFenceEvent_ = nullptr;

  std::array<FrameContext, kFrameBufferCount> frames_{};
  std::uint32_t frameIndex_ = 0;
  std::uint64_t nextGraphicsFenceValue_ = 1;
  std::uint64_t nextComputeFenceValue_ = 1;
  std::uint64_t nextCopyFenceValue_ = 1;
  std::uint64_t lastCopySubmitFenceValue_ = 0;

  DescriptorAllocator bindlessAllocator_;
  DescriptorAllocator rtvAllocator_;
  DescriptorAllocator dsvAllocator_;
  ResourceLifetimeTracker lifetimeTracker_;
  GpuMemoryAllocator gpuAllocator_;
  PipelineCache pipelineCache_;
  FrameGraphBuilder frameGraphBuilder_;
  CommandRecordingSystem commandRecording_;
  AssetHotReloadSystem hotReload_;
};

}  // namespace dx12
