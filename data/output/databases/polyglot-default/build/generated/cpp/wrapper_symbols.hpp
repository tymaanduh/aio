#pragma once

#include <map>
#include <string>
#include <vector>

namespace aio::wrapper_symbols::function_ids {
inline constexpr const char* MATH_ABS = "math.abs";
inline constexpr const char* MATH_ADD = "math.add";
inline constexpr const char* MATH_ASSIGN = "math.assign";
inline constexpr const char* MATH_CHAIN_ASSIGN = "math.chain_assign";
inline constexpr const char* MATH_CLAMP = "math.clamp";
inline constexpr const char* MATH_DIVIDE = "math.divide";
inline constexpr const char* MATH_EQUAL = "math.equal";
inline constexpr const char* MATH_MAX = "math.max";
inline constexpr const char* MATH_MIN = "math.min";
inline constexpr const char* MATH_MULTIPLY = "math.multiply";
inline constexpr const char* MATH_SUBTRACT = "math.subtract";
}  // namespace aio::wrapper_symbols::function_ids

namespace aio::wrapper_symbols {
struct WrapperResult {
  bool ok = false;
  std::string function_id;
  std::string wrapper_action_id;
  std::string output_symbol;
  std::string output_group;
  std::map<std::string, std::string> result;
  std::string value;
  std::vector<std::string> missing_args;
  std::string error_code;
};

WrapperResult run_wrapper_function(const std::string& function_id, const std::map<std::string, std::string>& bound_args);
WrapperResult math_abs(const std::map<std::string, std::string>& bound_args);
WrapperResult math_add(const std::map<std::string, std::string>& bound_args);
WrapperResult math_assign(const std::map<std::string, std::string>& bound_args);
WrapperResult math_chain_assign(const std::map<std::string, std::string>& bound_args);
WrapperResult math_clamp(const std::map<std::string, std::string>& bound_args);
WrapperResult math_divide(const std::map<std::string, std::string>& bound_args);
WrapperResult math_equal(const std::map<std::string, std::string>& bound_args);
WrapperResult math_max(const std::map<std::string, std::string>& bound_args);
WrapperResult math_min(const std::map<std::string, std::string>& bound_args);
WrapperResult math_multiply(const std::map<std::string, std::string>& bound_args);
WrapperResult math_subtract(const std::map<std::string, std::string>& bound_args);
}  // namespace aio::wrapper_symbols

