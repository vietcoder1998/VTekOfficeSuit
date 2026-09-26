# Rule 45: Keep Last Build and Cancel Concurrent Processing Builds | Quy Tắc Bắt Buộc: Nếu Có Nhiều Build Cùng Lúc, Giữ Lại Lần Build Cuối Cùng Và Hủy Các Tiến Trình Đang Chạy Khác

> **NGHIÊM CẤM VI PHẠM (ZERO TOLERANCE)**:
> When triggering or executing build processes across all projects (`bot`, `LowcodeStudio`, `Office`, `SuperChat`, `server`, `web`):
> **MANDATORY 100%: IF MULTIPLE BUILD REQUESTS OCCUR SIMULTANEOUSLY, THE SYSTEM MUST KEEP THE LATEST BUILD AND CANCEL ALL OTHER IN-FLIGHT RUNNING BUILDS (CANCEL ANOTHER PROCESSING BUILDS)**.
> **STRICTLY PROHIBITED 100%**: Allowing multiple concurrent Docker builds, compose builds, or builder runners to run simultaneously, competing for CPU, Disk I/O, network ports, or allowing an older build to finish late and overwrite a newer release image.

---

## 1. Core Purpose & Architectural Importance

1. **Guaranteed Code Freshness**:
   - The latest build request represents the freshest code and commit state.
   - Older concurrent builds finishing late risk regressing release versions by tagging stale code as `latest` or `release`.

2. **Resource Contention Prevention**:
   - Docker builds heavily utilize CPU, RAM, and disk bandwidth.
   - Running multiple builds concurrently saturates the Docker daemon and risks crashing live service containers.

---

## 2. Concurrency Handling Matrix

| Trigger Context | Prohibited Action ❌ | Mandatory Correct Action ✅ |
|---|---|---|
| **New build while build is running** | Reject new build or run both in parallel | Immediately terminate older build (`SIGTERM`), update database status to `canceled`, and start latest build |
| **Multiple rapid git pushes** | Spawning parallel runner processes | New runner detects prior runner PID lock, terminates older runner, and executes latest build |
| **Web UI Build Trigger** | Locking trigger button when build is active | Allow user to click trigger to supersede and cancel in-flight build |
| **Database Build Records** | Leaving stale records as `running` forever | Update stale record to `status: 'canceled'` with reason: `Canceled: superseded by newer build request` |

---

## 3. System Implementation Architecture

### 3.1. Backend Service (`src/services/buildService.ts`)
- Inside `startBuild(service, options)`:
  - Scans `runningBuildsById` for active build processes.
  - Sends `stopProcessGroup(child)` to terminate prior processes.
  - Updates database: `status: 'canceled'`, `error: 'Canceled: superseded by newer build request (keep last time and cancel another processing).'`.
  - Rolls back incomplete Docker tags via `rollbackDockerImage`.
  - Launches new build and returns `{ started: true, build, canceledBuilds }`.

### 3.2. CLI Runner (`scripts/post-push-docker.mjs`)
- Manages PID lockfile at `data/logs/docker-build-runner.json`.
- Uses `checkAndCancelPreviousBuildRunner()` to inspect active PIDs (`process.kill(prevPid, 0)`).
- Sends `SIGTERM` to prior process group, logs warning, and proceeds with latest build.

### 3.3. Web UI (`app/components/tabs/builds-tab.tsx`)
- Quick Build Trigger is not blocked by `activeBuild`, allowing users to supersede stuck builds immediately.
