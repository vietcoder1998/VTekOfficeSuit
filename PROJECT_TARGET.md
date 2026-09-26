# VTek Office Suite Project Target Specification (Rule 69)

> **Canonical Target of App**:
> **Dedicated repository strictly used only for saving downloads files only (`use only for save downloads files only`), no script, no handle**.
> *(Thư mục và kho lưu trữ chuyên dụng chỉ dùng để lưu trữ các tệp tải về và gói phân phối ứng dụng: .deb, .exe, .zip, SHA256SUMS.txt, release-manifest.json — tuyệt đối không chứa logic mã nguồn, không có script, không có trình xử lý)*.

---

## 1. High-Level Vision & Scope

1. **Storage of Application Download Files Only**:
   - Serve as the dedicated, standalone distribution storage repository for all cross-platform application release packages in the 2-TEK ecosystem.
   - Maintain the structured versioned tree under `downloads/{projectName}/{version}/{name}.{deb|exe|zip}` alongside `SHA256SUMS.txt` cryptographic checksums and `release-manifest.json` metadata.
2. **Zero Code Logic & Zero Scripts Policy**:
   - This repository contains **NO source code logic**, **NO build scripts**, **NO execution runners**, and **NO service handlers**.
   - Packaging and artifact compilation are handled externally by workspace build tools and Builder Bot; VTekOfficeSuit functions strictly as the persistent storage repository for the resulting download artifacts.
3. **Standalone Gitlink Decoupling (Mode 160000)**:
   - VTekOfficeSuit maintains its own independent Git repository tracking download distribution packages, avoiding Git binary bloat in the main monorepo.
4. **Environment & Path Invariants (Rule 72)**:
   - Downloads root path is resolved via `process.env.DOWNLOADS_PATH` / `process.env.APP_DOWNLOADS_PATH` with standard fallback to `packages/VTekOfficeSuit/downloads`. Zero hardcoded user paths.

---

## 2. Invariants & Strict Anti-Goals

1. **Anti-Goal 1 — Zero Code Logic**:
   - VTekOfficeSuit must NEVER contain application business logic, document parsers, UI components, or state engines.
2. **Anti-Goal 2 — No Scripts, No Handles**:
   - VTekOfficeSuit must NEVER contain executable build scripts, TypeScript/JavaScript runner files, CLI utilities, or gRPC/API handlers (`no script, no handle`). All building and handling remain in workspace runners or respective package modules.
3. **Anti-Goal 3 — Downloads Storage Only**:
   - VTekOfficeSuit is strictly and exclusively used for saving downloadable release packages and installers (`use only for save downloads files only`). It is not an Electron application, not a web server, and not a desktop runner.
4. **Anti-Goal 4 — Zero User Document Storage**:
   - VTekOfficeSuit must never store user working files or personal cloud documents; user data belongs strictly in `packages/Cloud` and `FILES_STORAGE_PATH`.
