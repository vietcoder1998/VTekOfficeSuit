# Mandatory Rule: Decompose Long Files into Sub-Components & Modules (Rule 16)

> **ZERO TOLERANCE**:
> When creating or refactoring components (`.tsx`), dialogs, or logic files (`.ts`):
>
> ### Line Count Thresholds
> - **Optimal**: `< 300 lines` — Single Responsibility Principle.
> - **Warning**: `400 – 500 lines` — Prepare decomposition plan.
> - **Hard Limit (ZERO TOLERANCE)**: `> 500 lines` for React UI `.tsx` (and `> 700 lines` for Core Engine `.ts`) ➔ **MANDATORY DECOMPOSITION**.

---

## 1. Sub-Component Decomposition Guidelines

1. **Extract UI by Section**: Split into `[component]-header.tsx`, `[component]-body.tsx`, `[component]-footer.tsx`, `[component]-item.tsx`.
2. **Extract Modals & Dialogs**: 100% of modals and drawer panels must reside in dedicated files, never embedded as hundreds of lines of inline JSX.
3. **Extract State & Logic**: Move complex state to custom hooks (`use[Feature]State.ts`) and business calculations to core engine modules.
4. **Modular Directory Structure**: Group related files in a folder with an `index.ts` barrel export.
