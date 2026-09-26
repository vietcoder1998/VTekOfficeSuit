---
trigger: always_on
---

# Mandatory Rule: Ban Inline Styles — Use IDE Theme CSS Classes Only (Rule 18 & Section 218)

> **ZERO TOLERANCE**:
> When creating or modifying any component, interface (`.tsx`), Button, Card, Label, Tabs, menu item, modal dialog, inspector subpanel, or UI block across all projects:
> **MANDATORY 100%: STRICTLY PROHIBITED to use `style={{ ... }}` (inline styles)** for defining static colors, backgrounds, borders, padding, margin, sizing, or layout structures.
> **MANDATORY 100%: MUST USE Theme CSS Classes, system CSS Variables, and Base components from `@/components/bases`**.

---

## 1. Core Purpose & Architectural Importance

1. **Flawless Multi-Theme Switching (Light, Dark, Midnight, Sepia)**:
   - Inline styles with hardcoded color codes (`#ffffff`, `#1e293b`, `#6938ef`) take highest CSS specificity, breaking dynamic theme changes.
   - Using CSS Classes and Variables (`var(--surface)`, `var(--text)`, `var(--border)`, `var(--primary, #6938ef)`) guarantees automatic, smooth adaptation across all themes.

2. **Performance Optimization & Zero Object Allocation**:
   - Inline `style={{ ... }}` allocates a new object reference in memory on every render cycle, breaking `React.memo` and causing cascading re-renders.
   - Static CSS classes allow the browser's style engine to optimize memory and leverage GPU acceleration.

3. **Single Source of Truth in Design Standards**:
   - All styles are standardized in `Lowcode/.agents/standards/UI/*` and implemented in stylesheets:
     - `styles/theme.css`: Theme classes and color tokens.
     - `styles/bases.css`: Base component styles (buttons, cards, inputs).
     - `styles/layout.css`: 8-pt grid and flex/grid layout utilities.

---

## 2. Migration Reference Guide

### 2.1. Surfaces & Colors

| Prohibited Inline Style ❌               | Standard Theme CSS Class ✅       | Standard CSS Variable ✅  | Recommended Base Component ✅         |
| ---------------------------------------- | --------------------------------- | ------------------------- | ------------------------------------- |
| `style={{ backgroundColor: "#ffffff" }}` | `className="theme-surface"`       | `var(--surface)`          | `<DivCard>`, `<DivPanel>`, `<Card>`   |
| `style={{ backgroundColor: "#f8fafc" }}` | `className="theme-surface-muted"` | `var(--surface-muted)`    | `<DivPanel id="...">`                 |
| `style={{ backgroundColor: "#6938ef" }}` | `className="bg-primary"`          | `var(--primary, #6938ef)` | `<Button variant="primary">`          |
| `style={{ color: "#0f172a" }}`           | `className="theme-text"`          | `var(--text)`             | Inherited from container              |
| `style={{ color: "#64748b" }}`           | `className="theme-text-muted"`    | `var(--text-muted)`       | `<span className="theme-text-muted">` |
| `style={{ borderColor: "#e2e8f0" }}`     | `className="theme-border"`        | `var(--border)`           | `<DivCard id="...">`                  |

### 2.2. Flex & Grid Layouts

| Prohibited Inline Style ❌                                                                 | Mandatory Base Component ✅ | Alternative CSS Class ✅  |
| ------------------------------------------------------------------------------------------ | --------------------------- | ------------------------- |
| `<div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>`            | `<DivRow id="...">`         | `className="div-row"`     |
| `<div style={{ display: "flex", flexDirection: "column" }}>`                               | `<DivCol id="...">`         | `className="div-col"`     |
| `<div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>`        | `<DivCenter id="...">`      | `className="div-center"`  |
| `<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>` | `<DivBetween id="...">`     | `className="div-between"` |
| `<div style={{ display: "grid", gridTemplateColumns: "..." }}>`                            | `<DivGrid id="...">`        | `className="div-grid"`    |

---

## 3. Strict Prohibitions ❌

1. ❌ Never write inline styles with hardcoded hex, rgb, or hsl colors.
2. ❌ Never write inline styles for layout margins, paddings, or widths.
3. ❌ Technical exception: Dynamic runtime geometric coordinates (e.g. drag x/y, canvas zoom scale) calculated in real time by the Canvas engine may use `style` for coordinates only.
