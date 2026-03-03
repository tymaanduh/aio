#include "dx12/FrameGraph.h"

#include <algorithm>

namespace dx12 {

std::uint32_t FrameGraphBuilder::AddResource(const FrameGraphResourceDesc& desc) {
  resources_.push_back(desc);
  return static_cast<std::uint32_t>(resources_.size() - 1);
}

std::uint32_t FrameGraphBuilder::AddPass(const FrameGraphPassDesc& pass) {
  passes_.push_back(pass);
  return static_cast<std::uint32_t>(passes_.size() - 1);
}

void FrameGraphBuilder::Reset() {
  resources_.clear();
  passes_.clear();
}

CompiledFrameGraph FrameGraphBuilder::Compile() const {
  CompiledFrameGraph graph{};
  graph.passes = passes_;

  struct ResourceStateTrack {
    ID3D12Resource* resource = nullptr;
    std::vector<D3D12_RESOURCE_STATES> subresourceStates;
  };

  std::vector<ResourceStateTrack> tracked;
  tracked.reserve(resources_.size());
  for (const auto& resource : resources_) {
    ResourceStateTrack item{};
    item.resource = resource.resource;
    item.subresourceStates.assign(std::max(1u, resource.subresourceCount), resource.initialState);
    tracked.push_back(std::move(item));
  }

  for (std::uint32_t passIndex = 0; passIndex < passes_.size(); ++passIndex) {
    const auto& pass = passes_[passIndex];
    CompiledBarrierBatch batch{};
    batch.passIndex = passIndex;
    batch.queue = pass.queue;

    for (const auto& usage : pass.resources) {
      if (usage.resourceId >= tracked.size()) {
        continue;
      }
      auto& item = tracked[usage.resourceId];
      auto& states = item.subresourceStates;
      if (states.empty()) {
        continue;
      }

      const auto emitBarrier = [&](D3D12_RESOURCE_STATES before, D3D12_RESOURCE_STATES after, std::uint32_t subresource) {
        if (before == after) {
          return;
        }
        D3D12_RESOURCE_BARRIER barrier{};
        barrier.Type = D3D12_RESOURCE_BARRIER_TYPE_TRANSITION;
        barrier.Flags = D3D12_RESOURCE_BARRIER_FLAG_NONE;
        barrier.Transition.pResource = item.resource;
        barrier.Transition.StateBefore = before;
        barrier.Transition.StateAfter = after;
        barrier.Transition.Subresource = subresource;
        batch.barriers.push_back(barrier);
      };

      const auto target = usage.state;
      if (usage.subresource == D3D12_RESOURCE_BARRIER_ALL_SUBRESOURCES) {
        const auto firstState = states.front();
        bool uniform = true;
        for (std::size_t subresource = 1; subresource < states.size(); ++subresource) {
          if (states[subresource] != firstState) {
            uniform = false;
            break;
          }
        }
        if (uniform) {
          emitBarrier(firstState, target, D3D12_RESOURCE_BARRIER_ALL_SUBRESOURCES);
        } else {
          for (std::uint32_t subresource = 0; subresource < states.size(); ++subresource) {
            emitBarrier(states[subresource], target, subresource);
          }
        }
        for (auto& state : states) {
          state = target;
        }
        continue;
      }

      const auto subresource = std::min<std::uint32_t>(usage.subresource, static_cast<std::uint32_t>(states.size() - 1));
      emitBarrier(states[subresource], target, subresource);
      states[subresource] = target;
    }

    if (!batch.barriers.empty()) {
      graph.barrierBatches.push_back(std::move(batch));
    }
  }

  return graph;
}

}  // namespace dx12
