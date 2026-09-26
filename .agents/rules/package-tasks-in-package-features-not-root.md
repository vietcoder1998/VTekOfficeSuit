# Mandatory Rule: Package Tasks Must Be Created in Packages/{name}/.agents/features, Not in Root ./.agents/features/ (Rule 70)

<!-- Test Alias: RULE 70 / PACKAGE TASKS IN PACKAGE .AGENTS/FEATURES NOT ROOT RULE — ZERO TOLERANCE -->
<!-- Legacy Alias: PACKAGE TASKS IN PACKAGE .FEATURES NOT ROOT RULE -->
<!-- Legacy Prompt: if tasks is Packages/{name}; create tasks in to Packages/{name}/.agents/features, not in ./.agents/features/ -->

> **ZERO TOLERANCE**:
> Across all applications, packages, repositories, bots, background runners, and AI coding agents in the 2-TEK ecosystem:
> 1. **MANDATORY 100%: PACKAGE TASKS ROUTED TO `Packages/{name}/.agents/features/`**:
>    - Whenever any task, feature, bug fix, refactor, or UI modification targets or belongs to a specific package under `Packages/` (`Packages/{name}`, e.g. `Packages/Hub`, `Packages/Cloud`, `Packages/Excel`, `Packages/Tasks`, `Packages/Bots`, `Packages/Settings`, etc.):
>    - Developers and AI agents **MUST** create, queue, and log the task exclusively into that package's local `.agents/features/` directory:
>      `Packages/{name}/.agents/features/{dd-mm-yyyy}.md`
>      (prioritizing the current date, format `DD-MM-YYYY.md`, e.g. `23-09-2026.md`) as an uncompleted checkbox task:
>      `- [ ] <type>(<scope>): <description> — Task <id>`
>      (If the item is a bug fix, mark it explicitly as `bug`: `- [ ] [BUG] <description> — Task <id>`).
> 2. **STRICTLY PROHIBITED 100%: CREATING PACKAGE-SPECIFIC TASKS IN ROOT `./.agents/features/`**:
>    - **FORBIDDEN** to create, append, queue, or log tasks targeting `Packages/{name}` into the root workspace `./.agents/features/`.
>    - Root `./.agents/features/` is **EXCLUSIVELY RESERVED** for root workspace / monorepo-level tasks that do not belong to a single package (e.g. root scripts in `scripts/`, global monorepo dependencies in root `package.json`, root `.agents/rules/`, `.github` actions, root multi-repo build orchestration).
> 3. **PACKAGE ENCAPSULATION & AUTONOMOUS REPOSITORY DISCIPLINE**:
>    - Each package in `Packages/` is an independent Git repository with its own release and feature cycle.
>    - Logging tasks in `Packages/{name}/.agents/features/` ensures that git commit history and feature changelogs remain self-contained within the target repository, eliminating noisy cross-contamination and git merge conflicts in the root workspace.
> 4. **TASK QUEUE WORKFLOW INTEGRATION (RULE 67 & RULE 70 ALIGNMENT)**:
>    - When receiving a multi-task prompt or batch queue:
>      - Identify each task's target package.
>      - If target is `Packages/{name}`, append `- [ ] ...` into `Packages/{name}/.agents/features/{dd-mm-yyyy}.md`.
>      - If target is the root workspace, append `- [ ] ...` into `./.agents/features/{dd-mm-yyyy}.md`.
>      - Finish logging the complete queue across target files before starting execution of the tasks.

---

## 1. Core Purpose & Architectural Rationale

1. **Clean Separation of Concerns**:
   - Monorepos with 20+ packages quickly become unmanageable if every local package bug fix or UI tweak is dumped into the root `./.agents/features/` directory.
   - Placing tasks in `Packages/{name}/.agents/features/` keeps the root `.agents/features/` focused strictly on workspace-level tooling and multi-package coordination.

2. **Self-Documenting Git Submodules**:
   - Each package maintains its own autonomous history. Team members and automated CI inspecting `Packages/Hub` can read `Packages/Hub/.agents/features/{date}.md` directly to see what changed without needing to search the root workspace.

3. **Elimination of Monorepo Merge Bottlenecks**:
   - Concurrent tasks on different packages (e.g. one agent working on `Packages/Excel` and another on `Packages/Word`) will modify separate `Packages/{name}/.agents/features/` files, completely eliminating merge conflicts in root `.agents/features/`.

---

## 2. Decision Matrix

| Task Scope | Target File | Allowed in Root `./.agents/features/`? |
|---|---|---|
| Feature / bug in `Packages/Hub` | `Packages/Hub/.agents/features/{date}.md` | ❌ **FORBIDDEN** |
| Feature / bug in `Packages/Tasks` | `Packages/Tasks/.agents/features/{date}.md` | ❌ **FORBIDDEN** |
| Feature / bug in `Packages/Cloud` | `Packages/Cloud/.agents/features/{date}.md` | ❌ **FORBIDDEN** |
| Feature / bug in `Packages/Word` | `Packages/Word/.agents/features/{date}.md` | ❌ **FORBIDDEN** |
| Feature / bug in `Packages/Excel` | `Packages/Excel/.agents/features/{date}.md` | ❌ **FORBIDDEN** |
| Feature / bug in any `Packages/{name}` | `Packages/{name}/.agents/features/{date}.md` | ❌ **FORBIDDEN** |
| Workspace root build script (`scripts/build.ts`) | `./.agents/features/{date}.md` | ✅ **YES** (Root scope) |
| Workspace dependency update (`package.json`) | `./.agents/features/{date}.md` | ✅ **YES** (Root scope) |
| Global AI Agent rules (`.agents/rules/*`) | `./.agents/features/{date}.md` | ✅ **YES** (Root scope) |

---

## 3. Strict Prohibitions ❌ (Zero Tolerance)

1. ❌ **FORBIDDEN** to create or log a task in root `./.agents/features/` when the task is for `Packages/{name}`.
2. ❌ **FORBIDDEN** to duplicate package tasks across both root `./.agents/features/` and `Packages/{name}/.agents/features/`.
3. ❌ **FORBIDDEN** to delete or bypass `Packages/{name}/.agents/features/` in any package repository.
