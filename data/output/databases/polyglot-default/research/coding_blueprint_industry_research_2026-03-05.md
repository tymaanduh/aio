# Coding Standards, Blueprinting, and Pipeline Research (Verified 2026-03-05)

## Objective

Define an enforceable, polyglot-safe standards baseline for:

1. coding formats,
2. blueprint creation,
3. design/delivery pipelines,
4. function naming and structure,
5. project file organization,
6. jargon normalization.

The target outcome is 1:1 contract-driven wrappers with minimal duplicated logic across JavaScript, Python, C++, Ruby, and TypeScript.

## Primary Findings

1. The strongest polyglot pattern is contract-first + code generation.
2. Architecture documentation should be explicit, view-based, and decision-traceable.
3. Function naming conventions differ by language syntax, but semantic rules are stable across languages.
4. Delivery quality improves when formatting/linting/testing/security/benchmark gates are ordered and mandatory.
5. Security and supply-chain standards are now baseline expectations, not optional add-ons.

## Standards Research Summary

### Coding Format Standards

- Python:
  - PEP 8 defines naming and style conventions, including `lower_case_with_underscores` for functions.
  - PEP 257 defines docstring conventions.
  - Black enforces deterministic formatting and documents style stability.
- JavaScript/TypeScript:
  - ESLint config is the primary enforceable style policy mechanism.
  - Google JS style guide still provides practical naming taxonomy (`lowerCamelCase`, `CONSTANT_CASE`).
- C++:
  - C++ Core Guidelines emphasize cohesive functions and consistent naming rules (F.1/F.2/F.3, NL.7/NL.8).
  - `clang-format` provides deterministic code formatting.
- Cross-editor:
  - EditorConfig provides a portable base formatting contract.

### Blueprint Creation Standards

- IEEE 42010 defines architecture description requirements (updated with IEEE 42010-2022 as successor).
- C4 model defines hierarchical architectural views (system -> container -> component -> code).
- arc42 provides a practical architecture documentation template.
- ADRs provide recordable, reviewable architecture decisions.

Recommended blueprint package:

1. C4 diagrams for context, container, and component views.
2. arc42 narrative sections for quality concerns and constraints.
3. ADR log for major design choices and reversals.

### Design and Delivery Pipeline Standards

- GitHub Flow formalizes branch/PR/review/merge workflow.
- Conventional Commits formalizes commit intent for automation.
- SemVer formalizes API compatibility signaling.
- NIST SSDF formalizes secure software development tasks.
- OWASP ASVS formalizes verification requirements.
- SLSA formalizes build/provenance assurance levels.

Recommended gate sequence:

1. format,
2. lint/type,
3. tests,
4. contract drift validation,
5. security checks,
6. runtime benchmark checks,
7. release metadata generation (SemVer + changelog).

## Function Naming Research and Guidance

### Cross-language semantic rules

1. Name by behavior, not implementation detail.
2. Use verb-oriented function names.
3. Keep one logical operation per function.
4. Scale name length by scope and ambiguity risk.
5. Keep naming consistent inside a module boundary.

### Language surface mapping

- JavaScript/TypeScript:
  - Function/method names: `lowerCamelCase`
  - Constants: `CONSTANT_CASE`
- Python:
  - Function/method names: `lower_snake_case`
  - Module/package names: short lowercase
- C++:
  - Use one project-wide convention; optimize for clarity and consistency.
- Ruby:
  - Method/file names: `snake_case`
  - Predicates: `?` suffix where idiomatic.

### Empirical naming research signal

The method-naming survey (arXiv:2102.13555) found broad agreement on naming standards across experience levels and languages, supporting one shared semantic naming policy with language-specific surface adapters.

## Project File Organization Research

- Python packaging guidance recommends evaluating `src` layout to prevent accidental local import coupling.
- npm docs require `name` and `version` in `package.json`, and define published surface controls through package metadata.
- Go module layout guidance recommends starting simple, then evolving structure when needed.
- C++ Core Guidelines reinforce interface/implementation separation and self-contained headers.

## Repo-Specific Observations (Local Audit Snapshot)

Audit run on 2026-03-05 across non-vendor/non-build sources:

- Total source files scanned: `264`
- Filenames with `_`: `152`
- Filenames with `-`: `93`
- Filenames using strict camelCase base names: `0`

Interpretation:

1. This repo is already largely underscore-oriented, but mixed with kebab naming.
2. Pick one filename style per layer (recommended: keep existing underscore bias for internal source and reserve kebab only where externally required).
3. Keep generated language bindings in language-native naming conventions while retaining stable semantic IDs in shared data catalogs.

## Jargon Normalization (Recommended Canonical Terms)

- `contract-first`: behavior/spec defined in shared data before code implementation.
- `wrapper`: language-specific adapter over shared contract behavior.
- `single logical operation`: one cohesive behavior per function.
- `blueprint`: architecture package (views + narrative + decision records).
- `verification standard`: external benchmark for quality/security checks.
- `supply-chain assurance`: guarantees about provenance and build integrity.

## 90-Day Adoption Blueprint

### Phase 1 (Weeks 1-3): Standard Lock-In

1. Freeze naming policy by language surface.
2. Freeze directory intent (contracts/runtime/generators/adapters/reports).
3. Enforce formatter + linter gates in CI.

### Phase 2 (Weeks 4-6): 1:1 Wrapper Hardening

1. Keep all function/object/const IDs in shared catalogs only.
2. Generate wrappers per language from catalogs.
3. Prevent manual edits of generated artifacts.

### Phase 3 (Weeks 7-9): Blueprint + Governance

1. Publish C4 + arc42 baseline.
2. Start ADR log for architectural decisions.
3. Wire Conventional Commits + SemVer release automation.

### Phase 4 (Weeks 10-12): Security + Performance Enforcement

1. Integrate SSDF and ASVS checks.
2. Enforce SLSA-aligned provenance steps incrementally.
3. Require benchmark report artifacts for supported languages.

## Deliverables Added for This Research

1. This report:
   - `data/output/databases/polyglot-default/research/coding_blueprint_industry_research_2026-03-05.md`
2. Machine-readable standards catalog:
   - `data/input/shared/main/polyglot_engineering_standards_catalog.json`
3. Jargon glossary:
   - `data/output/databases/polyglot-default/research/polyglot_jargon_glossary_2026-03-05.json`
4. Deep ISO/IEC/IEEE standards research pack:
   - `data/output/databases/polyglot-default/research/iso_industry_standards_deep_research_2026-03-05.md`
5. Machine-readable ISO traceability catalog:
   - `data/input/shared/main/iso_standards_traceability_catalog.json`
6. Naming/storage/optimization deep research pack:
   - `data/output/databases/polyglot-default/research/naming_data_storage_optimal_coding_research_2026-03-05.md`
7. Executive engineering baseline catalog:
   - `data/input/shared/main/executive_engineering_baseline.json`

## Primary Sources

- PEP 8: https://peps.python.org/pep-0008/
- PEP 257: https://peps.python.org/pep-0257/
- C++ Core Guidelines: https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines
- Google JavaScript Style Guide: https://google.github.io/styleguide/jsguide.html
- Ruby Style Guide: https://rubystyle.guide/
- EditorConfig Specification: https://spec.editorconfig.org/
- clang-format Style Options: https://clang.llvm.org/docs/ClangFormatStyleOptions.html
- ESLint Configure Files: https://eslint.org/docs/latest/use/configure/configuration-files
- Black Code Style: https://black.readthedocs.io/en/stable/the_black_code_style/
- Python Packaging (`src` vs flat): https://packaging.python.org/en/latest/discussions/src-layout-vs-flat-layout/
- npm package.json: https://docs.npmjs.com/cli/v11/configuring-npm/package-json
- Go module layout: https://tip.golang.org/doc/modules/layout
- IEEE 42010: https://www.iso.org/standard/74393.html
- IEEE 42010 (legacy/superseded page): https://standards.ieee.org/ieee/42010/5334/
- C4 Model: https://c4model.com/
- arc42: https://arc42.org/
- ADR: https://adr.github.io/
- GitHub Flow: https://docs.github.com/en/get-started/using-github/github-flow
- Conventional Commits 1.0.0: https://www.conventionalcommits.org/en/v1.0.0/
- SemVer 2.0.0: https://semver.org/spec/v2.0.0.html
- NIST SSDF SP 800-218: https://csrc.nist.gov/pubs/sp/800/218/final
- OWASP ASVS: https://owasp.org/www-project-application-security-verification-standard/
- SLSA: https://slsa.dev/spec/v1.1/
- Method naming survey (arXiv): https://arxiv.org/abs/2102.13555
