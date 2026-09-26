# Downloads Repository Visual & Theme Specification (Rule 68)

> **Canonical Target**:
> **Dedicated repository strictly used for displaying public projects of 2tek-office-packages, no more, not script, no package.json, just save builded file**.
> _(Kho lưu trữ chuyên dụng được sử dụng duy nhất để hiển thị các dự án công khai của 2tek-office-packages, không có thêm gì khác, không có script, không có package.json, chỉ lưu trữ các tệp đã build)_.

---

## 1. Visual & Architectural Scope

1. **Zero UI Components Policy**:
   - `downloads/` contains **NO visual UI components**, **NO React `.tsx` files**, **NO CSS stylesheets**, and **NO runtime rendering logic**.
   - As a pure distribution and binary artifact repository, it does not execute UI.
2. **Markdown Documentation Conformance**:
   - All documentation (`README.md`, `structure.md`, `PROJECT_TARGET.md`) strictly adheres to clean GitHub Markdown format.
   - Vector-crisp formatting with structured ASCII directory trees and standard badge markdown. Zero raw emojis in file names or distribution paths.
3. **Distribution Integrity & Trust**:
   - Every public project distribution artifact is accompanied by a SHA-256 cryptographic checksum (`SHA256SUMS.txt`) and release manifest (`release-manifest.json`).
