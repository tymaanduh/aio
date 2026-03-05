"""Generated Python core contracts with two-pass wrapper execution."""

from __future__ import annotations

from typing import Any, Dict, List, Mapping

try:
    from .core_contracts_data import CONTRACT_WRAPPER_INDEX, INSTRUCTION_TEMPLATE_REGISTRY
except ImportError:
    from core_contracts_data import CONTRACT_WRAPPER_INDEX, INSTRUCTION_TEMPLATE_REGISTRY

WrapperResult = Dict[str, Any]


def _identify_required_arguments(contract_id: str, bound_args: Mapping[str, Any]) -> List[str]:
    contract_meta = CONTRACT_WRAPPER_INDEX.get(contract_id, {})
    required_args = contract_meta.get("required_args", [])
    missing = []
    for arg_name in required_args:
        if arg_name not in bound_args or bound_args[arg_name] is None:
            missing.append(arg_name)
    return missing


def _execute_pipeline(contract_id: str, bound_args: Mapping[str, Any]) -> WrapperResult:
    contract_meta = CONTRACT_WRAPPER_INDEX.get(contract_id, {})
    return_slot = str(contract_meta.get("returns", "result"))
    template_id = str(contract_meta.get("instruction_template_ref", ""))
    template = INSTRUCTION_TEMPLATE_REGISTRY.get(template_id, {})
    action_ids = template.get("execute_pipeline", [])
    ordered_bound_args = {key: bound_args[key] for key in sorted(bound_args.keys())}
    output: Dict[str, Any] = {}
    trace: List[str] = []
    for action_id in action_ids:
        trace.append(action_id)
        if action_id == "emit_contract_metadata":
            output["contract_id"] = contract_id
            continue
        if action_id == "copy_bound_arguments":
            for key, value in ordered_bound_args.items():
                output[f"arg.{key}"] = value
            continue
        if action_id == "emit_return_slot":
            output[return_slot] = {
                "contract_id": contract_id,
                "inputs": ordered_bound_args,
                "template_id": template_id,
            }
    return {
        "ok": True,
        "contract_id": contract_id,
        "return_slot": return_slot,
        "result": output,
        "trace": ["execute_pipeline", *trace],
        "missing_args": [],
        "error_code": "",
    }


def _run_two_pass_wrapper(contract_id: str, bound_args: Mapping[str, Any]) -> WrapperResult:
    if contract_id not in CONTRACT_WRAPPER_INDEX:
        return {
            "ok": False,
            "contract_id": contract_id,
            "return_slot": "",
            "result": {},
            "trace": ["identify_arguments"],
            "missing_args": [],
            "error_code": "E_UNKNOWN_CONTRACT",
        }
    missing = _identify_required_arguments(contract_id, bound_args)
    if missing:
        return {
            "ok": False,
            "contract_id": contract_id,
            "return_slot": "",
            "result": {},
            "trace": ["identify_arguments"],
            "missing_args": missing,
            "error_code": "E_MISSING_ARG",
        }
    return _execute_pipeline(contract_id, bound_args)


def initializeApplication(config: Mapping[str, Any]) -> WrapperResult:
    return _run_two_pass_wrapper("bootstrap.initializeApplication", {"config": config})


def validateInput(payload: Mapping[str, Any]) -> WrapperResult:
    return _run_two_pass_wrapper("validation.validateInput", {"payload": payload})


def executeCoreWorkflow(input: Mapping[str, Any], state: Mapping[str, Any]) -> WrapperResult:
    return _run_two_pass_wrapper("core.executeCoreWorkflow", {"input": input, "state": state})


def persistState(state: Mapping[str, Any]) -> WrapperResult:
    return _run_two_pass_wrapper("persistence.persistState", {"state": state})


def recoverFromError(error: Mapping[str, Any], context: Mapping[str, Any]) -> WrapperResult:
    return _run_two_pass_wrapper("recovery.recoverFromError", {"error": error, "context": context})


__all__ = [
    "initializeApplication",
    "validateInput",
    "executeCoreWorkflow",
    "persistState",
    "recoverFromError",
]
