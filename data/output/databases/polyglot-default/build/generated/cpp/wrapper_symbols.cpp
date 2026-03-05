#include "wrapper_symbols.hpp"

#include <sstream>
#include <unordered_map>

namespace aio::wrapper_symbols {

namespace {
const std::unordered_map<std::string, std::vector<std::string>> kRequiredArgs = {
  {"math.abs", {"x"}},
  {"math.add", {"x", "y"}},
  {"math.assign", {"x"}},
  {"math.chain_assign", {"a"}},
  {"math.clamp", {"x", "min", "max"}},
  {"math.divide", {"x", "y"}},
  {"math.equal", {"x", "y"}},
  {"math.max", {"x", "y"}},
  {"math.min", {"x", "y"}},
  {"math.multiply", {"x", "y"}},
  {"math.subtract", {"x", "y"}}
};
const std::unordered_map<std::string, std::string> kWrapperActionByFunction = {
  {"math.abs", "op_abs_x"},
  {"math.add", "op_add"},
  {"math.assign", "op_assign_xy"},
  {"math.chain_assign", "op_assign_abc"},
  {"math.clamp", "op_clamp_x"},
  {"math.divide", "op_divide"},
  {"math.equal", "op_equal"},
  {"math.max", "op_max"},
  {"math.min", "op_min"},
  {"math.multiply", "op_multiply"},
  {"math.subtract", "op_subtract"}
};
const std::unordered_map<std::string, std::string> kOutputSymbolByFunction = {
  {"math.abs", "abs"},
  {"math.add", "sum"},
  {"math.assign", "y"},
  {"math.chain_assign", "c"},
  {"math.clamp", "clamped"},
  {"math.divide", "quotient"},
  {"math.equal", "equal"},
  {"math.max", "max"},
  {"math.min", "min"},
  {"math.multiply", "product"},
  {"math.subtract", "difference"}
};
const std::unordered_map<std::string, std::string> kOutputGroupByFunction = {
  {"math.abs", "output"},
  {"math.add", "output"},
  {"math.assign", "output"},
  {"math.chain_assign", "output"},
  {"math.clamp", "output"},
  {"math.divide", "output"},
  {"math.equal", "output"},
  {"math.max", "output"},
  {"math.min", "output"},
  {"math.multiply", "output"},
  {"math.subtract", "output"}
};
std::string serializeBoundArgs(const std::map<std::string, std::string>& bound_args) {
  std::ostringstream stream;
  stream << "{";
  bool first = true;
  for (const auto& [key, value] : bound_args) {
    if (!first) {
      stream << ",";
    }
    stream << key << "=" << value;
    first = false;
  }
  stream << "}";
  return stream.str();
}
}  // namespace

WrapperResult run_wrapper_function(const std::string& function_id, const std::map<std::string, std::string>& bound_args) {
  WrapperResult response;
  response.function_id = function_id;
  const auto args_it = kRequiredArgs.find(function_id);
  if (args_it == kRequiredArgs.end()) {
    response.error_code = "E_UNKNOWN_FUNCTION";
    return response;
  }
  response.wrapper_action_id = kWrapperActionByFunction.at(function_id);
  response.output_symbol = kOutputSymbolByFunction.at(function_id);
  response.output_group = kOutputGroupByFunction.at(function_id);
  for (const std::string& arg_name : args_it->second) {
    if (bound_args.find(arg_name) == bound_args.end()) {
      response.missing_args.push_back(arg_name);
    }
  }
  if (!response.missing_args.empty()) {
    response.error_code = "E_MISSING_ARG";
    return response;
  }
  response.value = serializeBoundArgs(bound_args);
  response.result[response.output_symbol] = response.value;
  response.ok = true;
  response.error_code.clear();
  return response;
}

WrapperResult math_abs(const std::map<std::string, std::string>& bound_args) {
  return run_wrapper_function(function_ids::MATH_ABS, bound_args);
}

WrapperResult math_add(const std::map<std::string, std::string>& bound_args) {
  return run_wrapper_function(function_ids::MATH_ADD, bound_args);
}

WrapperResult math_assign(const std::map<std::string, std::string>& bound_args) {
  return run_wrapper_function(function_ids::MATH_ASSIGN, bound_args);
}

WrapperResult math_chain_assign(const std::map<std::string, std::string>& bound_args) {
  return run_wrapper_function(function_ids::MATH_CHAIN_ASSIGN, bound_args);
}

WrapperResult math_clamp(const std::map<std::string, std::string>& bound_args) {
  return run_wrapper_function(function_ids::MATH_CLAMP, bound_args);
}

WrapperResult math_divide(const std::map<std::string, std::string>& bound_args) {
  return run_wrapper_function(function_ids::MATH_DIVIDE, bound_args);
}

WrapperResult math_equal(const std::map<std::string, std::string>& bound_args) {
  return run_wrapper_function(function_ids::MATH_EQUAL, bound_args);
}

WrapperResult math_max(const std::map<std::string, std::string>& bound_args) {
  return run_wrapper_function(function_ids::MATH_MAX, bound_args);
}

WrapperResult math_min(const std::map<std::string, std::string>& bound_args) {
  return run_wrapper_function(function_ids::MATH_MIN, bound_args);
}

WrapperResult math_multiply(const std::map<std::string, std::string>& bound_args) {
  return run_wrapper_function(function_ids::MATH_MULTIPLY, bound_args);
}

WrapperResult math_subtract(const std::map<std::string, std::string>& bound_args) {
  return run_wrapper_function(function_ids::MATH_SUBTRACT, bound_args);
}

}  // namespace aio::wrapper_symbols

