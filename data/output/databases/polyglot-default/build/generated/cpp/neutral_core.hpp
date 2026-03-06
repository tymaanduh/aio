#pragma once

#include <map>
#include <string>
#include <vector>

#include "wrapper_symbols.hpp"

namespace aio::neutral_core {
const std::vector<std::string>& pure_function_ids();
const char* contract_id();
aio::wrapper_symbols::WrapperResult run_math_function(
    const std::string& function_id,
    const std::map<std::string, std::string>& bound_args);
aio::wrapper_symbols::WrapperResult math_abs(const std::map<std::string, std::string>& bound_args);
aio::wrapper_symbols::WrapperResult math_add(const std::map<std::string, std::string>& bound_args);
aio::wrapper_symbols::WrapperResult math_assign(const std::map<std::string, std::string>& bound_args);
aio::wrapper_symbols::WrapperResult math_chain_assign(const std::map<std::string, std::string>& bound_args);
aio::wrapper_symbols::WrapperResult math_clamp(const std::map<std::string, std::string>& bound_args);
aio::wrapper_symbols::WrapperResult math_divide(const std::map<std::string, std::string>& bound_args);
aio::wrapper_symbols::WrapperResult math_equal(const std::map<std::string, std::string>& bound_args);
aio::wrapper_symbols::WrapperResult math_max(const std::map<std::string, std::string>& bound_args);
aio::wrapper_symbols::WrapperResult math_min(const std::map<std::string, std::string>& bound_args);
aio::wrapper_symbols::WrapperResult math_multiply(const std::map<std::string, std::string>& bound_args);
aio::wrapper_symbols::WrapperResult math_subtract(const std::map<std::string, std::string>& bound_args);
}  // namespace aio::neutral_core
