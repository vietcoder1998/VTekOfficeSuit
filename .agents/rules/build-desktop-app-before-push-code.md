# Mandatory Rule: Build Desktop App Before Push Code (Build Desktop App Before Push Rule — Zero Tolerance)

> **ZERO TOLERANCE**:
> When pushing code (`git push`) across any 2-TEK project or repository in the workspace:
> 1. **MANDATORY 100% BUILD DESKTOP APPLICATION BEFORE PUSH**:
>    - The Git pre-push hook (`scripts/git-hooks/pre-push.sh`) must automatically invoke the desktop package builder (`scripts/build-desktop.mjs`) to compile and assemble 2-TEK Hub Desktop distribution binaries (`.deb` and `.exe`) before the push completes.
>    - If building the desktop application fails, `git push` must abort immediately with exit code 1 to prevent pushing code with broken desktop packaging.
> 2. **ISOLATED BUILD ARTIFACTS IN GITIGNORE**:
>    - All generated desktop packaging outputs (`dist-electron/`, `*.deb`, `*.exe`) must remain strictly ignored by Git (`.gitignore`) so that building the desktop app never dirties the working tree.
> 3. **EMERGENCY BYPASS FLAGS**:
>    - Support `SKIP_BUILD_DESKTOP=1` or `FAST_PUSH=1` (`SKIP_BUILD_DESKTOP=1 git push`) for emergency pushes where desktop packaging is explicitly bypassed.

---

## 1. Core Purpose & Architectural Importance

1. **Continuous Desktop Distribution Integrity**:
   - 2-TEK Hub Desktop serves as the desktop manager and application hub for the entire workspace.
   - Building the desktop installer packages prior to pushing code guarantees that packaging regressions or broken runtime dependencies are detected and halted immediately.

2. **Automated Hook Integration**:
   - Integrated into the centralized pre-push hook `scripts/git-hooks/pre-push.sh` and workspace scripts:
     - `node scripts/build-desktop.mjs`
     - `npm run build:desktop`
     - `npm run build:desktop:deb`
     - `npm run build:desktop:exe`

---

## 2. Execution Flow Before Git Push

```
[Developer / AI Agent executes git push]
                    │
                    ▼
[Central Pre-Push Hook: scripts/git-hooks/pre-push.sh]
                    │
   Step 1: Check working directory dirty state (Rule 28)
                    │
   Step 2: Build desktop application packages (scripts/build-desktop.mjs)
           ├── .deb  Debian/Ubuntu Linux installer (amd64)
           └── .exe  Windows GUI executable (PE32+ x86-64)
                    │
           Did desktop build succeed?
           ├── NO  ➔ Abort git push with Exit Code 1
           └── YES ➔ Proceed to push code to remote
```

---

## 3. Strict Prohibitions ❌

1. ❌ **FORBIDDEN** to push code when desktop application build fails.
2. ❌ **FORBIDDEN** to track or commit binary packaging outputs (`dist-electron/`) into version control.
3. ❌ **FORBIDDEN** to remove the desktop build invocation from `scripts/git-hooks/pre-push.sh`.
