# UI/UX, Human Factors, and Cognitive Psychology Research Pack (2026-03-05)

## Scope

This research extends the engineering baseline with UI/UX guidance across:

1. usability and accessibility standards,
2. layout ergonomics,
3. interaction psychology and cognitive load,
4. color usage (function, risk, and accessibility),
5. user preference adaptation,
6. measurable UX quality targets.

## Executive Conclusions

1. Accessibility and usability are not separate tracks; they are core quality requirements.
2. Color should be semantic and redundant (never the only signal for critical meaning).
3. Layout should optimize target acquisition, scanning flow, and error recovery.
4. User preferences (contrast, motion, color-scheme, data usage) must be first-class runtime inputs.
5. UX quality must be measured with task success, time, errors, and satisfaction metrics.

## Standards Backbone

### ISO/IEC/IEEE foundation

- `ISO 9241-210` human-centred design process.
- `ISO 9241-11` usability in context of use.
- `ISO 9241-110:2020` interaction principles (current as reviewed in 2025).
- `ISO 9241-112:2025` principles for presentation of information (updated in 2025).
- `ISO 9241-125:2017` visual presentation guidance.
- `ISO 9241-171:2025` software accessibility requirements/guidelines (updated edition).

### W3C/WAI accessibility foundation

- WCAG 2.2 adds critical criteria directly tied to ease of use:
  - `2.4.11` Focus Not Obscured (Minimum),
  - `2.5.8` Target Size (Minimum),
  - `3.2.6` Consistent Help,
  - `3.3.7` Redundant Entry,
  - `3.3.8` Accessible Authentication (Minimum).
- Color and legibility:
  - `1.4.1` Use of Color (do not rely on color alone),
  - `1.4.3` Contrast (Minimum): `4.5:1` text, `3:1` large text.
- Keyboard interaction conventions are codified in WAI-ARIA APG practices.

### User preference adaptation standards

- Media Queries Level 5 user-preference media features:
  - `prefers-color-scheme`,
  - `prefers-contrast`,
  - `prefers-reduced-motion`,
  - `prefers-reduced-data`,
  - `forced-colors`.
- The spec explicitly supports automatic handling of user preferences and recommends opt-out/override controls.

## Psychological and Human-Performance Evidence

### Core laws for interaction performance

- Fitts' Law (target acquisition): larger/closer targets reduce pointing time and error risk.
- Hick-Hyman law (choice reaction): more alternatives increase decision latency.
- Cognitive load theory: unnecessary problem-solving or interface complexity reduces learning/performance capacity.

### Color and psychological functioning

- Color effects are real but context-dependent:
  - task type, culture, semantics, and environment all modulate effects.
- Strong recommendation: use color primarily for semantic signaling and prioritization, not universal emotion assumptions.

## Color Strategy: Evidence-Based Rules

1. Assign semantic roles (`danger`, `warning`, `success`, `info`, `neutral`) with consistent meaning.
2. Provide non-color redundancy for critical states:
   - icon, label, pattern, text cue, or shape change.
3. Meet contrast thresholds:
   - `4.5:1` normal text, `3:1` large text minimum.
4. Reserve high-attention color usage for high-priority states only.
5. Keep a documented color philosophy and avoid ad-hoc palette decisions.

## Layout Ergonomics Strategy

1. Use target sizing rules:
   - WCAG 2.2 minimum `24x24` CSS px (or spacing exception),
   - larger targets preferred for touch-heavy actions.
2. Preserve focus visibility and non-obscured interaction states.
3. Keep help mechanisms and navigation order consistent across repeated flows.
4. Reduce redundant form entry through auto-population and selection.
5. Keep hierarchy clear with scale, contrast, spacing, and grouping cues.

## User Preference and Ease-of-Use Strategy

1. Respect system-level motion preferences via `prefers-reduced-motion`.
2. Respect `prefers-color-scheme` and `prefers-contrast` without overriding user control.
3. Offer reversible choices for major personalization settings.
4. Minimize recall burden using recognition-first patterns and progressive disclosure.
5. Keep error prevention and recovery explicit (undo, confirmations, clear diagnostics).

## Measurement Model (Recommended)

Track by task and by persona:

1. task success rate,
2. time on task,
3. error rate and error recovery time,
4. abandonment rate per flow,
5. user satisfaction score (e.g., SUS-compatible process),
6. accessibility conformance pass rates by WCAG criterion.

## AIO-Specific Implementation Direction

1. Introduce a machine-readable UI/UX blueprint catalog:
   - color semantics,
   - layout ergonomics,
   - preference handling,
   - measurement plan.
2. Generate a repeatable `ui_ux_blueprint.md` artifact from that catalog.
3. Gate workflow and governance checks against the UI/UX catalog.
4. Require UX preference checks and accessibility checks in refactor and release gates.

## Sources

- ISO 9241-112:2025: https://www.iso.org/standard/87518.html
- ISO 9241-171:2025: https://www.iso.org/standard/86308.html
- ISO 9241-110:2020: https://www.iso.org/standard/75258.html
- ISO 9241-125:2017: https://www.iso.org/standard/64839.html
- WCAG 2.2: https://www.w3.org/TR/WCAG22/
- Understanding SC 2.5.8 Target Size (Minimum): https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
- Understanding SC 1.4.1 Use of Color: https://www.w3.org/WAI/WCAG21/Understanding/use-of-color
- WAI-ARIA APG keyboard interface: https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/
- Media Queries Level 5: https://www.w3.org/TR/mediaqueries-5/
- W3C Technique C39 (`prefers-reduced-motion`): https://www.w3.org/WAI/WCAG21/Techniques/css/C39
- Fitts (PubMed record): https://pubmed.ncbi.nlm.nih.gov/1402698/
- Hick’s law review (PubMed): https://pubmed.ncbi.nlm.nih.gov/28434379/
- Sweller 1988 (Cognitive Load): https://www.sciencedirect.com/science/article/pii/0364021388900237
- Color Psychology review (Annual Review): https://www.annualreviews.org/content/journals/10.1146/annurev-psych-010213-115035
- Microsoft target sizing guidance: https://learn.microsoft.com/en-us/windows/apps/develop/input/guidelines-for-targeting
- NASA display/human factors reference: https://www.nasa.gov/reference/appendix-f-vol-2/
- Section 508 color usage accessibility: https://www.section508.gov/create/making-color-usage-accessible/
- NNGroup heuristics: https://www.nngroup.com/articles/ten-usability-heuristics/
- NNGroup visual design principles: https://www.nngroup.com/articles/principles-visual-design/
