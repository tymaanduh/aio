#include "dx12/Dx12Renderer.h"

#include <algorithm>

namespace dx12 {

namespace {

constexpr DXGI_FORMAT kSwapChainFormat = DXGI_FORMAT_R8G8B8A8_UNORM;

std::uint32_t ResolveWorkerCount(std::uint32_t configured) {
  if (configured > 0) {
    return configured;
  }
  const auto hw = std::max(1u, std::thread::hardware_concurrency());
  return std::max(1u, hw - 1);
}

}  // namespace

void Dx12Renderer::Initialize(HWND windowHandle, const RendererConfig& config) {
  if (!windowHandle) {
    throw std::runtime_error("Dx12Renderer::Initialize requires a valid window handle.");
  }
  windowHandle_ = windowHandle;
  config_ = config;

  CreateDeviceAndQueues();
  CreateSwapChain();
  CreateFrameContexts();
  CreatePersistentHeaps();
  CreatePipelineStateCache();

  ThrowIfFailed(
    device_->CreateFence(0, D3D12_FENCE_FLAG_NONE, IID_PPV_ARGS(&graphicsFence_)),
    "Failed to create graphics fence."
  );
  ThrowIfFailed(
    device_->CreateFence(0, D3D12_FENCE_FLAG_NONE, IID_PPV_ARGS(&computeFence_)),
    "Failed to create compute fence."
  );
  ThrowIfFailed(
    device_->CreateFence(0, D3D12_FENCE_FLAG_NONE, IID_PPV_ARGS(&copyFence_)),
    "Failed to create copy fence."
  );

  graphicsFenceEvent_ = CreateEvent(nullptr, FALSE, FALSE, nullptr);
  if (!graphicsFenceEvent_) {
    throw std::runtime_error("Failed to create fence event.");
  }

  commandRecording_.Initialize(device_.Get(), ResolveWorkerCount(config_.workerThreads), kFrameBufferCount);
}

void Dx12Renderer::Shutdown() {
  WaitForGpuIdle();
  lifetimeTracker_.FlushAll();
  commandRecording_.Shutdown();
  hotReload_.Clear();
  gpuAllocator_.Shutdown();

  if (graphicsFenceEvent_) {
    CloseHandle(graphicsFenceEvent_);
    graphicsFenceEvent_ = nullptr;
  }

  swapChain_.Reset();
  graphicsQueue_.Reset();
  computeQueue_.Reset();
  copyQueue_.Reset();
  graphicsFence_.Reset();
  computeFence_.Reset();
  copyFence_.Reset();
  device_.Reset();
  adapter_.Reset();
  factory_.Reset();
}

void Dx12Renderer::SetHotReloadEnabled(bool enabled) {
  config_.enableHotReload = enabled;
}

void Dx12Renderer::WatchAsset(const HotAssetWatch& watch) {
  hotReload_.Watch(watch);
}

void Dx12Renderer::UnwatchAsset(const std::string& key) {
  hotReload_.Unwatch(key);
}

void Dx12Renderer::CreateDeviceAndQueues() {
  ThrowIfFailed(CreateDXGIFactory2(0, IID_PPV_ARGS(&factory_)), "Failed to create DXGI factory.");

  ComPtr<IDXGIAdapter1> candidate;
  for (UINT index = 0; factory_->EnumAdapters1(index, &candidate) != DXGI_ERROR_NOT_FOUND; ++index) {
    DXGI_ADAPTER_DESC1 desc{};
    candidate->GetDesc1(&desc);
    if (desc.Flags & DXGI_ADAPTER_FLAG_SOFTWARE) {
      continue;
    }
    if (SUCCEEDED(D3D12CreateDevice(candidate.Get(), D3D_FEATURE_LEVEL_12_0, IID_PPV_ARGS(&device_)))) {
      adapter_ = candidate;
      break;
    }
  }
  if (!device_) {
    ThrowIfFailed(
      D3D12CreateDevice(nullptr, D3D_FEATURE_LEVEL_12_0, IID_PPV_ARGS(&device_)),
      "Failed to create D3D12 device."
    );
  }

  D3D12_COMMAND_QUEUE_DESC graphicsDesc{};
  graphicsDesc.Type = D3D12_COMMAND_LIST_TYPE_DIRECT;
  graphicsDesc.Priority = D3D12_COMMAND_QUEUE_PRIORITY_HIGH;
  graphicsDesc.Flags = D3D12_COMMAND_QUEUE_FLAG_NONE;
  ThrowIfFailed(device_->CreateCommandQueue(&graphicsDesc, IID_PPV_ARGS(&graphicsQueue_)), "Failed to create graphics queue.");

  D3D12_COMMAND_QUEUE_DESC computeDesc{};
  computeDesc.Type = D3D12_COMMAND_LIST_TYPE_COMPUTE;
  computeDesc.Priority = D3D12_COMMAND_QUEUE_PRIORITY_NORMAL;
  computeDesc.Flags = D3D12_COMMAND_QUEUE_FLAG_NONE;
  ThrowIfFailed(device_->CreateCommandQueue(&computeDesc, IID_PPV_ARGS(&computeQueue_)), "Failed to create compute queue.");

  D3D12_COMMAND_QUEUE_DESC copyDesc{};
  copyDesc.Type = D3D12_COMMAND_LIST_TYPE_COPY;
  copyDesc.Priority = D3D12_COMMAND_QUEUE_PRIORITY_NORMAL;
  copyDesc.Flags = D3D12_COMMAND_QUEUE_FLAG_NONE;
  ThrowIfFailed(device_->CreateCommandQueue(&copyDesc, IID_PPV_ARGS(&copyQueue_)), "Failed to create copy queue.");
}

void Dx12Renderer::CreateSwapChain() {
  DXGI_SWAP_CHAIN_DESC1 desc{};
  desc.Width = config_.width;
  desc.Height = config_.height;
  desc.Format = kSwapChainFormat;
  desc.BufferCount = kFrameBufferCount;
  desc.BufferUsage = DXGI_USAGE_RENDER_TARGET_OUTPUT;
  desc.SwapEffect = DXGI_SWAP_EFFECT_FLIP_DISCARD;
  desc.SampleDesc.Count = 1;

  ComPtr<IDXGISwapChain1> swapChain1;
  ThrowIfFailed(
    factory_->CreateSwapChainForHwnd(graphicsQueue_.Get(), windowHandle_, &desc, nullptr, nullptr, &swapChain1),
    "Failed to create swap chain."
  );
  ThrowIfFailed(swapChain1.As(&swapChain_), "Failed to query IDXGISwapChain3.");
  frameIndex_ = swapChain_->GetCurrentBackBufferIndex();
}

void Dx12Renderer::CreateFrameContexts() {
  for (auto& frame : frames_) {
    ThrowIfFailed(
      device_->CreateCommandAllocator(D3D12_COMMAND_LIST_TYPE_DIRECT, IID_PPV_ARGS(&frame.graphicsAllocator)),
      "Failed to create frame graphics allocator."
    );
    ThrowIfFailed(
      device_->CreateCommandAllocator(D3D12_COMMAND_LIST_TYPE_COMPUTE, IID_PPV_ARGS(&frame.computeAllocator)),
      "Failed to create frame compute allocator."
    );
    ThrowIfFailed(
      device_->CreateCommandAllocator(D3D12_COMMAND_LIST_TYPE_COPY, IID_PPV_ARGS(&frame.copyAllocator)),
      "Failed to create frame copy allocator."
    );

    ThrowIfFailed(
      device_->CreateCommandList(
        0,
        D3D12_COMMAND_LIST_TYPE_COMPUTE,
        frame.computeAllocator.Get(),
        nullptr,
        IID_PPV_ARGS(&frame.computeList)
      ),
      "Failed to create frame compute command list."
    );
    ThrowIfFailed(frame.computeList->Close(), "Failed to close initial frame compute command list.");

    ThrowIfFailed(
      device_->CreateCommandList(
        0,
        D3D12_COMMAND_LIST_TYPE_COPY,
        frame.copyAllocator.Get(),
        nullptr,
        IID_PPV_ARGS(&frame.copyList)
      ),
      "Failed to create frame copy command list."
    );
    ThrowIfFailed(frame.copyList->Close(), "Failed to close initial frame copy command list.");

    ThrowIfFailed(
      device_->CreateCommandList(
        0,
        D3D12_COMMAND_LIST_TYPE_DIRECT,
        frame.graphicsAllocator.Get(),
        nullptr,
        IID_PPV_ARGS(&frame.graphicsFallbackList)
      ),
      "Failed to create fallback direct command list."
    );
    ThrowIfFailed(frame.graphicsFallbackList->Close(), "Failed to close fallback direct command list.");

    frame.fenceValue = 0;
  }
}

void Dx12Renderer::CreatePersistentHeaps() {
  DescriptorAllocator::Config bindlessConfig{};
  bindlessConfig.type = D3D12_DESCRIPTOR_HEAP_TYPE_CBV_SRV_UAV;
  bindlessConfig.totalDescriptors = 65536;
  bindlessConfig.frameDynamicDescriptors = 4096;
  bindlessConfig.shaderVisible = true;
  bindlessAllocator_.Initialize(device_.Get(), bindlessConfig);
  bindlessAllocator_.SetLifetimeTracker(&lifetimeTracker_);

  DescriptorAllocator::Config rtvConfig{};
  rtvConfig.type = D3D12_DESCRIPTOR_HEAP_TYPE_RTV;
  rtvConfig.totalDescriptors = 4096;
  rtvConfig.frameDynamicDescriptors = 0;
  rtvConfig.shaderVisible = false;
  rtvAllocator_.Initialize(device_.Get(), rtvConfig);
  rtvAllocator_.SetLifetimeTracker(&lifetimeTracker_);

  DescriptorAllocator::Config dsvConfig{};
  dsvConfig.type = D3D12_DESCRIPTOR_HEAP_TYPE_DSV;
  dsvConfig.totalDescriptors = 2048;
  dsvConfig.frameDynamicDescriptors = 0;
  dsvConfig.shaderVisible = false;
  dsvAllocator_.Initialize(device_.Get(), dsvConfig);
  dsvAllocator_.SetLifetimeTracker(&lifetimeTracker_);

  gpuAllocator_.Initialize(device_.Get(), &lifetimeTracker_);
}

void Dx12Renderer::CreatePipelineStateCache() {
  pipelineCache_.Initialize(device_.Get());
  pipelineCache_.SetRuntimeRebuildEnabled(config_.enableHotReload);
  // Pre-bake PSOs/root signatures before gameplay or queue async builds during loading screens.
}

void Dx12Renderer::ResetFrameContext(std::uint32_t frameIndex) {
  auto& frame = frames_[frameIndex % kFrameBufferCount];
  if (graphicsFence_ && graphicsFence_->GetCompletedValue() < frame.fenceValue) {
    ThrowIfFailed(
      graphicsFence_->SetEventOnCompletion(frame.fenceValue, graphicsFenceEvent_),
      "Failed to set fence completion event."
    );
    WaitForSingleObject(graphicsFenceEvent_, INFINITE);
  }

  bindlessAllocator_.BeginFrame(frameIndex);
  const auto completedGraphics = graphicsFence_ ? graphicsFence_->GetCompletedValue() : 0;
  const auto completedCompute = computeFence_ ? computeFence_->GetCompletedValue() : 0;
  const auto completedCopy = copyFence_ ? copyFence_->GetCompletedValue() : 0;
  lifetimeTracker_.Poll(completedGraphics, completedCompute, completedCopy);
}

void Dx12Renderer::ExecuteFrameGraph(ID3D12GraphicsCommandList* list, const CompiledFrameGraph& graph) {
  if (!list) {
    return;
  }
  for (const auto& batch : graph.barrierBatches) {
    if (batch.queue != QueueType::Graphics || batch.barriers.empty()) {
      continue;
    }
    list->ResourceBarrier(static_cast<UINT>(batch.barriers.size()), batch.barriers.data());
  }
}

void Dx12Renderer::SubmitGraphicsLists(std::vector<ComPtr<ID3D12CommandList>>&& lists) {
  if (lists.empty()) {
    return;
  }
  std::vector<ID3D12CommandList*> raw;
  raw.reserve(lists.size());
  for (auto& item : lists) {
    raw.push_back(item.Get());
  }
  graphicsQueue_->ExecuteCommandLists(static_cast<UINT>(raw.size()), raw.data());
}

void Dx12Renderer::SubmitAsyncCompute(const std::vector<ComputeTask>& tasks, std::uint32_t frameIndex, bool allowAsyncCompute) {
  if (tasks.empty()) {
    return;
  }

  auto& frame = frames_[frameIndex % kFrameBufferCount];
  const bool useAsyncQueue = config_.enableAsyncCompute && allowAsyncCompute && computeQueue_ && computeFence_;
  if (useAsyncQueue) {
    bool requiresGraphicsWait = false;
    for (const auto& task : tasks) {
      if (task.requiresGraphicsWait) {
        requiresGraphicsWait = true;
        break;
      }
    }
    if (requiresGraphicsWait && nextGraphicsFenceValue_ > 1) {
      ThrowIfFailed(
        computeQueue_->Wait(graphicsFence_.Get(), nextGraphicsFenceValue_ - 1),
        "Failed to queue graphics->compute dependency wait."
      );
    }

    ThrowIfFailed(frame.computeAllocator->Reset(), "Failed to reset compute allocator.");
    ThrowIfFailed(
      frame.computeList->Reset(frame.computeAllocator.Get(), nullptr),
      "Failed to reset compute command list."
    );

    for (const auto& task : tasks) {
      if (task.record) {
        task.record(frame.computeList.Get());
      }
    }

    ThrowIfFailed(frame.computeList->Close(), "Failed to close compute command list.");
    ID3D12CommandList* raw = frame.computeList.Get();
    computeQueue_->ExecuteCommandLists(1, &raw);
    ThrowIfFailed(computeQueue_->Signal(computeFence_.Get(), nextComputeFenceValue_), "Failed to signal compute fence.");
    ++nextComputeFenceValue_;
    return;
  }

  // Fallback path: run compute work on the graphics queue.
  ThrowIfFailed(frame.graphicsAllocator->Reset(), "Failed to reset fallback graphics allocator.");
  ThrowIfFailed(
    frame.graphicsFallbackList->Reset(frame.graphicsAllocator.Get(), nullptr),
    "Failed to reset fallback graphics command list."
  );
  for (const auto& task : tasks) {
    if (task.record) {
      task.record(frame.graphicsFallbackList.Get());
    }
  }
  ThrowIfFailed(frame.graphicsFallbackList->Close(), "Failed to close fallback graphics command list.");
  ID3D12CommandList* raw = frame.graphicsFallbackList.Get();
  graphicsQueue_->ExecuteCommandLists(1, &raw);
}

void Dx12Renderer::SubmitCopyTasks(const std::vector<CopyTask>& tasks, std::uint32_t frameIndex) {
  if (tasks.empty() || !copyQueue_ || !copyFence_) {
    return;
  }
  auto& frame = frames_[frameIndex % kFrameBufferCount];
  ThrowIfFailed(frame.copyAllocator->Reset(), "Failed to reset copy allocator.");
  ThrowIfFailed(
    frame.copyList->Reset(frame.copyAllocator.Get(), nullptr),
    "Failed to reset copy command list."
  );

  for (const auto& task : tasks) {
    if (task.record) {
      task.record(frame.copyList.Get());
    }
  }

  ThrowIfFailed(frame.copyList->Close(), "Failed to close copy command list.");
  ID3D12CommandList* raw = frame.copyList.Get();
  copyQueue_->ExecuteCommandLists(1, &raw);

  const auto signalValue = nextCopyFenceValue_;
  ThrowIfFailed(copyQueue_->Signal(copyFence_.Get(), signalValue), "Failed to signal copy fence.");
  ++nextCopyFenceValue_;
  lastCopySubmitFenceValue_ = signalValue;
}

void Dx12Renderer::PollHotReload() {
  if (!config_.enableHotReload) {
    return;
  }
  hotReload_.Poll();
}

void Dx12Renderer::RenderFrame(const FrameInput& input) {
  frameIndex_ = swapChain_->GetCurrentBackBufferIndex();
  ResetFrameContext(frameIndex_);
  PollHotReload();
  pipelineCache_.PumpAsyncBuilds();

  frameGraphBuilder_.Reset();
  const auto backBufferId =
    frameGraphBuilder_.AddResource({"backbuffer", nullptr, 1, D3D12_RESOURCE_STATE_PRESENT});
  frameGraphBuilder_.AddPass(
    {"main_color_pass", QueueType::Graphics, {{backBufferId, ResourceUsage::Write, D3D12_RESOURCE_BARRIER_ALL_SUBRESOURCES, D3D12_RESOURCE_STATE_RENDER_TARGET}}}
  );
  frameGraphBuilder_.AddPass(
    {"present", QueueType::Graphics, {{backBufferId, ResourceUsage::Read, D3D12_RESOURCE_BARRIER_ALL_SUBRESOURCES, D3D12_RESOURCE_STATE_PRESENT}}}
  );
  const auto compiledGraph = frameGraphBuilder_.Compile();

  SubmitCopyTasks(input.copyTasks, frameIndex_);
  if (lastCopySubmitFenceValue_ > 0 && copyFence_) {
    ThrowIfFailed(
      graphicsQueue_->Wait(copyFence_.Get(), lastCopySubmitFenceValue_),
      "Failed to queue copy->graphics dependency wait."
    );
    lastCopySubmitFenceValue_ = 0;
  }

  SubmitAsyncCompute(input.asyncComputeTasks, frameIndex_, input.allowAsyncCompute);

  auto workerOutputs = commandRecording_.RecordGraphicsBatches(
    input.graphicsBatches,
    frameIndex_,
    [this, &compiledGraph](ID3D12GraphicsCommandList* list, const PartitionBatch& batch) {
      ExecuteFrameGraph(list, compiledGraph);
      (void)batch;
    }
  );

  std::vector<ComPtr<ID3D12CommandList>> submission;
  submission.reserve(workerOutputs.size());
  for (auto& output : workerOutputs) {
    for (auto& list : output.commandLists) {
      submission.push_back(list);
    }
  }
  SubmitGraphicsLists(std::move(submission));

  ThrowIfFailed(graphicsQueue_->Signal(graphicsFence_.Get(), nextGraphicsFenceValue_), "Failed to signal graphics fence.");
  frames_[frameIndex_ % kFrameBufferCount].fenceValue = nextGraphicsFenceValue_;
  ++nextGraphicsFenceValue_;

  ThrowIfFailed(swapChain_->Present(0, 0), "Present failed.");
}

void Dx12Renderer::WaitForGpuIdle() {
  if (!graphicsFenceEvent_) {
    return;
  }

  if (graphicsQueue_ && graphicsFence_) {
    const std::uint64_t value = nextGraphicsFenceValue_++;
    ThrowIfFailed(graphicsQueue_->Signal(graphicsFence_.Get(), value), "Failed to signal graphics queue for idle wait.");
    ThrowIfFailed(graphicsFence_->SetEventOnCompletion(value, graphicsFenceEvent_), "Failed to set idle wait event.");
    WaitForSingleObject(graphicsFenceEvent_, INFINITE);
  }

  if (computeQueue_ && computeFence_) {
    const std::uint64_t value = nextComputeFenceValue_++;
    ThrowIfFailed(computeQueue_->Signal(computeFence_.Get(), value), "Failed to signal compute queue for idle wait.");
    ThrowIfFailed(computeFence_->SetEventOnCompletion(value, graphicsFenceEvent_), "Failed to set compute idle wait event.");
    WaitForSingleObject(graphicsFenceEvent_, INFINITE);
  }

  if (copyQueue_ && copyFence_) {
    const std::uint64_t value = nextCopyFenceValue_++;
    ThrowIfFailed(copyQueue_->Signal(copyFence_.Get(), value), "Failed to signal copy queue for idle wait.");
    ThrowIfFailed(copyFence_->SetEventOnCompletion(value, graphicsFenceEvent_), "Failed to set copy idle wait event.");
    WaitForSingleObject(graphicsFenceEvent_, INFINITE);
  }
}

}  // namespace dx12
