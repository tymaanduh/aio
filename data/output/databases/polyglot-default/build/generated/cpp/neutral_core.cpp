#include "neutral_core.hpp"

namespace aio::neutral_core {
const std::vector<std::string>& pure_function_ids() {
  static const std::vector<std::string> kPureFunctionIds = {
      "math.abs",
      "math.add",
      "math.assign",
      "math.chain_assign",
      "math.clamp",
      "math.divide",
      "math.equal",
      "math.max",
      "math.min",
      "math.multiply",
      "math.subtract"
  };
  return kPureFunctionIds;
}

const char* contract_id() {
  return "aio_core_contract_catalog";
}

aio::wrapper_symbols::WrapperResult run_math_function(
    const std::string& function_id,
    const std::map<std::string, std::string>& bound_args) {
  return aio::wrapper_symbols::run_wrapper_function(function_id, bound_args);
}

aio::wrapper_symbols::WrapperResult math_abs(
    const std::map<std::string, std::string>& bound_args) {
  return run_math_function(aio::wrapper_symbols::function_ids::MATH_ABS, bound_args);
}

aio::wrapper_symbols::WrapperResult math_add(
    const std::map<std::string, std::string>& bound_args) {
  return run_math_function(aio::wrapper_symbols::function_ids::MATH_ADD, bound_args);
}

aio::wrapper_symbols::WrapperResult math_assign(
    const std::map<std::string, std::string>& bound_args) {
  return run_math_function(aio::wrapper_symbols::function_ids::MATH_ASSIGN, bound_args);
}

aio::wrapper_symbols::WrapperResult math_chain_assign(
    const std::map<std::string, std::string>& bound_args) {
  return run_math_function(aio::wrapper_symbols::function_ids::MATH_CHAIN_ASSIGN, bound_args);
}

aio::wrapper_symbols::WrapperResult math_clamp(
    const std::map<std::string, std::string>& bound_args) {
  return run_math_function(aio::wrapper_symbols::function_ids::MATH_CLAMP, bound_args);
}

aio::wrapper_symbols::WrapperResult math_divide(
    const std::map<std::string, std::string>& bound_args) {
  return run_math_function(aio::wrapper_symbols::function_ids::MATH_DIVIDE, bound_args);
}

aio::wrapper_symbols::WrapperResult math_equal(
    const std::map<std::string, std::string>& bound_args) {
  return run_math_function(aio::wrapper_symbols::function_ids::MATH_EQUAL, bound_args);
}

aio::wrapper_symbols::WrapperResult math_max(
    const std::map<std::string, std::string>& bound_args) {
  return run_math_function(aio::wrapper_symbols::function_ids::MATH_MAX, bound_args);
}

aio::wrapper_symbols::WrapperResult math_min(
    const std::map<std::string, std::string>& bound_args) {
  return run_math_function(aio::wrapper_symbols::function_ids::MATH_MIN, bound_args);
}

aio::wrapper_symbols::WrapperResult math_multiply(
    const std::map<std::string, std::string>& bound_args) {
  return run_math_function(aio::wrapper_symbols::function_ids::MATH_MULTIPLY, bound_args);
}

aio::wrapper_symbols::WrapperResult math_subtract(
    const std::map<std::string, std::string>& bound_args) {
  return run_math_function(aio::wrapper_symbols::function_ids::MATH_SUBTRACT, bound_args);
}
}  // namespace aio::neutral_core
