#pragma once

#include <array>
#include <string_view>

namespace polyglot::generated::core_contracts_data {

struct ContractSpec {
  std::string_view contract_id;
  std::string_view function_name;
  std::string_view return_slot;
  std::string_view required_args_csv;
  std::string_view instruction_template_ref;
};

struct InstructionTemplateSpec {
  std::string_view template_id;
  std::string_view identify_actions_csv;
  std::string_view execute_actions_csv;
};

inline constexpr std::array<ContractSpec, 5> CONTRACT_SPECS = {{
  {"bootstrap.initializeApplication", "initializeApplication", "state", "config", "template_wrapper_default"},
  {"validation.validateInput", "validateInput", "validationResult", "payload", "template_wrapper_default"},
  {"core.executeCoreWorkflow", "executeCoreWorkflow", "output", "input,state", "template_wrapper_default"},
  {"persistence.persistState", "persistState", "persistResult", "state", "template_wrapper_default"},
  {"recovery.recoverFromError", "recoverFromError", "recoveryPlan", "error,context", "template_wrapper_default"}
}};

inline constexpr std::array<InstructionTemplateSpec, 1> INSTRUCTION_TEMPLATE_SPECS = {{
  {"template_wrapper_default", "identify_required_arguments", "emit_contract_metadata,copy_bound_arguments,emit_return_slot"}
}};

}  // namespace polyglot::generated::core_contracts_data
