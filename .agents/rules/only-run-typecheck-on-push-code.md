# Mandatory Rule: Only Run Type-Check When Pushing Code & Cancel Push on Dirty Working Tree (Rule 28 & Section 580)

> **ZERO TOLERANCE**:
> Across all development workflows, automation scripts, AI Agents, and Git hooks:
>
> 1. **MANDATORY 100%: RUN TYPECHECK EXCLUSIVELY ON GIT PUSH**:
>    - Full TypeScript type validation (`npm run type-check`, `fast-typecheck.mjs`, `tsc --noEmit`) **IS PERMITTED SOLELY DURING `git push`** via `.husky/pre-push` hook.
>    - **STRICTLY PROHIBITED 100%**: Running type-check during any other lifecycle phase:
>      - Do NOT run in `pre-commit` hook or during `git commit`.
>      - Do NOT run during file save or live-reload watchers.
>      - Do NOT run during normal unit test execution (`vitest`).
>      - Do NOT run when merging task branches back to parent (only unit tests run during merge).
> 2. **MANDATORY 100% CANCEL PUSH ON DIRTY WORKING TREE**:
>    - If git working tree has uncommitted modifications, immediately cancel `git push` (`exit 1`) and abort typecheck.
>    - Only clean, fully committed states (**staged as commit only**) may proceed to remote push.
> 3. **PROACTIVE SKIP SUPPORT**:
>    - Supports `SKIP_TYPECHECK=1` or `CANCEL_TYPECHECK=1` environment flags to bypass typecheck on clean trees when urgent deployment is needed.

---

## 1. Single Verification Gate Principle

- **Commit Phase**: Focuses on rapid developer iteration (< 1s), formatting, Rule 29 EOF checks, and targeted unit tests on staged files.
- **Push Phase**: Serves as the single comprehensive type-safety gate. If and only if working tree is clean, pre-push executes `npm run type-check:fast` before broadcasting commits to remote.

---

## 2. Integration & Engine Governance

- Managed automatically via `.husky/pre-push`.
- Core engine: `LcCancelPushOnCodeChangesEngine` (`Lowcode/engines/lc-cancel-push-on-code-changes-engine.ts`).
- MCP Action: `enforce_only_run_typecheck_when_push_code` at Section 580.
