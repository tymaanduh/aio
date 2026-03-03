# Dictionary DX12 Backend

Windows-only native renderer backend scaffold with a performance-first DX12 architecture.

## Goals Enforced By Design

- Multi-threaded command list recording:
  - Worker threads record in parallel.
  - Work is merged per-worker into fewer, larger command lists.
  - Main thread only submits sorted outputs.
- One graphics queue + one async compute queue.
- One copy queue for streaming uploads.
- Persistent descriptor heaps:
  - Large global bindless CBV/SRV/UAV heap.
  - Stable RTV + DSV heaps.
  - Per-frame dynamic descriptor ring allocation.
- Global GPU memory allocator:
  - Large heap pages with sub-allocation for placed resources.
  - Fence-based lifetime retirement via `ResourceLifetimeTracker`.
- Frame graph compilation:
  - Passes declare usage.
  - Barrier generation is centralized and batched.
  - Redundant state transitions are removed.
  - Per-subresource state tracking supported.
- PSO/root-signature lifecycle:
  - `PipelineCache` is pre-bake only.
  - Async PSO build queue for startup/loading phases.
  - Optional runtime hot-swap for development (`SetRuntimeRebuildEnabled`).
- Shader reflection + automatic binding metadata:
  - `ShaderBindingSystem` reflects resource slots from shader bytecode.
  - Reflection layouts are cached by shader stage key (`<pso>:vs`, `<pso>:ps`, ...).
- Asset hot reload hooks:
  - Shader/texture/mesh file watches.
  - Poll-based callbacks without app restart.

## Layout

- `include/dx12/Common.h`: shared platform/types helpers.
- `include/dx12/RenderTypes.h`: draw sort keys, partition batches, compute task payloads.
- `include/dx12/DescriptorAllocator.h`: persistent heap + static/dynamic sub-allocation.
- `include/dx12/ResourceLifetimeTracker.h`: queue-fence retirement queues.
- `include/dx12/GpuMemoryAllocator.h`: large heap paging + placed-resource sub-allocation.
- `include/dx12/FrameGraph.h`: pass/resource declarations + barrier batch compilation.
- `include/dx12/CommandRecording.h`: multi-thread command recording coordinator.
- `include/dx12/PipelineCache.h`: pre-baked root signature + PSO cache.
- `include/dx12/ShaderBindingSystem.h`: shader reflection + binding metadata cache.
- `include/dx12/AssetHotReload.h`: poll-based runtime asset reload watchers.
- `include/dx12/Dx12Renderer.h`: main renderer entry point.
- `src/*.cpp`: implementations.

## Build (Windows)

```powershell
cd native/dx12
cmake -S . -B build -G "Visual Studio 17 2022" -A x64
cmake --build build --config Release
```

## Integration Status

This module is still optional and not wired into Electron runtime presentation by default.
The existing app still renders through WebGL/Canvas in `app/renderer.js`.
