cmake_minimum_required(VERSION 3.24)
project(DictionaryDx12Backend LANGUAGES CXX)

if (NOT WIN32)
  message(FATAL_ERROR "DictionaryDx12Backend is Windows-only (DirectX 12).")
endif()

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

add_library(DictionaryDx12Backend STATIC
  src/AssetHotReload.cpp
  src/Dx12Renderer.cpp
  src/CommandRecording.cpp
  src/DescriptorAllocator.cpp
  src/FrameGraph.cpp
  src/GpuMemoryAllocator.cpp
  src/PipelineCache.cpp
  src/ResourceLifetimeTracker.cpp
  src/ShaderBindingSystem.cpp
)

target_include_directories(DictionaryDx12Backend
  PUBLIC
    ${CMAKE_CURRENT_SOURCE_DIR}/include
)

target_compile_definitions(DictionaryDx12Backend
  PRIVATE
    NOMINMAX
    WIN32_LEAN_AND_MEAN
    UNICODE
    _UNICODE
)

if (MSVC)
  target_compile_options(DictionaryDx12Backend PRIVATE /W4 /permissive- /EHsc /Zc:preprocessor)
endif()

target_link_libraries(DictionaryDx12Backend
  PRIVATE
    d3d12
    d3dcompiler
    dxgi
    dxguid
)
