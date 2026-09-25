# Mandatory Rule: Cancel Push & Cancel Type-Check on Dirty Working Tree (Rule 27 & Section 579)

> **ZERO TOLERANCE**:
> When interacting with Git, running `git push`, committing, or building:
> 1. **TYPECHECK RUNS EXCLUSIVELY ON GIT PUSH**:
>    - Full TypeScript type-checking (`fast-typecheck` / `npm run type-check`) is **PERMITTED ONLY during git push via `.husky/pre-push` hook**.
>    - Strictly forbidden to run typecheck during `git commit`, `pre-commit` hook, `fast-build`, or normal test cycles.
> 2. **MANDATORY 100% CANCEL PUSH IF WORKING TREE HAS UNCOMMITTED CHANGES**:
>    - If git working tree contains modified, unstaged, uncommitted staged, or untracked files (`git status --porcelain` non-empty):
>      - **Immediately cancel git push (`exit 1`)**.
>      - **STRICTLY PROHIBITED 100%** to push code to remote with a dirty working tree. Only clean, fully committed changes (**staged as commit only**) may be pushed to GitHub remote.
> 3. **MANDATORY 100% CANCEL TYPECHECK UPON DETECTING UNCOMMITTED CODE**:
>    - When uncommitted changes are detected or when push is canceled, **immediately abort `npm run type-check`**. Never waste 1-2 minutes running type analysis on dirty or intermediate code states.
> 4. **ENVIRONMENT FLAG FOR PROACTIVE SKIP**:
>    - For urgent pushes where local verification already passed, developers can use:
>      `SKIP_TYPECHECK=1 git push` or `CANCEL_TYPECHECK=1 git push`
>      to bypass the typecheck step while preserving repository integrity.

---

## 1. Core Purpose & Architectural Importance

1. **Remote Repository Protection & Zero Broken Commits**:
   - Pushing code while local working directory has uncommitted files creates severe risks:
     - Remote commits missing accompanying code files.
     - Fragmented Git histories and broken builds for teammates and CI/CD pipelines.
   - Enforcing push cancellation on dirty trees ensures all code pushed to remote represents a complete, clean, self-contained atomic commit.

2. **Eliminating Redundant Wait Times**:
   - TypeScript compiler checks take 30s to 2min on large repositories.
   - Running typecheck on dirty working trees produces inaccurate diagnostics.
   - Aborting typecheck immediately on dirty trees provides instant (<1s) feedback to the developer.

3. **Integration with .husky Pre-Push Hook & .lowcode Engine**:
   - Controlled automatically at `.husky/pre-push`.
   - Governed by `LcCancelPushOnCodeChangesEngine` (`.lowcode/engines/lc-cancel-push-on-code-changes-engine.ts`), registered in `lc_engines.cancelPushOnCodeChanges`.
   - Specified via MCP Action `enforce_only_run_typecheck_when_push_code` at Section 580.

---

## 2. Push Behavior Matrix

| Working Tree State | Environment Flag | Push Action | Run Type Check? | Pre-Push Result |
|---|---|---|---|---|
| **Dirty Tree** (modified, unstaged, untracked) | Default (no flag) | ❌ **CANCEL PUSH (exit 1)** | ❌ **CANCEL TYPECHECK** | Error: Working tree dirty, commit changes cleanly first |
| **Dirty Tree** | `SKIP_TYPECHECK=1` | ❌ **CANCEL PUSH (exit 1)** | ❌ **CANCEL TYPECHECK** | Error: Working tree dirty, skip flag cannot override dirty tree |
| **Clean Tree** (100% committed / staged as commit only) | Default (no flag) | ✅ **ALLOW PUSH** | ✅ **RUN TYPECHECK** | Run `npm run type-check:fast` (0 errors required) then push |
| **Clean Tree** | `SKIP_TYPECHECK=1` or `CANCEL_TYPECHECK=1` | ✅ **ALLOW PUSH** | ❌ **SKIP TYPECHECK** | Bypass typecheck with confirmation log, push immediately |

---

## 3. Disallowed Phases for Typecheck ❌

1. ❌ Never run typecheck inside `git commit` or `.husky/pre-commit` (commits must complete in <1s).
2. ❌ Never run typecheck on file save or during automated code editing loops.
3. ❌ Never run repetitive full typecheck inside normal unit tests.
4. ❌ Never run typecheck when working tree has uncommitted changes.
