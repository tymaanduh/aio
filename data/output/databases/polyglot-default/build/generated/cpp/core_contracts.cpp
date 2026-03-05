#include "core_contracts_data.hpp"

#include <algorithm>
#include <cctype>
#include <initializer_list>
#include <map>
#include <sstream>
#include <string>
#include <string_view>
#include <unordered_map>
#include <utility>
#include <vector>

namespace polyglot::generated {

using WrapperValueMap = std::map<std::string, std::string>;

struct WrapperResponse {
  bool ok = false;
  std::string contract_id;
  std::string return_slot;
  WrapperValueMap result;
  std::vector<std::string> trace;
  std::vector<std::string> missing_args;
  std::string error_code;
};

namespace {

struct ContractRuntimeSpec {
  std::string function_name;
  std::string return_slot;
  std::vector<std::string> required_args;
  std::string instruction_template_ref;
};

std::string trimCopy(std::string_view raw) {
  std::size_t start = 0;
  while (start < raw.size() && std::isspace(static_cast<unsigned char>(raw[start])) != 0) {
    start += 1;
  }
  std::size_t end = raw.size();
  while (end > start && std::isspace(static_cast<unsigned char>(raw[end - 1])) != 0) {
    end -= 1;
  }
  return std::string(raw.substr(start, end - start));
}

std::vector<std::string> splitCsv(std::string_view csv) {
  std::vector<std::string> values;
  std::string token;
  for (char character : csv) {
    if (character == ',') {
      const std::string normalized = trimCopy(token);
      if (!normalized.empty()) {
        values.push_back(normalized);
      }
      token.clear();
      continue;
    }
    token.push_back(character);
  }
  const std::string normalized = trimCopy(token);
  if (!normalized.empty()) {
    values.push_back(normalized);
  }
  return values;
}

std::string serializeValueMap(const WrapperValueMap& value_map) {
  if (value_map.empty()) {
    return "{}";
  }
  std::ostringstream stream;
  stream << "{";
  bool first = true;
  for (const auto& [key, value] : value_map) {
    if (!first) {
      stream << ",";
    }
    stream << key << "=" << value;
    first = false;
  }
  stream << "}";
  return stream.str();
}

WrapperValueMap makeBindings(std::initializer_list<std::pair<std::string, std::string>> entries) {
  WrapperValueMap bindings;
  for (const auto& [key, value] : entries) {
    bindings[key] = value;
  }
  return bindings;
}

const std::unordered_map<std::string, ContractRuntimeSpec>& contractRuntimeIndex() {
  static const std::unordered_map<std::string, ContractRuntimeSpec> runtime_index = [] {
    std::unordered_map<std::string, ContractRuntimeSpec> index;
    for (const auto& spec : core_contracts_data::CONTRACT_SPECS) {
      index.emplace(std::string(spec.contract_id), ContractRuntimeSpec{
                                                std::string(spec.function_name),
                                                std::string(spec.return_slot),
                                                splitCsv(spec.required_args_csv),
                                                std::string(spec.instruction_template_ref)});
    }
    return index;
  }();
  return runtime_index;
}

const std::unordered_map<std::string, std::vector<std::string>>& executeActionIndex() {
  static const std::unordered_map<std::string, std::vector<std::string>> action_index = [] {
    std::unordered_map<std::string, std::vector<std::string>> index;
    for (const auto& spec : core_contracts_data::INSTRUCTION_TEMPLATE_SPECS) {
      index.emplace(std::string(spec.template_id), splitCsv(spec.execute_actions_csv));
    }
    return index;
  }();
  return action_index;
}

std::vector<std::string> identifyMissingArgs(
    const std::vector<std::string>& required_args,
    const WrapperValueMap& bound_args) {
  std::vector<std::string> missing;
  for (const std::string& arg_name : required_args) {
    if (bound_args.find(arg_name) == bound_args.end()) {
      missing.push_back(arg_name);
    }
  }
  return missing;
}

WrapperResponse executePipeline(const std::string& contract_id, const ContractRuntimeSpec& spec, const WrapperValueMap& bound_args) {
  const auto& actions_by_template = executeActionIndex();
  const auto template_it = actions_by_template.find(spec.instruction_template_ref);
  const std::vector<std::string> action_ids =
      template_it == actions_by_template.end() ? std::vector<std::string>{} : template_it->second;

  WrapperResponse response;
  response.ok = true;
  response.contract_id = contract_id;
  response.return_slot = spec.return_slot;
  response.trace.push_back("execute_pipeline");

  for (const std::string& action_id : action_ids) {
    response.trace.push_back(action_id);
    if (action_id == "emit_contract_metadata") {
      response.result["contract_id"] = contract_id;
      continue;
    }
    if (action_id == "copy_bound_arguments") {
      for (const auto& [key, value] : bound_args) {
        response.result["arg." + key] = value;
      }
      continue;
    }
    if (action_id == "emit_return_slot") {
      response.result[spec.return_slot] = serializeValueMap(bound_args);
    }
  }

  return response;
}

WrapperResponse runTwoPassWrapper(const std::string& contract_id, const WrapperValueMap& bound_args) {
  const auto& runtime_index = contractRuntimeIndex();
  const auto contract_it = runtime_index.find(contract_id);

  if (contract_it == runtime_index.end()) {
    WrapperResponse response;
    response.ok = false;
    response.contract_id = contract_id;
    response.error_code = "E_UNKNOWN_CONTRACT";
    response.trace.push_back("identify_arguments");
    return response;
  }

  const ContractRuntimeSpec& spec = contract_it->second;
  const std::vector<std::string> missing_args = identifyMissingArgs(spec.required_args, bound_args);
  if (!missing_args.empty()) {
    WrapperResponse response;
    response.ok = false;
    response.contract_id = contract_id;
    response.error_code = "E_MISSING_ARG";
    response.trace.push_back("identify_arguments");
    response.missing_args = missing_args;
    return response;
  }

  return executePipeline(contract_id, spec, bound_args);
}

}  // namespace

WrapperResponse initializeApplication(const WrapperValueMap& config) {
  return runTwoPassWrapper("bootstrap.initializeApplication", makeBindings({{"config", serializeValueMap(config)}}));
}

WrapperResponse validateInput(const WrapperValueMap& payload) {
  return runTwoPassWrapper("validation.validateInput", makeBindings({{"payload", serializeValueMap(payload)}}));
}

WrapperResponse executeCoreWorkflow(const WrapperValueMap& input, const WrapperValueMap& state) {
  return runTwoPassWrapper(
      "core.executeCoreWorkflow",
      makeBindings({{"input", serializeValueMap(input)}, {"state", serializeValueMap(state)}}));
}

WrapperResponse persistState(const WrapperValueMap& state) {
  return runTwoPassWrapper("persistence.persistState", makeBindings({{"state", serializeValueMap(state)}}));
}

WrapperResponse recoverFromError(const WrapperValueMap& error, const WrapperValueMap& context) {
  return runTwoPassWrapper(
      "recovery.recoverFromError",
      makeBindings({{"error", serializeValueMap(error)}, {"context", serializeValueMap(context)}}));
}

}  // namespace polyglot::generated
