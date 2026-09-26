# Mandatory Rule: Verify Build Success & Auto-Fix Bugs (Rule 40)

> **ZERO TOLERANCE**:
> When completing any feature, bug fix, refactor, config update, Dockerfile edit, dependency upgrade, or code modification across all projects (`bot`, `LowcodeStudio`, `Office`, `SuperChat`, `server`, `web`):
> 1. **MANDATORY 100%: VERIFY BUILD SUCCESS (ZERO BROKEN BUILDS)**:
>    - Every build process (`npm run build`, Next.js compilation, TypeScript compilation, Docker image build, `docker compose build`, or post-push builder runner) **MUST** be verified to finish with complete success:
>      - **Exit Code 0**
>      - **Zero Fatal Errors**
>      - **Containers running in `healthy` state**.
>    - **STRICTLY PROHIBITED 100%**: Declaring tasks complete, closing tasks, committing/merging code, or leaving the workspace while builds are failing or containers are in crash loops.
> 2. **MANDATORY 100%: AUTO FIND & FIX BUGS UPON BUILD FAILURE**:
>    - When any build failure occurs (Exit Code ≠ 0 or errors in stderr/stdout/logs):
>      - **Step 1 — Collect & Analyze Logs**: Inspect `data/logs/docker-build.log`, terminal output, or stack traces to pinpoint the exact failure location (file, line number, missing module, or incorrect Docker instruction).
>      - **Step 2 — Root Cause Analysis**: Identify the fundamental defect (TypeScript compilation error, missing dependency, broken import path, outdated Docker instruction).
>      - **Step 3 — Fix Bug at Source**: Directly fix the root issue in source code or configuration. **STRICTLY PROHIBITED** to suppress errors using `@ts-ignore`, loose `any` casts, or `--force` flags.
>      - **Step 4 — Re-Verify Loop**: Re-run the build pipeline to demonstrate 100% Exit Code 0 success before finalizing the task.

---

## 1. 4-Step Build & Fix Workflow

```
[STEP 1: EXECUTE & MONITOR BUILD]
   Run build command (Docker / Next.js / TypeScript / npm run build)
                 │
                 ▼
          Build Successful? (Exit 0)
          ├── YES ──► [COMPLETE: Ready for commit / push / release]
          └── NO (Exit ≠ 0)
                 │
                 ▼
[STEP 2: LOG ANALYSIS & ERROR PINPOINTING]
   Extract stderr, compiler diagnostics, file & line numbers
                 │
                 ▼
[STEP 3: ROOT CAUSE FIX AT SOURCE]
   Fix source files, imports, interfaces, Dockerfile, or dependencies
   (PROHIBITED: @ts-ignore, bypassing checks, or --force)
                 │
                 ▼
[STEP 4: RE-VERIFY PIPELINE]
   Re-run Step 1 to confirm flawless Exit Code 0
```
