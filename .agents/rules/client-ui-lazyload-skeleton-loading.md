# Mandatory Rule: Client UI Always Use Lazyload & Skeleton Loading (Client UI Lazyload & Skeleton Loading Rule — Zero Tolerance — Rule 51)

<!-- Compatibility: QUY TẮC BẮT BUỘC: TOÀN BỘ CLIENT UI PHẢI LUÔN SỬ DỤNG LAZYLOAD VÀ SKELETON LOADING (CLIENT UI LAZYLOAD & SKELETON LOADING RULE — ZERO TOLERANCE) -->
<!-- Legacy Title / Test Alias: Rule 51. **[MANDATORY CLIENT UI RULE: ALWAYS USE LAZYLOAD & SKELETON LOADING]** -->

> **ZERO TOLERANCE**:
> Across all Frontend (FE) projects and Client UI in the 2-TEK workspace (`Packages/Office`, `Packages/LowcodeStudio`, `Packages/Bots`, `Packages/CompanyWeb`, `Packages/SuperChat`, `Packages/SystemAdmin`, `Packages/Cloud`, `Packages/DeviceFarms`, `Packages/Hub`, etc.):
> 1. **MANDATORY 100% LAZY LOADING FOR CLIENT UI ROUTES & NON-CRITICAL MODULES**:
>    - All secondary views, feature tabs, heavy panels, modal dialogs, drawers, charting modules, code editors, and below-the-fold components MUST be loaded asynchronously via **Lazy Loading** (`React.lazy`, Next.js `dynamic(() => import(...))`, or Intersection Observer).
>    - Prohibited to bundle heavy client-only UI into synchronous entry points, preventing monolithic JavaScript bundles and excessive First Contentful Paint (FCP) latency.
> 2. **MANDATORY 100% SKELETON LOADING FOR ALL ASYNC & LAZY-LOADED STATES**:
>    - Every lazy-loaded component, asynchronous data fetch, and view transition MUST render a **Skeleton Loading placeholder** (`<Skeleton>`, `<BaseSkeleton>`, `<LazyBoundary>`, or project-specific skeleton presets).
>    - Prohibited to show blank white flashes, empty transparent containers, or unstyled bare spinners that cause layout shifts (Cumulative Layout Shift — CLS) during loading.
> 3. **MANDATORY CONTEXT-PRESERVING SKELETON PRESETS**:
>    - Skeletons must reflect the target layout structure (`card`, `table`, `page`, `avatar`, `text`, `list`) with smooth theme-aware shimmer animations (`.vtek-skeleton-shimmer`).
>    - Skeletons must inherit system theme tokens (`var(--surface-muted)`, `var(--border)`) without hardcoded colors (Rule 18 & Rule 20).
> 4. **MANDATORY EXPOSURE IN SHARED BASE PRIMITIVES (RULE 50 ALIGNMENT)**:
>    - Every project's base components directory (`Packages/Shared/components/{projectName}/bases`) MUST define and export `Skeleton`, `BaseSkeleton`, `LazyBoundary`, and contextual skeleton presets.

---

## 1. Core Purpose & Architectural Rationale

1. **Elimination of Cumulative Layout Shift (CLS = 0)**:
   - Rendering content abruptly after network or bundle fetching moves adjacent layout elements, degrading user experience and Lighthouse Core Web Vitals scores.
   - Structured skeleton placeholders reserve the precise geometric footprint of the incoming UI, ensuring zero layout jump.

2. **Elimination of Blank Flashes & Perceived Speed Optimization**:
   - Modern enterprise web applications (`Office`, `LowcodeStudio`, `SuperChat`) feature complex views. Loading them with a blank screen conveys sluggishness.
   - Theme-adaptive shimmer skeletons provide immediate, high-fidelity visual feedback, drastically enhancing perceived speed and responsiveness.

3. **Bundle Splitting & Efficient Memory Utilization**:
   - Forcing lazy loading on heavy subcomponents (code editors, terminal emulators, rich tables, settings dialogs) ensures that users only download code when actually invoking the feature.

---

## 2. Standard Implementation Patterns

### 2.1. Next.js Dynamic Import with Skeleton Loading

```tsx
import dynamic from 'next/dynamic';
import { CardSkeleton, LazyBoundary } from '@/components/bases';

// 1. Dynamic import with dedicated Skeleton loading placeholder
const CodeEditorPanel = dynamic(
  () => import('./code-editor-panel').then((mod) => mod.CodeEditorPanel),
  {
    ssr: false,
    loading: () => <CardSkeleton id="editor-panel-skeleton" rows={12} />,
  }
);
```

### 2.2. React.lazy with `<LazyBoundary>` (or Suspense)

```tsx
import React, { Suspense } from 'react';
import { LazyBoundary, TableSkeleton } from '@/components/bases';

const AuditLogTable = React.lazy(() => import('./audit-log-table'));

export function AuditView() {
  return (
    <LazyBoundary
      id="audit-log-boundary"
      fallback={<TableSkeleton id="audit-table-skeleton" columns={5} rows={8} />}
    >
      <AuditLogTable />
    </LazyBoundary>
  );
}
```

### 2.3. Contextual Skeleton Presets

| Skeleton Preset | Recommended Target View | Footprint Characteristics |
|---|---|---|
| `<CardSkeleton>` | Cards, summary widgets, dashboards | Header line + thumbnail/body block |
| `<TableSkeleton>` | Data tables, grids, audit logs | Column header cells + row striping |
| `<PageSkeleton>` | Full page routing, tab transitions | Navbar placeholder + title + 2-col body |
| `<TextSkeleton>` | Paragraphs, titles, descriptions | Multi-line rounded rectangles with varying widths |
| `<AvatarSkeleton>` | Profiles, user chips, contact list | Circular placeholder (e.g. 32px, 40px, 48px) |

---

## 3. Strict Prohibitions ❌ (Zero Tolerance)

1. ❌ **FORBIDDEN** to load heavy secondary UI modules synchronously into main client layouts.
2. ❌ **FORBIDDEN** to use blank `<Suspense fallback={null}>` or `<Suspense fallback={<div />}>` for user-visible UI.
3. ❌ **FORBIDDEN** to replace entire page or complex card structures with solitary small spinners where layout context is lost.
4. ❌ **FORBIDDEN** to use hardcoded hex colors in skeleton components (must use CSS classes and CSS variables `var(--surface-muted)`, `var(--border)`).
5. ❌ **FORBIDDEN** for any frontend project to lack `Skeleton` and `LazyBoundary` in its isolated base components (`@Shared/components/{projectName}/bases`).
