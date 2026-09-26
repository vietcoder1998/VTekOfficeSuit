# Mandatory Rule: Path & Directory Configuration via .env Only — Zero Hardcoded Paths (Rule 72)

<!-- Compatibility / Test Alias: RULE 72 / PATHS AND DIRS DEFINED IN ENV ONLY RULE — ZERO TOLERANCE -->

> **ZERO TOLERANCE**:
> Across all packages, applications, services, scripts, and utilities in the 2-TEK workspace (`Packages/Hub`, `Packages/Studio`, `Packages/SuperChat`, `Packages/OfficePack`, `Packages/Shared`, `Packages/Word`, `Packages/Excel`, `Packages/Presentation`, `Packages/Pdf`, `Packages/Notes`, `Packages/Forms`, `Packages/CanvasStudio`, `Packages/AIAssistant`, `Packages/Tasks`, `Packages/Antivirus`, `scripts/`, etc.):
>
> 1. **MANDATORY 100%: ALL PATHS AND DIRECTORIES DEFINED IN .ENV ONLY (QUY TẮC BẮT BUỘC: TOÀN BỘ PATH VÀ DIR PHẢI ĐỊNH NGHĨA TRONG .ENV)**:
>    - All filesystem paths, storage roots, build output destinations, distribution paths, application directories, database locations, seed data paths, socket paths, and remote script targets **MUST BE DEFINED IN `.env` AND DOCUMENTED IN `.env.example`**.
>    - In source code, scripts, runners, and background services, all paths must be resolved dynamically from environment variables (`process.env.VARIABLE_NAME`) or parsed from `.env` files.
>    - **STRICTLY PROHIBITED**: Hardcoding directory paths or filesystem locations directly in application source code, scripts, or engines.
> 2. **STRICTLY PROHIBITED 100%: HARDCODED USER / MACHINE PATHS (TUYỆT ĐỐI CẤM HARDCODE ĐƯỜNG DẪN USER HOẶC MÁY CỤ THỂ)**:
>    - **ZERO TOLERANCE** for hardcoded personal home directories (e.g. `/home/viettd`, `/home/tranduyviet`, `/home/user`, `/Users/...`, `C:\Users\...`).
>    - User home directories must always be resolved dynamically via standard OS utilities (`os.homedir()` / `process.env.HOME`) or expanded from tilde syntax (`~`) at runtime.
> 3. **STANDARDIZED CANONICAL ENVIRONMENT VARIABLE MATRIX**:
>    All workspace packages and scripts must standardize on the following canonical path variables:
>    - **Storage & Files**:
>      - `FILES_STORAGE_PATH` / `FILES_PATH`: Canonical storage directory for files (`~/.2tek/Files`).
>      - `APPS_STORAGE_PATH` / `APPS_PATH`: Storage directory for deployed web applications (`~/.2tek/Apps`).
>      - `CLOUD_STORAGE_PATH`: Cloud synchronization directory (`~/.2tek/Files/cloud`).
>      - `COMPUTER_STORAGE_PATH`: Local computer / office document storage (`~/.2tek/Files/office`).
>      - `APPLICATIONS_PATH` / `CLOUD_APPLICATIONS_PATH`: Cloud application manifests (`./Clouds/Applications`).
>    - **Build & Artifact Outputs**:
>      - `APP_BUILD_PATHS`: Destination directory for standalone application builds (`~/.2tek/Apps`).
>      - `APP_ZIP_PATHS`: Destination directory for packaged zip releases (`~/.2tek/Zips`).
>      - `APP_HUB_PATH`: Distribution directory for Hub desktop binaries (`~/.2tek/Hubs`).
>      - `BUILD_DIR`: Local repository build directory (`./build`).
>      - `BUILDS_HUB_DIR`: Hub release artifacts directory (`./builds/hub`).
>    - **Workspace & Examples**:
>      - `WORKSPACE_ROOT`: Root directory of the 2-TEK workspace.
>      - `EXAMPLE_PROJECTS_PATH`: Directory containing canonical example projects (`./.example/Projects`).
>      - `USERS_DATA_PATH`: Canonical seed users data file (`./Packages/OfficePack/data/seeds/users/users.data.json`).
>    - **Remote Deployment & Automation**:
>      - `REMOTE_WORKSPACE_PATH`: Target directory on production / remote servers (`~/2-tek`).
>      - `REMOTE_REBUILD_SCRIPT_PATH`: Path to remote rebuild runner script (`~/2-tek/scripts/bot-rebuild-on-push.sh`).
> 4. **SAFE RESOLUTION & DYNAMIC FALLBACK STANDARD**:
>    - When environment variables are unset, fallback logic must use dynamic system resolution:
>      - Use `os.homedir()` or `process.env.HOME` for home directories (never a hardcoded username).
>      - Use `process.cwd()` or `path.resolve(__dirname, '..')` for relative workspace resolution.
>      - Support expanding tilde prefix `~` into the user's authentic home directory.

---

## 1. Core Purpose & Architectural Importance

1. **Portability Across Environments & Machines**:
   - Hardcoded paths (such as `/home/tranduyviet/...` or `/home/viettd/...`) break immediately when code is executed on CI/CD runners, Docker containers, remote production servers, or machines of other team members.
   - Sourcing all directory structures from `.env` ensures that any developer or automated agent can configure paths matching their local environment seamlessly.

2. **Single Source of Truth**:
   - By centralizing directory mappings in `.env` and `.env.example`, changing a storage location (e.g. moving `~/.2tek/Files` to a high-capacity drive `/mnt/storage/Files`) requires changing a single environment variable rather than refactoring dozens of source files.

3. **Zero Security & Privacy Leaks**:
   - Hardcoding personal user paths in Git repositories inadvertently leaks system usernames, directory structures, and private workstation configurations into version control.

---

## 2. Comparison Matrix

| Prohibited Hardcoded Path ❌                            | Mandatory Dynamic .env Resolution ✅                                                                                                 |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `path.join('/home/tranduyviet', '.lowcode', 'Hubs')`    | `process.env.APP_HUB_PATH ? resolveTilde(process.env.APP_HUB_PATH) : path.join(os.homedir(), '.lowcode', 'Hubs')`                    |
| `'/home/viettd/2-tek/scripts/bot-rebuild-on-push.sh'`   | `process.env.REMOTE_REBUILD_SCRIPT_PATH \|\| '~/2-tek/scripts/bot-rebuild-on-push.sh'`                                               |
| `'/home/tranduyviet/Projects/Workspace/Packages/Cloud'` | `process.env.CLOUD_PACKAGES_PATH ? expandTildePath(process.env.CLOUD_PACKAGES_PATH) : path.resolve(workspaceRoot, 'Packages/Cloud')` |
| `'/home/viettd/.Xauthority'`                            | `process.env.XAUTHORITY \|\| path.join(os.homedir(), '.Xauthority')`                                                                 |
| `'/home/tranduyviet/Projects/v-tek.com/Example'`        | `process.env.EXAMPLE_PROJECTS_PATH \|\| path.resolve(process.cwd(), '.example/Projects')`                                            |
| `candidatePaths: ['/home/.../users.data.json']`         | `candidatePaths: [process.env.USERS_DATA_PATH ? path.resolve(process.env.USERS_DATA_PATH) : '', ...].filter(Boolean)`                |

---

## 3. Strict Prohibitions ❌

1. ❌ **FORBIDDEN** to introduce or commit any string literal containing `/home/<user>`, `/Users/<user>`, or specific local drive paths.
2. ❌ **FORBIDDEN** to bypass `.env` when adding new storage, build, cache, or external script paths.
3. ❌ **FORBIDDEN** to update `.env` with new directory variables without synchronizing them in `.env.example`.
4. ❌ **FORBIDDEN** to use static fallback paths with hardcoded usernames when environment variables are not set.
