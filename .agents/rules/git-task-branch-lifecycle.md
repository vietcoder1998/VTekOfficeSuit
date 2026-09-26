---
trigger: always_on
---

# Mandatory Rule: Git Task Branch Lifecycle — Checkout from Tasks and Merge Back to Parent on Completion (Section 522)

> **ZERO TOLERANCE**:
> When creating or implementing any task, feature, or bug fix across the entire project:
>
> 1. **MANDATORY 100% CHECKOUT AN ISOLATED TASK BRANCH FROM TASKS / PARENT BRANCH**:
>    - Before writing code or modifying any file for a task, developers and AI Agents **MUST** checkout a dedicated task branch from the base `tasks` branch (or specified parent branch, e.g. `main`):
>      `git checkout tasks` (or `git checkout <parent-branch>`)
>      `git pull origin <parent-branch>`
>      `git checkout -b task/<task-id>-<slug>`
>    - **STRICTLY PROHIBITED 100%** to commit directly to the parent branch without creating an isolated task branch.
> 2. **MANDATORY 100% UPON TASK DONE: RETURN TO PARENT BRANCH, RESOLVE CONFLICTS, AND MERGE FROM TASK BRANCH**:
>    - When all work on the task is completed and local tests pass:
>      - Switch back to parent branch: `git checkout <parent-branch>`
>      - Pull latest remote changes: `git pull origin <parent-branch>`
>      - Thoroughly resolve conflict and merge changes from the task branch (`last_branch`): `git merge <task-branch>`
>      - Run automated tests (`vitest run ...`) and typecheck (`npm run type-check`) to confirm zero regressions.
>      - Push the merged code to remote: `git push origin <parent-branch>`
>      - Clean up local task branch if needed: `git branch -d <task-branch>`.
>
> <!-- Legacy Title / Test Alias: 23. **[QUY TẮC BẮT BUỘC: VÒNG ĐỜI NHÁNH GIT CHO TỪNG TASK — CHECKOUT TỪ TASKS VÀ MERGE VỀ PARENT BRANCH KHI HOÀN THÀNH (GIT TASK BRANCH LIFECYCLE RULE — ZERO TOLERANCE)]** -->

---

## 1. Core Purpose & Architectural Importance

1. **Workspace Isolation & Zero Regression**:
   - Developing directly on the main or shared parent branch risks incomplete commits breaking the build or impacting concurrent development.
   - Dedicated task branches (`task/*`) ensure all experimentation, refactoring, and implementations remain strictly sandboxed and safe.

2. **Clean Merge & Transparent Conflict Resolution**:
   - When multiple tasks proceed concurrently, shared registry files (`actions.json`, `standard-specification.md`) can conflict.
   - By pulling fresh remote changes to the parent branch and performing `git merge <task-branch>`, all conflicts are actively inspected, resolved, and verified prior to pushing.

3. **Traceable Git History**:
   - Each task maps to a structured sequence of Conventional Commits (`feat:`, `fix:`, `refactor:`, `test:`) integrated into the parent branch via a clean merge commit.

4. **Integration with .lowcode Engine & MCP Standard**:
   - Controlled automatically by `LcGitTaskBranchWorkflowEngine` (`Lowcode/engines/lc-git-task-branch-workflow-engine.ts`), registered in `lc_engines.gitTaskBranchWorkflow`.
   - Formally specified via MCP Action `enforce_git_task_branch_lifecycle_rule` under Section 522 in `standard-specification.md`.

---

## 2. Standard 2-Phase Lifecycle Workflow

### Phase 1: Task Creation Phase

```bash
# 1. Identify current parent branch (e.g., main, tasks, or feat/...)
PARENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

# 2. Synchronize latest remote code
git checkout tasks || git checkout $PARENT_BRANCH
git pull origin $PARENT_BRANCH

# 3. Create and switch to new task branch
git checkout -b task/<task-id>-<slug>
# Example: git checkout -b task/5517-git-lifecycle-rule
```

Then execute work following the 4-step process:

1. Register MCP Standard First (`actions.json`, `schemas/`, `templates/`, `standard-specification.md`):
   - _Note_: If the task is a bug fix, file/folder move or rename, or component styling/props modification, **DO NOT implement to MCP** (strictly exempt, skip Step 1); otherwise (new feature/tool/service), MCP registration is mandatory.
   - <!-- Compatibility: Đăng ký MCP Standard First | TUYỆT ĐỐI KHÔNG triển khai vào MCP -->
2. Complete Core Engine First (`Lowcode/engines/`, unit tests).
3. Implement UI / Rules Layer conforming to IDE Theme standards and Base components.
4. Commit Conventional Commits on the task branch.

### Phase 2: Task Done & Merge to Parent Phase

```bash
# 1. Return to parent branch
git checkout <parent-branch>

# 2. Pull latest remote updates
git pull origin <parent-branch>

# 3. Merge task branch and resolve conflict if any
git merge <task-branch>

# 4. Verify automated tests
npm run test:fast

# 5. Push clean merged commits to remote
git push origin <parent-branch>
```

---

## 3. Strict Prohibitions ❌

1. ❌ **FORBIDDEN** to commit directly on `main` or `tasks` without creating an isolated `task/*` branch.
2. ❌ **FORBIDDEN** to push unmerged task branches directly to remote while leaving the parent branch desynchronized.
3. ❌ **FORBIDDEN** to ignore merge conflicts or use `--force` flag during integration.
