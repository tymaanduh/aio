# Brain

This directory is the function layer that bridges input data to output data.

- `brain/modules/`: core reusable function modules.
- `brain/math/`: math-first primitives and assembly-line math handlers.
- `brain/wrappers/`: 1:1 action wrappers that orchestrate module/math calls.

Application shells should call functions from this directory rather than embedding logic elsewhere.
