---
trigger: always_on
---

# Mandatory Rule: Verify EOF Newline on File Update (Rule 29 & Section 581)

> **ZERO TOLERANCE**:
> When creating, modifying, generating, or refactoring any file (`.ts`, `.tsx`, `.json`, `.md`, `.css`, `.mjs`) across the project:
> 1. **MANDATORY 100%: VERIFY EOF INTEGRITY PRIOR TO PROCEEDING**:
>    - The updated file must be checked for End-of-File integrity first.
>    - ONLY when the EOF check passes (`valid === true`, `status === "OK"`) is the agent permitted to move to the next file.
> 2. **MANDATORY EOF STANDARDS**:
>    - Every file must end with **EXACTLY ONE NEWLINE (`\n`)**, completely eliminating Git diff warnings (`\ No newline at end of file`).
>    - No truncated syntax: all brackets `{}` `()` `[]`, template literals ``` ` ```, and JSX tags must be properly closed.
>    - Maximum 1 trailing empty line at EOF (no multiple consecutive empty lines).
> 3. **AUTO-FIX MECHANISM**:
>    - If a file lacks a trailing newline, `LcCheckEofEngine` automatically appends `\n` before proceeding.
