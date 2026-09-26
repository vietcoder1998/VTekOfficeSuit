# Package Design & Visual Standards: VTek Office Suite

<!-- Standard Specification: Packages/VTekOfficeSuit/.agents/standards/designs.md -->
<!-- Rule Conformance: Rule 64 (Target Immutability) & Rule 68 (Package Standards) -->

## 1. Domain Nature & UI Scope
- **Domain Nature**: **Dedicated release distribution and downloadable files repository only (`use only for save downloads files only`)**.
- **UI Policy**: This repository contains **ZERO UI components**, **ZERO JSX/TSX elements**, **ZERO scripts**, and **ZERO execution handlers** (`no script, no handle`).
- **Visual Artifacts**: All distributed desktop installers and standalone bundles stored in `downloads/` must conform to IDE branding and icon assets managed centrally by `@Shared`.

## 2. Invariants & Zero Tolerance
1. **No Inline Styles & No UI Code**: As a repository containing no UI components or code logic, zero inline styles and zero UI templates belong in this repository.
2. **Icon & Branding Consistency**: Release manifest metadata and installer packages reflect standard 2-TEK branding.
3. **No Script / No Handle Policy**: Strictly prohibited to create frontend rendering logic, custom styling handlers, or UI controllers inside `VTekOfficeSuit`.
