# Mandatory Rule: Check & Fix TypeScript & Runtime Problems Before Commit (Rule 43)

> **ZERO TOLERANCE**:
> Before running any `git commit` command across all projects (`bot`, `LowcodeStudio`, `Office`, `SuperChat`, `server`, `web`):
> 1. **MANDATORY 100%: EXECUTE PRE-COMMIT TYPESCRIPT & RUNTIME CHECKS**:
>    - Must run the automated check script via `npm run check:runtime` (`node scripts/check-typescript-runtime.mjs`) or through `.husky/pre-commit`.
>    - Mandatory 3-phase verification:
>      - **Phase 1 (Type Checking)**: Comprehensive compilation check `tsc --noEmit` — must exit with 0 compiler errors.
>      - **Phase 2 (Node Native Type-Stripping Syntax)**: Runtime syntax inspection `node --check` across 100% of files in `src/**/*.ts`.
>      - **Phase 3 (ESM Runtime Imports)**: Validate that 100% of relative import statements specify valid runtime extensions (`.ts`, `.js`, `.mjs`, `.json`), preventing `ERR_MODULE_NOT_FOUND`.
> 2. **MANDATORY 100%: FIX BEFORE COMMIT**:
>    - If any compiler error, runtime syntax error, or missing file extension is detected:
>      - **DO NOT commit code**.
>      - **STRICTLY FORBIDDEN** to bypass checks with `@ts-ignore`, `@ts-nocheck`, or loose `any` casts.
>      - Fix root causes in source files until `npm run check:runtime` exits with code 0.
> 3. **AUTOMATED PROTECTION VIA HUSKY**:
>    - The `.husky/pre-commit` hook automatically enforces this check on every commit attempt.

---

## 1. 3-Phase Verification Overview

| Phase | Command | Objective | Pass Requirement |
|---|---|---|---|
| **1. Type Checking** | `tsc --noEmit` | Validate interfaces, types, signatures, generics | 0 errors (Exit Code 0) |
| **2. Node Syntax** | `node --check src/**/*.ts` | Validate Node 22 native type-stripping compatibility | 100% files pass |
| **3. ESM Extensions** | AST Import Scanner | Confirm all relative imports end with `.ts`/`.js` | Zero extensionless imports |

---

## 2. Strict Prohibitions ❌

1. ❌ Never commit code while `tsc --noEmit` or `npm run check:runtime` reports errors.
2. ❌ Never bypass hooks using `git commit --no-verify`.
3. ❌ Never use extensionless relative imports (e.g. `import x from './service'` must be `import x from './service.ts'`).
4. ❌ Never import `.tsx` files inside pure Node.js backend scripts or unit tests.
