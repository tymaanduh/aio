#include "wrapper_symbols.hpp"

#include <cmath>
#include <cstdlib>
#include <iomanip>
#include <limits>
#include <sstream>
#include <unordered_map>

namespace aio::wrapper_symbols {

namespace {
constexpr bool kRequireFiniteNumbers = true;
const std::string kInvalidNumberErrorCode = "E_INVALID_NUMBER";
const std::string kDivideByZeroErrorCode = "E_DIVIDE_BY_ZERO";

struct BehaviorSpec {
  std::string kind;
  std::string operator_name;
  std::string arg;
  std::string left;
  std::string right;
  std::string value_arg;
  std::string min_arg;
  std::string max_arg;
  bool swap_bounds_when_inverted = true;
  double true_value = 1.0;
  double false_value = 0.0;
};

struct NumericResult {
  bool ok = false;
  double value = 0.0;
  std::string error_code;
};

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
const std::unordered_map<std::string, BehaviorSpec> kBehaviorByFunction = {
  {"math.abs", {"unary_math", "abs", "x", "", "", "", "", "", true, 1, 0}},
  {"math.add", {"binary_arithmetic", "add", "", "x", "y", "", "", "", true, 1, 0}},
  {"math.assign", {"pass_through", "", "x", "", "", "", "", "", true, 1, 0}},
  {"math.chain_assign", {"pass_through", "", "a", "", "", "", "", "", true, 1, 0}},
  {"math.clamp", {"clamp", "", "", "", "", "x", "min", "max", true, 1, 0}},
  {"math.divide", {"binary_arithmetic", "divide", "", "x", "y", "", "", "", true, 1, 0}},
  {"math.equal", {"binary_compare", "equal", "", "x", "y", "", "", "", true, 1, 0}},
  {"math.max", {"binary_compare", "max", "", "x", "y", "", "", "", true, 1, 0}},
  {"math.min", {"binary_compare", "min", "", "x", "y", "", "", "", true, 1, 0}},
  {"math.multiply", {"binary_arithmetic", "multiply", "", "x", "y", "", "", "", true, 1, 0}},
  {"math.subtract", {"binary_arithmetic", "subtract", "", "x", "y", "", "", "", true, 1, 0}}
};

NumericResult parseNumericArg(const std::map<std::string, std::string>& bound_args, const std::string& arg_name) {
  auto it = bound_args.find(arg_name);
  if (it == bound_args.end()) {
    return {false, 0.0, kInvalidNumberErrorCode};
  }
  const std::string raw = it->second;
  if (raw.empty()) {
    return {false, 0.0, kInvalidNumberErrorCode};
  }
  char* end_ptr = nullptr;
  const double value = std::strtod(raw.c_str(), &end_ptr);
  if (end_ptr == raw.c_str() || (end_ptr != nullptr && *end_ptr != '\0')) {
    return {false, 0.0, kInvalidNumberErrorCode};
  }
  if (std::isnan(value) || (kRequireFiniteNumbers && !std::isfinite(value))) {
    return {false, 0.0, kInvalidNumberErrorCode};
  }
  return {true, value, ""};
}

std::string formatNumber(double value) {
  std::ostringstream stream;
  stream << std::setprecision(17) << value;
  return stream.str();
}

NumericResult computeWrapperValue(const std::string& function_id, const std::map<std::string, std::string>& bound_args) {
  const auto behaviorIt = kBehaviorByFunction.find(function_id);
  if (behaviorIt == kBehaviorByFunction.end()) {
    return {false, 0.0, "E_UNIMPLEMENTED_BEHAVIOR"};
  }
  const BehaviorSpec& behavior = behaviorIt->second;

  if (behavior.kind == "pass_through") {
    return parseNumericArg(bound_args, behavior.arg);
  }

  if (behavior.kind == "unary_math") {
    const NumericResult parsed = parseNumericArg(bound_args, behavior.arg);
    if (!parsed.ok) {
      return parsed;
    }
    if (behavior.operator_name == "abs") {
      return {true, std::fabs(parsed.value), ""};
    }
  }

  if (behavior.kind == "binary_arithmetic") {
    const NumericResult left = parseNumericArg(bound_args, behavior.left);
    const NumericResult right = parseNumericArg(bound_args, behavior.right);
    if (!left.ok) {
      return left;
    }
    if (!right.ok) {
      return right;
    }
    if (behavior.operator_name == "add") {
      return {true, left.value + right.value, ""};
    }
    if (behavior.operator_name == "subtract") {
      return {true, left.value - right.value, ""};
    }
    if (behavior.operator_name == "multiply") {
      return {true, left.value * right.value, ""};
    }
    if (behavior.operator_name == "divide") {
      if (right.value == 0.0) {
        return {false, 0.0, kDivideByZeroErrorCode};
      }
      return {true, left.value / right.value, ""};
    }
  }

  if (behavior.kind == "binary_compare") {
    const NumericResult left = parseNumericArg(bound_args, behavior.left);
    const NumericResult right = parseNumericArg(bound_args, behavior.right);
    if (!left.ok) {
      return left;
    }
    if (!right.ok) {
      return right;
    }
    if (behavior.operator_name == "equal") {
      return {true, left.value == right.value ? behavior.true_value : behavior.false_value, ""};
    }
    if (behavior.operator_name == "min") {
      return {true, left.value < right.value ? left.value : right.value, ""};
    }
    if (behavior.operator_name == "max") {
      return {true, left.value > right.value ? left.value : right.value, ""};
    }
  }

  if (behavior.kind == "clamp") {
    const NumericResult source = parseNumericArg(bound_args, behavior.value_arg);
    const NumericResult minValue = parseNumericArg(bound_args, behavior.min_arg);
    const NumericResult maxValue = parseNumericArg(bound_args, behavior.max_arg);
    if (!source.ok) {
      return source;
    }
    if (!minValue.ok) {
      return minValue;
    }
    if (!maxValue.ok) {
      return maxValue;
    }
    double lower = minValue.value;
    double upper = maxValue.value;
    if (behavior.swap_bounds_when_inverted && lower > upper) {
      const double tmp = lower;
      lower = upper;
      upper = tmp;
    }
    const double clamped = source.value < lower ? lower : (source.value > upper ? upper : source.value);
    return {true, clamped, ""};
  }

  return {false, 0.0, "E_UNIMPLEMENTED_BEHAVIOR"};
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
  const NumericResult computed = computeWrapperValue(function_id, bound_args);
  if (!computed.ok) {
    response.error_code = computed.error_code.empty() ? "E_RUNTIME" : computed.error_code;
    return response;
  }
  response.value = formatNumber(computed.value);
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

