# Mandatory Rule: Remove Unused Migration Scripts After Re-Import or Move (Rule 35)

> **ZERO TOLERANCE**:
> When performing re-import operations, barrel reorganizations, or moving files/folders across the project:
> 1. **ZERO DANGLING MIGRATION SCRIPTS**:
>    - One-time helper scripts (`scripts/migrate-*.ts`, `scripts/reimport-*.js`, `scripts/temp-*`) created to assist file reorganization MUST be deleted immediately once the task is completed.
> 2. **PRESERVE SYSTEM RUNNERS**:
>    - Never delete permanent project runners registered in `package.json` (`fast-build.mjs`, `fast-test.mjs`, `fast-typecheck.mjs`, `cancel-typecheck.mjs`, `validate-projects.ts`).
