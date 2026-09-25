# Mandatory Rule: Toolbar Design — Zero Border and White Background in Default Theme (Rule 71)

<!-- Compatibility / Test Alias: RULE 71 / TOOLBAR ZERO BORDER WHITE BACKGROUND DEFAULT THEME RULE — ZERO TOLERANCE -->

> **ZERO TOLERANCE**:
> Across all applications, editors, and packages in the 2-TEK workspace (`Packages/Word`, `Packages/Excel`, `Packages/Presentation`, `Packages/Pdf`, `Packages/Notes`, `Packages/Forms`, `Packages/Studio`, `Packages/CanvasStudio`, `Packages/AIAssistant`, `Packages/Settings`, `Packages/Shared`, `Packages/SuperChat`, `Packages/Tasks`, `Packages/Hub`, `Packages/SystemCenter`, `Packages/CompanyWeb`, `Packages/Antivirus`, `Packages/OfficePack`, etc.):
> 1. **MANDATORY ZERO BORDER IN TOOLBAR (QUY TẮC BẮT BUỘC: KHÔNG DÙNG BORDER TRONG TOOLBAR)**:
>    - All toolbars, ribbons, control strips, action bars, tab strips, and formatting panels **MUST NOT USE BORDERS** (`border: none;`, `border-top: none;`, `border-bottom: none;`, `border-left: none;`, `border-right: none;`).
>    - **STRICTLY PROHIBITED**: Rendering visible outline borders, container borders, or bottom border dividers around toolbar wrappers or tab strips that delineate the toolbar from adjacent areas.
>    - Subtle inner vertical dividers between functional button groups (`<div className="office-toolbar-divider" />` or `w-px h-4 theme-border`) are permitted solely for partitioning button clusters cleanly, but outer borders on the toolbar container itself are 100% prohibited.
> 2. **MANDATORY DEFAULT BACKGROUND COLOR IS WHITE IN DEFAULT THEME (QUY TẮC BẮT BUỘC: MÀU NỀN MẶC ĐỊNH LÀ MÀU TRẮNG TRONG DEFAULT THEME)**:
>    - In the default theme (Light theme / Default IDE Theme), toolbar background color **MUST BE PURE WHITE** (`#ffffff` / `var(--surface, #ffffff)` / `background-color: #ffffff;`).
>    - **STRICTLY PROHIBITED**: Using gray, off-white, dark, or tinted surface backgrounds (e.g. `#f8fafc`, `#f1f5f9`, `#e2e8f0`, `#1e293b`) for toolbars in the default theme.
>    - In non-default themes (Dark, Midnight, Sepia), toolbars adapt seamlessly to their respective theme surface (`var(--surface)`), while in the default theme they remain crisp, clean pure white `#ffffff`.
> 3. **TAB STRIPS & RIBBON CONTAINERS ALIGNMENT**:
>    - Tab strips (`doc-toolbar-tabs-strip`, `spreadsheet-toolbar-tabs-strip`, `presentation-toolbar-tabs-strip`, etc.) and ribbon wrappers (`office-doc-toolbar-wrapper`, `word-ribbon-bar`, `office-presentation-ribbon-toolbar`, etc.) must have zero border and white background in the default theme.
> 4. **MANDATORY GOVERNANCE IN ALL PACKAGES `.standards/designs.md`**:
>    - Every package under `Packages/` must declare and enforce this toolbar design standard in `Packages/{name}/.standards/designs.md`.
>    - Developers and AI coding agents must strictly comply with this standard when creating, styling, or updating any toolbar component.

---

## 1. Core Purpose & Architectural Importance

1. **Clean, Modern, Seamless Ribbon Aesthetics**:
   - Modern productivity and design platforms (Microsoft 365, Google Workspace, Apple iWork, Canva, Figma) eliminate heavy structural borders around toolbars.
   - Removing borders and unifying the toolbar background with pure white creates a spacious, uncluttered, and elegant visual hierarchy where icons and tools float naturally.

2. **Visual Consistency Across All Packages**:
   - Whether editing a document in Word, managing sheets in Excel, arranging slides in Presentation, inspecting notes in Notes, or building UI in Canvas Studio:
   - Toolbars present a consistent, unified visual identity without border clutter.

3. **High-Contrast Readability & Theme Harmony**:
   - White background in the default theme maximizes contrast for `<IdeIcon>` vector icons and typography.
   - Dynamic CSS variable `var(--surface, #ffffff)` guarantees automated transition into Dark, Midnight, and Sepia themes without breaking visual rhythm.

---

## 2. Comparison Matrix

| Prohibited Toolbar Styling ❌ | Mandatory Toolbar Styling ✅ |
|---|---|
| `border-bottom: 1px solid var(--border);` | `border: none;` / `border-bottom: none;` |
| `border: 1px solid #e2e8f0;` | `border: none;` |
| `background-color: #f8fafc;` (in light theme) | `background-color: #ffffff;` / `var(--surface, #ffffff);` |
| `background-color: var(--surface-muted);` | `background-color: var(--surface, #ffffff);` |
| Heavy gray/bordered ribbon wrapper | Borderless pure white ribbon wrapper |

---

## 3. Strict Prohibitions ❌ (Zero Tolerance)

1. ❌ **FORBIDDEN** to add `border`, `border-top`, `border-bottom`, `border-left`, or `border-right` to any toolbar, ribbon container, or toolbar tab strip.
2. ❌ **FORBIDDEN** to use non-white backgrounds (e.g. `#f8fafc`, `#f1f5f9`, `#e2e8f0`, `#edf2f7`) for toolbars in the default theme.
3. ❌ **FORBIDDEN** to introduce inline styles (`style={{ ... }}`) on toolbars to override theme classes (Rule 18 & Rule 20).
4. ❌ **FORBIDDEN** to omit the toolbar design rule from any package's `Packages/{name}/.standards/designs.md`.
