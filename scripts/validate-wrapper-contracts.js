#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { findProjectRoot } = require("./project-source-resolver");

const ALLOWED_BINDING_STATUS = new Set(["implemented", "planned", "blocked"]);

function parseArgs(argv) {
  return {
    strict: !argv.includes("--no-strict")
  };
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function issue(level, type, detail, extra = {}) {
  return {
    level,
    type,
    detail,
    ...extra
  };
}

function normalizeText(value) {
  return String(value || "").trim().toLowerCase();
}

function normalizeInputList(values) {
  if (!Array.isArray(values)) {
    return [];
  }
  return values
    .map((entry) => {
      const row = entry && typeof entry === "object" ? entry : {};
      return {
        arg: normalizeText(row.arg),
        symbol: normalizeText(row.symbol)
      };
    })
    .filter((row) => row.arg && row.symbol)
    .sort((left, right) => `${left.arg}:${left.symbol}`.localeCompare(`${right.arg}:${right.symbol}`));
}

function compareInputLists(left, right) {
  return JSON.stringify(normalizeInputList(left)) === JSON.stringify(normalizeInputList(right));
}

function listJsFiles(root, relativeDir) {
  const start = path.join(root, relativeDir);
  if (!fs.existsSync(start)) {
    return [];
  }
  const out = [];
  const stack = [start];
  while (stack.length > 0) {
    const current = stack.pop();
    const entries = fs.readdirSync(current, { withFileTypes: true });
    entries.forEach((entry) => {
      const absolute = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(absolute);
        return;
      }
      if (entry.isFile() && absolute.endsWith(".js")) {
        out.push(absolute);
      }
    });
  }
  return out;
}

function escapeRegExp(value) {
  return String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function validate() {
  const root = findProjectRoot(process.cwd());
  const contractsPath = path.join(root, "data", "input", "shared", "wrapper", "function_contracts.json");
  const wrapperSpecsPath = path.join(root, "data", "input", "shared", "wrapper", "unified_wrapper_specs.json");

  const report = {
    status: "pass",
    root,
    files: {
      function_contracts: path.relative(root, contractsPath).replace(/\\/g, "/"),
      wrapper_specs: path.relative(root, wrapperSpecsPath).replace(/\\/g, "/")
    },
    counts: {
      contracts: 0,
      wrapper_operations: 0,
      errors: 0,
      warnings: 0
    },
    issues: []
  };

  if (!fs.existsSync(contractsPath)) {
    report.issues.push(issue("error", "missing_contracts_file", "function_contracts.json is missing"));
  }
  if (!fs.existsSync(wrapperSpecsPath)) {
    report.issues.push(issue("error", "missing_wrapper_specs", "unified_wrapper_specs.json is missing"));
  }
  if (report.issues.length > 0) {
    report.counts.errors = report.issues.length;
    report.status = "fail";
    return report;
  }

  const contractDoc = readJson(contractsPath);
  const wrapperDoc = readJson(wrapperSpecsPath);

  const contracts = Array.isArray(contractDoc.contracts) ? contractDoc.contracts : [];
  const requiredLanguages = Array.isArray(contractDoc.required_language_bindings)
    ? contractDoc.required_language_bindings.map((item) => normalizeText(item)).filter(Boolean)
    : [];
  const operationIndex =
    wrapperDoc.operation_index && typeof wrapperDoc.operation_index === "object" ? wrapperDoc.operation_index : {};
  const functionSignatureIndex =
    wrapperDoc.function_signature_index && typeof wrapperDoc.function_signature_index === "object"
      ? wrapperDoc.function_signature_index
      : {};
  const pipelineIndex =
    wrapperDoc.pipeline_index && typeof wrapperDoc.pipeline_index === "object" ? wrapperDoc.pipeline_index : {};

  report.counts.contracts = contracts.length;
  report.counts.wrapper_operations = Object.keys(operationIndex).length;

  if (!Number.isFinite(Number(contractDoc.schema_version))) {
    report.issues.push(
      issue("error", "invalid_schema_version", "function_contracts.schema_version must be numeric")
    );
  }
  if (!Array.isArray(contractDoc.contracts)) {
    report.issues.push(issue("error", "invalid_contract_list", "function_contracts.contracts must be an array"));
  }
  if (!requiredLanguages.length) {
    report.issues.push(
      issue(
        "error",
        "missing_required_language_bindings",
        "function_contracts.required_language_bindings must include at least one language"
      )
    );
  }

  const byFunctionId = new Map();
  const byWrapperAction = new Map();
  const contractFunctionIds = [];
  const contractFunctionRegexParts = [];
  const allowedImplementationFiles = new Set();

  contracts.forEach((rawContract, index) => {
    const contract = rawContract && typeof rawContract === "object" ? rawContract : {};
    const functionId = normalizeText(contract.function_id);
    const wrapperActionId = normalizeText(contract.wrapper_action_id);
    const moduleId = String(contract.module_id || "").trim();
    const output = contract.output && typeof contract.output === "object" ? contract.output : {};
    const outputSymbol = normalizeText(output.symbol);
    const outputGroup = normalizeText(output.group);
    const langBindings = contract.lang_bindings && typeof contract.lang_bindings === "object" ? contract.lang_bindings : {};

    if (!functionId) {
      report.issues.push(
        issue("error", "missing_function_id", "contract.function_id is required", { contract_index: index })
      );
      return;
    }
    if (!wrapperActionId) {
      report.issues.push(
        issue("error", "missing_wrapper_action_id", "contract.wrapper_action_id is required", {
          contract_index: index,
          function_id: functionId
        })
      );
    }
    if (!moduleId) {
      report.issues.push(
        issue("error", "missing_module_id", "contract.module_id is required", {
          contract_index: index,
          function_id: functionId
        })
      );
    } else {
      const modulePath = path.resolve(root, moduleId);
      if (!fs.existsSync(modulePath)) {
        report.issues.push(
          issue("error", "missing_module_file", "contract.module_id file does not exist", {
            contract_index: index,
            function_id: functionId,
            module_id: moduleId
          })
        );
      } else {
        allowedImplementationFiles.add(modulePath);
      }
    }

    if (!Array.isArray(contract.inputs) || normalizeInputList(contract.inputs).length === 0) {
      report.issues.push(
        issue("error", "invalid_inputs", "contract.inputs must include at least one arg/symbol pair", {
          contract_index: index,
          function_id: functionId
        })
      );
    }
    if (!outputSymbol || !outputGroup) {
      report.issues.push(
        issue("error", "invalid_output", "contract.output must include symbol and group", {
          contract_index: index,
          function_id: functionId
        })
      );
    }
    if (!Array.isArray(contract.side_effects)) {
      report.issues.push(
        issue("error", "invalid_side_effects", "contract.side_effects must be an array", {
          contract_index: index,
          function_id: functionId
        })
      );
    }

    if (byFunctionId.has(functionId)) {
      report.issues.push(
        issue("error", "duplicate_function_contract", "function_id must be unique", {
          function_id: functionId
        })
      );
    } else {
      byFunctionId.set(functionId, contract);
      contractFunctionIds.push(functionId);
      contractFunctionRegexParts.push(escapeRegExp(functionId));
    }
    if (wrapperActionId) {
      if (byWrapperAction.has(wrapperActionId)) {
        report.issues.push(
          issue("error", "duplicate_wrapper_action_contract", "wrapper_action_id must be unique", {
            wrapper_action_id: wrapperActionId
          })
        );
      } else {
        byWrapperAction.set(wrapperActionId, contract);
      }
    }

    requiredLanguages.forEach((lang) => {
      const binding = langBindings[lang];
      if (!binding || typeof binding !== "object") {
        report.issues.push(
          issue("error", "missing_language_binding", "contract is missing required language binding", {
            function_id: functionId,
            language: lang
          })
        );
        return;
      }
      const status = normalizeText(binding.status);
      const bindingModule = String(binding.module || "").trim();
      const bindingSymbol = String(binding.symbol || "").trim();
      if (!bindingModule || !bindingSymbol) {
        report.issues.push(
          issue("error", "invalid_language_binding", "language binding must include module and symbol", {
            function_id: functionId,
            language: lang
          })
        );
      }
      if (!ALLOWED_BINDING_STATUS.has(status)) {
        report.issues.push(
          issue("error", "invalid_language_binding_status", "language binding status must be implemented/planned/blocked", {
            function_id: functionId,
            language: lang,
            status: String(binding.status || "")
          })
        );
      }
      if (status === "implemented" && bindingModule) {
        const bindingModulePath = path.resolve(root, bindingModule);
        if (!fs.existsSync(bindingModulePath)) {
          report.issues.push(
            issue("error", "implemented_binding_missing_file", "implemented language binding module file does not exist", {
              function_id: functionId,
              language: lang,
              module: bindingModule
            })
          );
        }
      }
    });
  });

  const operationToFunction = new Map();
  const functionToOperation = new Map();

  Object.entries(operationIndex).forEach(([operationId, rawOperation]) => {
    const op = rawOperation && typeof rawOperation === "object" ? rawOperation : {};
    const normalizedOperationId = normalizeText(op.operation_id || operationId);
    const functionId = normalizeText(op.function_id);
    if (!normalizedOperationId || !functionId) {
      report.issues.push(
        issue("error", "invalid_operation_entry", "operation_index entries must include operation_id and function_id", {
          operation_id: operationId
        })
      );
      return;
    }

    operationToFunction.set(normalizedOperationId, functionId);
    if (functionToOperation.has(functionId)) {
      report.issues.push(
        issue("error", "wrapper_function_not_1_to_1", "multiple wrapper actions map to one function_id", {
          function_id: functionId,
          wrapper_action_ids: [functionToOperation.get(functionId), normalizedOperationId]
        })
      );
    } else {
      functionToOperation.set(functionId, normalizedOperationId);
    }

    const contract = byFunctionId.get(functionId);
    if (!contract) {
      report.issues.push(
        issue("error", "missing_contract_for_operation", "wrapper operation function_id is missing from function_contracts", {
          operation_id: normalizedOperationId,
          function_id: functionId
        })
      );
      return;
    }

    const contractWrapperAction = normalizeText(contract.wrapper_action_id);
    if (contractWrapperAction !== normalizedOperationId) {
      report.issues.push(
        issue("error", "contract_wrapper_action_mismatch", "contract.wrapper_action_id must match operation_id", {
          operation_id: normalizedOperationId,
          function_id: functionId,
          contract_wrapper_action_id: contractWrapperAction
        })
      );
    }

    const contractInputs = contract.inputs;
    const opInputs = Array.isArray(op.input_args) ? op.input_args : [];
    if (!compareInputLists(contractInputs, opInputs)) {
      report.issues.push(
        issue("error", "contract_input_mismatch", "contract inputs must match wrapper operation input_args", {
          operation_id: normalizedOperationId,
          function_id: functionId
        })
      );
    }

    const contractOutput = contract.output && typeof contract.output === "object" ? contract.output : {};
    const contractOutputSymbol = normalizeText(contractOutput.symbol);
    const contractOutputGroup = normalizeText(contractOutput.group);
    const opOutputSymbol = normalizeText(op.output_symbol);
    const opOutputGroup = normalizeText(op.output_group);
    if (contractOutputSymbol !== opOutputSymbol || contractOutputGroup !== opOutputGroup) {
      report.issues.push(
        issue("error", "contract_output_mismatch", "contract output must match wrapper operation output mapping", {
          operation_id: normalizedOperationId,
          function_id: functionId,
          contract_output_symbol: contractOutputSymbol,
          operation_output_symbol: opOutputSymbol,
          contract_output_group: contractOutputGroup,
          operation_output_group: opOutputGroup
        })
      );
    }
  });

  byFunctionId.forEach((contract, functionId) => {
    const wrapperActionId = normalizeText(contract.wrapper_action_id);
    if (!operationToFunction.has(wrapperActionId)) {
      report.issues.push(
        issue("error", "missing_operation_for_contract", "contract.wrapper_action_id does not exist in wrapper operation_index", {
          function_id: functionId,
          wrapper_action_id: wrapperActionId
        })
      );
    }
  });

  Object.entries(functionSignatureIndex).forEach(([rawFunctionId, rawSignature]) => {
    const functionId = normalizeText(rawFunctionId);
    const signature = rawSignature && typeof rawSignature === "object" ? rawSignature : {};
    const operationIds = Array.isArray(signature.operation_ids) ? signature.operation_ids.map((item) => normalizeText(item)) : [];
    if (operationIds.length !== 1) {
      report.issues.push(
        issue("error", "signature_not_1_to_1", "function_signature_index.operation_ids must contain exactly one action", {
          function_id: functionId,
          operation_ids: operationIds
        })
      );
      return;
    }

    const opId = operationIds[0];
    const mappedFunction = operationToFunction.get(opId);
    if (!mappedFunction) {
      report.issues.push(
        issue("error", "signature_operation_missing", "signature operation_id does not exist in operation_index", {
          function_id: functionId,
          operation_id: opId
        })
      );
      return;
    }
    if (mappedFunction !== functionId) {
      report.issues.push(
        issue("error", "signature_function_mismatch", "signature function_id must match operation function_id", {
          signature_function_id: functionId,
          operation_id: opId,
          operation_function_id: mappedFunction
        })
      );
    }
  });

  Object.entries(pipelineIndex).forEach(([pipelineId, rawOperationIds]) => {
    const operationIds = Array.isArray(rawOperationIds) ? rawOperationIds : [];
    operationIds.forEach((rawOperationId) => {
      const operationId = normalizeText(rawOperationId);
      if (!operationToFunction.has(operationId)) {
        report.issues.push(
          issue("error", "pipeline_operation_missing", "pipeline_index references unknown operation_id", {
            pipeline_id: normalizeText(pipelineId),
            operation_id: operationId
          })
        );
      }
    });
  });

  if (contractFunctionRegexParts.length > 0) {
    const tokenPattern = new RegExp(`\\b(${contractFunctionRegexParts.join("|")})\\b`, "g");
    const candidateFiles = [
      ...listJsFiles(root, "app"),
      ...listJsFiles(root, "brain"),
      ...listJsFiles(root, "main"),
      ...listJsFiles(root, "renderer")
    ];

    candidateFiles.forEach((filePath) => {
      if (allowedImplementationFiles.has(filePath)) {
        return;
      }
      const source = fs.readFileSync(filePath, "utf8");
      const matches = source.match(tokenPattern);
      if (matches && matches.length > 0) {
        const uniqueHits = [...new Set(matches.map((item) => normalizeText(item)))];
        report.issues.push(
          issue("error", "wrapper_bypass_reference", "direct function_id references outside allowed wrapper modules", {
            file: path.relative(root, filePath).replace(/\\/g, "/"),
            function_ids: uniqueHits
          })
        );
      }
    });
  }

  report.counts.errors = report.issues.filter((entry) => entry.level === "error").length;
  report.counts.warnings = report.issues.filter((entry) => entry.level === "warn").length;
  report.status = report.counts.errors > 0 ? "fail" : "pass";
  return report;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const report = validate();
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  if (args.strict && report.status !== "pass") {
    process.exit(1);
  }
}

try {
  main();
} catch (error) {
  process.stderr.write(`validate-wrapper-contracts failed: ${error.message}\n`);
  process.exit(1);
}
