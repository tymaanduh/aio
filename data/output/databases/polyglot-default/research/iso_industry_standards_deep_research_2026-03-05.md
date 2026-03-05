# Deep ISO/IEC/IEEE Research Pack for Coding Standards, Blueprints, and Design Pipelines (2026-03-05)

## Scope

This research extends the prior standards report with a deeper ISO-first mapping across:

1. coding and naming governance,
2. architecture blueprints,
3. requirements and information-item management,
4. software quality and measurement,
5. testing and verification,
6. security and vulnerability handling,
7. supply-chain and open-source compliance,
8. usability and accessibility,
9. AI-ready extension standards.

Primary objective for this repo: enforce modular 1:1 wrapper behavior across languages with a standards-backed engineering pipeline.

## Method

- Date of research: `2026-03-05` (America/New_York).
- Source priority: official ISO/IEC/IEEE catalog pages and authoritative standards bodies pages.
- Interpretation method:
  - ISO pages provide standard metadata, status, and scope.
  - Full clause text is often licensed; clause-level implementation controls are inferred from public scope/metadata and established engineering practice.

Inference note:
- Where this report maps standards to concrete repo controls, that mapping is an inference from standard scope and is labeled as an implementation recommendation, not a verbatim requirement.

## Executive Synthesis

1. ISO coverage for this topic is broad enough to define an end-to-end engineering operating model.
2. The minimum serious baseline for this repo is:
   - lifecycle (`12207` + `15288`),
   - architecture (`42010`),
   - requirements (`29148`),
   - quality model (`25010`),
   - measurement (`15939`),
   - testing (`29119`),
   - security (`27001` + `27034-1` + `30111` + `29147`),
   - supply-chain compliance (`5230` + SPDX/`5962` trajectory).
3. For your cross-language wrapper goal, standards alignment is strongest when contracts and naming are centralized in data catalogs and wrappers are generated with deterministic gates.

## ISO Standards Matrix (Deep)

### A) Governance and Quality Management

1. `ISO 9001` (quality management systems)
   - Purpose: process consistency, corrective actions, continual improvement.
   - Repo implication (recommended): quality gates and nonconformance logs for failed workflow stages.
2. `ISO/IEC 38500` (governance of IT)
   - Purpose: governance principles for IT decisions and accountability.
   - Repo implication (recommended): explicit ownership for standards catalogs and gate exemptions.
3. `ISO 10007` (configuration management)
   - Purpose: configuration identification, control, status accounting, audits.
   - Repo implication (recommended): treat contracts, generated outputs, and benchmark reports as controlled configuration items.

### B) Lifecycle Process Standards

1. `ISO/IEC/IEEE 12207` (software life cycle processes)
2. `ISO/IEC/IEEE 15288` (system life cycle processes)
3. `ISO/IEC/IEEE 24748-1` (life cycle management guidance)
4. `ISO/IEC/IEEE 16326` (project management)
5. `ISO/IEC/IEEE 29110-1` (VSE profiles and concepts)

Implementation path (recommended):
- Define workflow stages to mirror lifecycle processes:
  - plan -> specify -> implement -> verify -> release -> operate -> improve.

### C) Architecture, Requirements, and Information Items

1. `ISO/IEC/IEEE 42010` (architecture description)
2. `ISO/IEC/IEEE 42020` (architecture processes)
3. `ISO/IEC/IEEE 42030` (architecture evaluation)
4. `ISO/IEC/IEEE 29148` (requirements engineering)
5. `ISO/IEC/IEEE 15289` (content of life-cycle information items)
6. `ISO/IEC/IEEE 24765` (vocabulary)

Implementation path (recommended):
- Keep a standards-backed blueprint pack:
  - C4 views for layered communication,
  - ADR log for traceability,
  - machine-readable requirements catalog tied to wrapper contracts,
  - glossary catalog (already started in this repo).

### D) Software Quality Models and Measurement

1. `ISO/IEC 25010` (software product quality model)
2. `ISO/IEC 25023` (measurement of system/software quality)
3. `ISO/IEC 25030` (quality requirements framework)
4. `ISO/IEC 25040` (evaluation process)
5. `ISO/IEC/IEEE 15939` (measurement process)
6. `ISO/IEC 5055` (automated source code quality measures)

Implementation path (recommended):
- Define measurable targets for each quality characteristic (performance efficiency, maintainability, reliability, security).
- Emit quality metrics as artifacts in `data/output/.../reports`.

### E) Testing and Verification

1. `ISO/IEC/IEEE 29119-1` (concepts and definitions)
2. `ISO/IEC/IEEE 29119-2` (test processes)
3. `ISO/IEC/IEEE 29119-3` (test documentation)
4. `ISO/IEC/IEEE 29119-4` (test techniques)
5. `ISO/IEC/IEEE 29119-5` (keyword-driven testing)

Implementation path (recommended):
- Standardize a test-information model:
  - test basis -> test conditions -> test cases -> expected outcomes -> result logs.

### F) Security Engineering and Vulnerability Handling

1. `ISO/IEC 27001` (ISMS requirements)
2. `ISO/IEC 27002` (information security controls)
3. `ISO/IEC 27005` (information security risk management)
4. `ISO/IEC 27034-1` (application security overview and concepts)
5. `ISO/IEC 30111` (vulnerability handling processes)
6. `ISO/IEC 29147` (vulnerability disclosure)
7. `ISO/IEC TS 17961` (secure coding rules for C)
8. `ISO/IEC 24772-1` (language-independent vulnerability guidance)

Implementation path (recommended):
- Add explicit security governance files:
  - vulnerability intake and triage policy,
  - coordinated disclosure policy,
  - code-level secure rulesets for native modules (C/C++).

### G) Supply Chain, Open Source, and Provenance

1. `ISO/IEC 5230` (OpenChain for OSS license compliance)
2. `ISO/IEC DIS 5962` (SPDX, draft trajectory)
3. `ISO/IEC 20243` (O-TTPS; trusted supply-chain process)

Implementation path (recommended):
- Generate SBOM/provenance artifacts and map dependencies to compliance records.

### H) Human-Centered and Accessibility Standards

1. `ISO 9241-210` (human-centered design)
2. `ISO/IEC 40500` (WCAG 2.0 standard adoption)

Implementation path (recommended):
- Add accessibility checks and usability acceptance criteria to frontend gates.

### I) AI Extension Standards (Future-Proofing)

1. `ISO/IEC 42001` (AI management systems)
2. `ISO/IEC 22989` (AI concepts and terminology)
3. `ISO/IEC 23053` (AI systems using ML framework)
4. `ISO/IEC 23894` (AI risk management)
5. `ISO/IEC 5338` (AI engineering life cycle process)

Implementation path (recommended):
- If AI-assisted coding/agents become production-critical, treat prompts, model policy, and evaluation datasets as governed artifacts.

## Standards Paths (Dependency-Oriented)

### Path 1: Core Engineering Baseline

`12207 -> 42010 -> 29148 -> 25010 -> 29119 -> 15939`

Outcome:
- Standardized lifecycle, architecture, requirements, testing, and metrics.

### Path 2: Secure SDLC Path

`12207 + 27001 + 27034-1 + 30111 + 29147 + 24772-1`

Outcome:
- Security controls integrated into development, plus vulnerability handling and disclosure.

### Path 3: Code Quality and Maintainability Path

`25010 + 25023 + 25040 + 5055`

Outcome:
- Quantifiable maintainability/reliability/performance quality with repeatable evaluation.

### Path 4: Supply Chain Assurance Path

`5230 + 5962 (SPDX trajectory) + 20243`

Outcome:
- Better OSS compliance and provenance confidence for dependencies and artifacts.

### Path 5: UX and Accessibility Path

`9241-210 + 40500`

Outcome:
- Human-centered workflow with enforceable accessibility baseline.

### Path 6: AI Governance Path

`42001 + 22989 + 23053 + 23894 + 5338`

Outcome:
- Governed AI integration model for future agent-heavy workflows.

## Mapping to Your Repo (Practical)

### Existing strengths

1. Shared data catalogs and wrapper registries already align with a contract-first model.
2. Existing validation scripts and benchmark orchestration are compatible with measurement-driven standards.
3. Research artifacts are already being stored as machine-readable and human-readable outputs.

### Observed structural signals (2026-03-05 audit)

1. Non-vendor source files scanned: `264`
2. Extension mix:
   - `.js`: `247`
   - `.cpp`: `11`
   - `.py`: `3`
   - `.ts`: `2`
   - `.rb`: `1`
3. Filename mix:
   - underscore-style base names: `152`
   - hyphenated base names: `93`
   - PascalCase base names: `9`

Recommendation:
- Keep semantic identifiers centralized in shared catalogs; enforce one filename convention per layer to reduce tooling drift.

### Gap shortlist against ISO-heavy baseline

1. No explicit architecture package in repo (`42010`/`42020`/`42030` style evidence).
2. No formal requirements traceability set tied to implementation tasks (`29148`).
3. No explicit test documentation model mapped to `29119-3`.
4. No explicit vulnerability disclosure and handling policy files (`29147` + `30111`).
5. No SBOM/SPDX compliance artifact flow (`5962` trajectory + `5230`).
6. No explicit quality measurement dictionary mapped to `25023` and `15939`.

## 12-Week ISO-Centric Implementation Plan

### Weeks 1-2

1. Freeze governance roles for standards catalogs and gates.
2. Add controlled artifact policy (contracts, generated wrappers, benchmarks, reports).

### Weeks 3-4

1. Create architecture package:
   - context/container/component views,
   - ADR baseline.
2. Build requirements catalog linked to wrapper function IDs.

### Weeks 5-6

1. Add test documentation schema aligned to `29119`.
2. Add quality metrics dictionary and thresholds (`25010`/`25023`/`15939`).

### Weeks 7-8

1. Add secure SDLC policy, vulnerability disclosure policy, and triage workflow.
2. Add C/C++ secure coding checks for native segments.

### Weeks 9-10

1. Add supply-chain artifacts:
   - dependency inventory,
   - SBOM-compatible output format,
   - provenance metadata.

### Weeks 11-12

1. Add accessibility and UX acceptance gates.
2. Publish standards conformance dashboard with trend tracking.

## Primary ISO/IEC/IEEE Sources

- ISO/IEC/IEEE 12207: https://www.iso.org/standard/63712.html
- ISO/IEC/IEEE 15288: https://www.iso.org/standard/81702.html
- ISO/IEC/IEEE 24748-1: https://www.iso.org/standard/68940.html
- ISO/IEC/IEEE 16326: https://www.iso.org/standard/77577.html
- ISO/IEC/IEEE 29110-1: https://www.iso.org/standard/62873.html
- ISO/IEC/IEEE 29148: https://www.iso.org/standard/72089.html
- ISO/IEC/IEEE 15289: https://www.iso.org/standard/63713.html
- ISO/IEC/IEEE 24765: https://www.iso.org/standard/50518.html
- ISO/IEC/IEEE 42010: https://www.iso.org/standard/74393.html
- ISO/IEC/IEEE 42020: https://www.iso.org/standard/74394.html
- ISO/IEC/IEEE 42030: https://www.iso.org/standard/50508.html
- ISO/IEC 25010: https://www.iso.org/standard/78175.html
- ISO/IEC 25023: https://www.iso.org/standard/35733.html
- ISO/IEC 25030: https://www.iso.org/standard/64764.html
- ISO/IEC 25040: https://www.iso.org/standard/35765.html
- ISO/IEC/IEEE 15939: https://www.iso.org/standard/73580.html
- ISO/IEC 5055: https://www.iso.org/standard/83844.html
- ISO/IEC/IEEE 29119-1: https://www.iso.org/standard/45142.html
- ISO/IEC/IEEE 29119-2: https://www.iso.org/standard/45143.html
- ISO/IEC/IEEE 29119-3: https://www.iso.org/standard/45144.html
- ISO/IEC/IEEE 29119-4: https://www.iso.org/standard/45145.html
- ISO/IEC/IEEE 29119-5: https://www.iso.org/standard/74444.html
- ISO/IEC 27001: https://www.iso.org/standard/27001
- ISO/IEC 27002: https://www.iso.org/standard/75652.html
- ISO/IEC 27005: https://www.iso.org/standard/80585.html
- ISO/IEC 27034-1: https://www.iso.org/standard/44379.html
- ISO/IEC 30111: https://www.iso.org/standard/64004.html
- ISO/IEC 29147: https://www.iso.org/standard/45170.html
- ISO/IEC TS 17961: https://www.iso.org/standard/61134.html
- ISO/IEC 24772-1: https://www.iso.org/standard/70097.html
- ISO/IEC 5230: https://www.iso.org/standard/81039.html
- ISO/IEC DIS 5962: https://www.iso.org/standard/81870.html
- ISO/IEC 20243: https://www.iso.org/standard/81116.html
- ISO 9241-210: https://www.iso.org/standard/77520.html
- ISO/IEC 40500: https://www.iso.org/standard/58625.html
- ISO/IEC 42001: https://www.iso.org/standard/81230.html
- ISO/IEC 22989: https://www.iso.org/standard/74296.html
- ISO/IEC 23053: https://www.iso.org/standard/74438.html
- ISO/IEC 23894: https://www.iso.org/standard/77304.html
- ISO/IEC 5338: https://www.iso.org/standard/81192.html
- ISO 9001: https://www.iso.org/iso-9001-quality-management.html
- ISO 10007: https://www.iso.org/standard/70345.html
- ISO/IEC 38500: https://www.iso.org/standard/62816.html
