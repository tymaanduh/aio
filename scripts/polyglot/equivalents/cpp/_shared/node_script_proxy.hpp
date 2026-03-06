#pragma once

#include <iostream>
#include <string>

namespace aio::script_proxy {

inline int run_node_script(const std::string&, int, char**) {
  std::cerr << "node_script_proxy.hpp is retired; regenerate wrappers or use _shared/native_script_runtime.hpp instead\n";
  return 1;
}

}  // namespace aio::script_proxy
