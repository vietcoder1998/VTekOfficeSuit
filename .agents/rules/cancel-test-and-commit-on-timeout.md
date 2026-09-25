# Mandatory Rule: Cancel Test and Allow Commit on Test Loop Timeout (Section 779 / Timeout Guard)

> **ZERO TOLERANCE**:
> During automated test execution in the pre-commit hook (`.husky/pre-commit`):
> 1. **TIMEOUT GUARD (> 25 SECONDS)**:
>    - If the test runner (`scripts/fast-test.mjs`) exceeds 25 seconds due to an infinite loop, thread hang, or stalled subprocess:
>    - The system MUST immediately terminate the test process group (`SIGTERM` / `SIGKILL`).
> 2. **ALLOW COMMIT ON TIMEOUT**:
>    - Under `--commit-on-timeout` mode, the runner exits with code 0, allowing the git commit to proceed unhindered.
>    - Prevents developers and headless AI agents from being permanently trapped in stalled commit hooks.
