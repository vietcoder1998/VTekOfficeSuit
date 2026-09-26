# Mandatory Rule: Cancel Previous Type-Check on New Push or Commit (Rule 30 & Section 582)

> **ZERO TOLERANCE**:
> When interacting with Git, running `git push`, creating a new commit (`git commit`), or launching a fresh type-checking process:
>
> 1. **MANDATORY 100% TERMINATE PREVIOUS IN-FLIGHT TYPECHECK PROCESSES**:
>    - If a TypeScript typecheck process (`fast-typecheck.mjs` / `tsc` / `type-check:fast`) is currently executing in the background:
>      - **Immediately send termination signal (`SIGTERM` / `SIGKILL`)** to terminate the entire stale process tree.
>      - **STRICTLY PROHIBITED** to allow stale typecheck processes to continue running concurrently, wasting CPU/RAM and generating outdated diagnostics that do not match the latest code.
> 2. **AUTOMATIC CANCELLATION IN PRE-COMMIT HOOK (`.husky/pre-commit`)**:
>    - Whenever `git commit` is triggered, the pre-commit hook immediately invokes `node scripts/cancel-typecheck.mjs --trigger=commit --silent` to clean up background typecheck processes with near-zero latency (< 25ms).
> 3. **AUTOMATIC CANCELLATION IN PRE-PUSH HOOK (`.husky/pre-push`)**:
>    - Whenever `git push` is executed, line 1 of `.husky/pre-push` invokes `node scripts/cancel-typecheck.mjs --trigger=push` before evaluating working tree cleanliness.
> 4. **AUTOMATIC CANCELLATION BEFORE STARTING FRESH TYPECHECK SESSIONS**:
>    - `scripts/fast-typecheck.mjs` always terminates any previous session (recorded in `.Cache/fast-typecheck.pid`) before logging its own PID and starting analysis.

---

## 1. Core Purpose & Architectural Importance

1. **Resource Conservation & Zero CPU Waste**:
   - The TypeScript compiler consumes heavy CPU cycles compiling ASTs and analyzing interfaces.
   - When new commits or pushes occur, existing diagnostics become obsolete. Terminating them frees 100% CPU capacity for immediate tasks.

2. **Diagnostic Freshness & Race Condition Prevention**:
   - Prevents race conditions where two concurrent typecheck processes attempt to write `.Cache/fast-typecheck-cache.json` simultaneously.

3. **Transparent Automation in Git Lifecycle**:
   - Operated seamlessly via `scripts/cancel-typecheck.mjs`, `.husky/pre-commit`, `.husky/pre-push`, and `LcCancelTypecheckOnPushCommitEngine` (`Lowcode/engines/lc-cancel-typecheck-on-push-commit-engine.ts`), specified under Section 582.

---

## 2. Cancellation Trigger Matrix

| Trigger Event               | Execution Location                   | Cancellation Action                                 | Impact on Flow                                     |
| --------------------------- | ------------------------------------ | --------------------------------------------------- | -------------------------------------------------- |
| `git commit`                | `.husky/pre-commit`                  | Terminates all stale background typecheck processes | Commit proceeds smoothly (< 25ms)                  |
| `git push`                  | `.husky/pre-push` (line 1)           | Terminates all stale typecheck processes            | Evaluates clean working tree then runs fresh check |
| `npm run type-check`        | `scripts/fast-typecheck.mjs` (start) | Terminates previous typecheck process               | Starts fresh, conflict-free analysis session       |
| `npm run type-check:cancel` | Manual CLI invocation                | Scans PID lockfile & process list to terminate      | Releases system resources on demand                |

---

## 3. Strict Prohibitions ❌

1. ❌ Never allow more than one `fast-typecheck.mjs` or `tsc` process running concurrently in the same repository.
2. ❌ Never remove `node scripts/cancel-typecheck.mjs` calls from `.husky/pre-commit` or `.husky/pre-push`.
3. ❌ Never leave orphaned PID lockfiles in `.Cache/fast-typecheck.pid` after processes finish or error.
