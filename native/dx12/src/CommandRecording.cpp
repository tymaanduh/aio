#include "dx12/CommandRecording.h"

#include <algorithm>
#include <future>

namespace dx12 {

namespace {

bool DrawSortLess(const DrawPacket& left, const DrawPacket& right) {
  const auto& a = left.sort;
  const auto& b = right.sort;
  if (a.rootSignatureId != b.rootSignatureId) return a.rootSignatureId < b.rootSignatureId;
  if (a.psoId != b.psoId) return a.psoId < b.psoId;
  if (a.descriptorLayoutId != b.descriptorLayoutId) return a.descriptorLayoutId < b.descriptorLayoutId;
  if (a.materialId != b.materialId) return a.materialId < b.materialId;
  return a.meshId < b.meshId;
}

}  // namespace

void CommandRecordingSystem::Initialize(ID3D12Device* device, std::uint32_t workerCount, std::uint32_t frameCount) {
  if (!device) {
    throw std::runtime_error("CommandRecordingSystem::Initialize requires a valid device.");
  }
  device_ = device;
  frameCount_ = std::max<std::uint32_t>(1u, frameCount);

  const std::uint32_t count = std::max<std::uint32_t>(1u, workerCount);
  workers_.clear();
  workers_.resize(count);

  for (std::uint32_t worker = 0; worker < count; ++worker) {
    auto& ctx = workers_[worker];
    ctx.workerIndex = worker;
    ctx.graphicsAllocators.resize(frameCount_);
    for (std::uint32_t frame = 0; frame < frameCount_; ++frame) {
      ThrowIfFailed(
        device_->CreateCommandAllocator(D3D12_COMMAND_LIST_TYPE_DIRECT, IID_PPV_ARGS(&ctx.graphicsAllocators[frame])),
        "Failed to create worker graphics command allocator."
      );
    }
    ThrowIfFailed(
      device_->CreateCommandList(
        0,
        D3D12_COMMAND_LIST_TYPE_DIRECT,
        ctx.graphicsAllocators[0].Get(),
        nullptr,
        IID_PPV_ARGS(&ctx.graphicsList)
      ),
      "Failed to create worker graphics command list."
    );
    ThrowIfFailed(ctx.graphicsList->Close(), "Failed to close initial worker command list.");
  }
}

void CommandRecordingSystem::Shutdown() {
  workers_.clear();
  device_.Reset();
}

std::vector<WorkerRecordOutput> CommandRecordingSystem::RecordGraphicsBatches(
  const std::vector<PartitionBatch>& batches,
  std::uint32_t frameIndex,
  std::function<void(ID3D12GraphicsCommandList*, const PartitionBatch&)> recordBatch
) {
  std::vector<WorkerRecordOutput> outputs;
  if (!device_ || workers_.empty() || batches.empty() || !recordBatch) {
    return outputs;
  }
  const std::uint32_t frame = frameIndex % frameCount_;
  const std::size_t activeWorkers = std::min<std::size_t>(workers_.size(), batches.size());
  outputs.resize(activeWorkers);

  std::vector<std::vector<const PartitionBatch*>> assignments(activeWorkers);
  for (std::size_t batchIndex = 0; batchIndex < batches.size(); ++batchIndex) {
    assignments[batchIndex % activeWorkers].push_back(&batches[batchIndex]);
  }

  std::vector<std::future<void>> jobs;
  jobs.reserve(activeWorkers);
  for (std::size_t workerSlot = 0; workerSlot < activeWorkers; ++workerSlot) {
    jobs.push_back(std::async(std::launch::async, [&, workerSlot]() {
      auto& worker = workers_[workerSlot];
      auto& out = outputs[workerSlot];
      const auto& assigned = assignments[workerSlot];
      if (assigned.empty()) {
        out.partitionId = static_cast<std::uint32_t>(workerSlot);
        return;
      }

      out.partitionId = assigned.front()->partitionId;
      PartitionBatch merged{};
      merged.partitionId = out.partitionId;
      for (const auto* batch : assigned) {
        if (!batch) {
          continue;
        }
        out.partitionId = std::min(out.partitionId, batch->partitionId);
        merged.partitionId = out.partitionId;
        merged.draws.insert(merged.draws.end(), batch->draws.begin(), batch->draws.end());
      }
      std::sort(merged.draws.begin(), merged.draws.end(), DrawSortLess);

      ThrowIfFailed(worker.graphicsAllocators[frame]->Reset(), "Failed to reset worker graphics allocator.");
      ThrowIfFailed(
        worker.graphicsList->Reset(worker.graphicsAllocators[frame].Get(), nullptr),
        "Failed to reset worker graphics command list."
      );

      recordBatch(worker.graphicsList.Get(), merged);
      ThrowIfFailed(worker.graphicsList->Close(), "Failed to close worker graphics command list.");
      out.commandLists.push_back(worker.graphicsList);
    }));
  }

  for (auto& job : jobs) {
    job.get();
  }

  std::sort(outputs.begin(), outputs.end(), [](const WorkerRecordOutput& left, const WorkerRecordOutput& right) {
    return left.partitionId < right.partitionId;
  });

  return outputs;
}

}  // namespace dx12
