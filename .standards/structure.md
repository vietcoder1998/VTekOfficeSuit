# VTek Office Suite Architecture & Directory Structure Standard (Rule 68)

## 1. Directory Structure Standards

- `app/`: Next.js App Router root layout and page views.
- `components/`: Modular UI views, suite navigator, status indicators.
- `components/bases/`: Project-isolated Base components (Rule 61).
- `electron/`: Electron main (`main.cjs`), preload (`preload.cjs`), and runner (`runner.cjs`).
- `scripts/`: Packaging scripts for `.deb` and `.exe` targeting `downloads/`.
- `styles/`: IDE theme tokens and layouts.
- `types/`: Electron window API definitions.

## 2. Alias Standards (Rule 58)

- Use `@/*` for internal package imports.
- Use `@/components/bases` for Base components.
- Zero relative climbing imports (`../../..`).
