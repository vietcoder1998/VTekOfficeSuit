# Mandatory Rule: Eliminate Ad-Hoc Manual Testing During Edits — Testing is Automated on Commit (Rule 36 & Section 672)

> **ZERO TOLERANCE**:
> When updating projects, developing features, refactoring code, or fixing bugs:
> 1. **STRICTLY PROHIBITED: REPETITIVE MANUAL TEST RUNS**:
>    - Do NOT run `npm test`, `vitest run`, `node scripts/fast-test.mjs`, or `npx vitest` repeatedly between minor file edits.
>    - Repetitive manual testing disrupts development velocity and exhausts compute resources.
> 2. **TESTING IS 100% AUTOMATED ON GIT COMMIT**:
>    - Testing is handled automatically by the pre-commit hook (`.husky/pre-commit`), executing fast tests exclusively against staged changes (`--staged --fast`).
>    - If no relevant test files are touched, the runner exits in < 20ms with code 0.
> 3. **WORKFLOW**:
>    - Focus on writing clean code, verify syntax and Rule 29 EOF (`\n`), then run `git commit`. If tests fail, the hook provides targeted diagnostics to fix.
