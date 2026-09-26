---
trigger: always_on
---

# Mandatory Rule: Explicit Variable Type Annotation Before '=' Assignment Operator (Rule 44)

> **ZERO TOLERANCE**:
> When writing TypeScript source code, React components (`.tsx`), Core Engines (`.ts`), Controllers, Stores, Services, API routes, or scripts across all projects:
> 1. **MANDATORY 100%: EXPLICIT VARIABLE TYPE ANNOTATION BEFORE THE '=' SIGN (`: Type =`)**:
>    - Every variable declared with `const` or `let` MUST have an explicit type annotation prior to the assignment operator `=`:
>      `const variableName: Type = initialValue;`
>      `let variableName: Type = initialValue;`
>    - **STRICTLY PROHIBITED 100%**: Declaring variables with `=` while omitting explicit type annotations (untyped variable assignment / implicit inference: `const variableName = value` ➔ VIOLATION).
> 2. **CROSS-GOVERNANCE CONFORMANCE**:
>    - Must strictly comply with Rule 25 (Clean Code Zero Any — `: any =` is forbidden).
>    - Must strictly pass Rule 43 pre-commit runtime and typecheck validation.

---

## 1. Concrete Examples & Comparison Matrix

| Prohibited Untyped Syntax ❌ | Mandatory Explicit Type Annotation ✅ |
|---|---|
| `const timeoutMs = 5000;` | `const timeoutMs: number = 5000;` |
| `const botName = '2-tek';` | `const botName: string = '2-tek';` |
| `const isRunning = true;` | `const isRunning: boolean = true;` |
| `const projects = [];` | `const projects: ProjectStructureDefinition[] = [];` |
| `const response = await fetch(...);` | `const response: Response = await fetch(...);` |
| `let retryCount = 0;` | `let retryCount: number = 0;` |

---

## 2. Core Architectural Benefits

1. **Type Safety & Predictability**:
   - Prevents unintended type widening (e.g. empty arrays implicitly typed as `never[]` or `any[]`).
2. **Self-Documenting Codebase**:
   - Developers and AI agents immediately understand variable shapes without needing LSP hover tooltips.
3. **Pinpointed Compiler Diagnostics**:
   - Type mismatches fail immediately at the declaration site rather than propagating deeply into consumer functions.
