"""Generated contract data for Python wrapper execution."""

CONTRACT_WRAPPER_INDEX = {
  "bootstrap.initializeApplication": {
    "function_name": "initializeApplication",
    "instruction_template_ref": "template_wrapper_default",
    "required_args": [
      "config"
    ],
    "returns": "state"
  },
  "core.executeCoreWorkflow": {
    "function_name": "executeCoreWorkflow",
    "instruction_template_ref": "template_wrapper_default",
    "required_args": [
      "input",
      "state"
    ],
    "returns": "output"
  },
  "persistence.persistState": {
    "function_name": "persistState",
    "instruction_template_ref": "template_wrapper_default",
    "required_args": [
      "state"
    ],
    "returns": "persistResult"
  },
  "recovery.recoverFromError": {
    "function_name": "recoverFromError",
    "instruction_template_ref": "template_wrapper_default",
    "required_args": [
      "error",
      "context"
    ],
    "returns": "recoveryPlan"
  },
  "validation.validateInput": {
    "function_name": "validateInput",
    "instruction_template_ref": "template_wrapper_default",
    "required_args": [
      "payload"
    ],
    "returns": "validationResult"
  }
}

INSTRUCTION_TEMPLATE_REGISTRY = {
  "template_wrapper_default": {
    "execute_pipeline": [
      "emit_contract_metadata",
      "copy_bound_arguments",
      "emit_return_slot"
    ],
    "identify_arguments": [
      "identify_required_arguments"
    ]
  }
}
