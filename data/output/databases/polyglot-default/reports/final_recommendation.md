# Final Recommendation

- Run mode: maintain
- Primary language: C++
- Fallback language: Python
- Benchmark set: C++, Python, C#, JavaScript, TypeScript

## Gate Status
- Wrapper preflight stage planned: yes
- Wrapper preflight passed: yes
- Build checks stage planned: yes
- Build checks passed: yes
- Security stage planned: yes
- Security gate passed: yes
- Benchmark top result: python

## Rationale
- Selection is weighted by runtime, size, startup, memory, portability, tooling, security, and velocity.
- Maintain mode reuses existing artifacts and only runs stale stages unless forced.
- Recommendation keeps one primary and one fallback for risk-managed delivery.
