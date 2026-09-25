# VTek Office Suite Project Target Specification (Rule 69)

> **Canonical Target of App**:
> **Unified Electron Desktop Application Shell & Multi-Platform Distribution Packager for 2-TEK Office Suite**
> *(Bộ ứng dụng văn phòng máy tính để bàn hợp nhất và hệ thống đóng gói phân phối đa nền tảng cho hệ sinh thái 2-TEK Office)*.

---

## 1. High-Level Vision & Scope

1. **Unified Suite Desktop Experience**:
   - Provide a cohesive Electron desktop shell linking Word, Excel, Presentation, PDF Reader, Forms, Notes, AI Assistant, and Hub.
   - Maintain multi-window and tabbed navigation across all suite applications.
2. **Automated Packaging to Downloads**:
   - Serve as the dedicated release packager building `.deb` (Debian/Ubuntu Linux) and `.exe` (Windows 64-bit) packages.
   - Automatically output built distribution artifacts to `downloads/` (`DOWNLOADS_PATH`), with SHA-256 checksums and release metadata.
3. **Environment & Path Invariants (Rule 72)**:
   - Sourced dynamically from `process.env.DOWNLOADS_PATH` and `process.env.APP_DOWNLOADS_PATH` with fallback to `../../downloads`. Zero hardcoded user paths.

---

## 2. Invariants & Strict Anti-Goals

1. **Anti-Drift**: VTekOfficeSuit must never absorb the core document parser implementations of Word or Excel; it consumes them as suite modules.
2. **Anti-Storage**: VTekOfficeSuit is not a cloud file store; file storage operations remain strictly in `packages/Cloud`.
3. **Release Target**: Every desktop build initiated from VTekOfficeSuit MUST output binaries to `downloads/`.
