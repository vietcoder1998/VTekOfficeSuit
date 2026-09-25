# Mandatory Rule: Only Display Icons in Toolbar for All of Apps (Rule 65)

<!-- Compatibility / Test Alias: TOOLBAR ONLY DISPLAY ICONS RULE — ZERO TOLERANCE -->

> **ZERO TOLERANCE**:
> Across all applications and packages in the 2-TEK workspace (`Packages/Bots`, `Packages/Office`, `Packages/LowcodeStudio`, `Packages/Lowcode`, `Packages/CompanyWeb`, `Packages/SystemAdmin`, `Packages/SuperChat`, `Packages/Cloud`, `Packages/Tasks`, `Packages/DeviceFarms`, `Packages/Hub`, `Packages/Settings`, etc.):
> 1. **MANDATORY 100% ICON-ONLY TOOLBAR BUTTONS**:
>    - All action buttons, toggle buttons, and mode switches rendered inside toolbars, ribbons, and control bars **MUST ONLY DISPLAY ICONS** (using Base `<IdeIcon>` from `@/components/bases` or `@Shared/components/{projectName}/bases`, or standard Lucide vector SVG icons).
>    - **STRICTLY PROHIBITED**: Rendering visible text labels or non-`sr-only` text spans inside toolbar action buttons.
> 2. **ACCESSIBILITY & TOOLTIPS (TITLE & ARIA-LABEL MANDATE)**:
>    - Every toolbar button must provide human-readable context via:
>      - `title`: Native browser tooltip on hover (e.g. `title="Lưu (Ctrl+S)"` or localized `title={t("save", "Lưu")}`).
>      - `aria-label`: Explicit accessibility label for assistive technologies and screen readers (e.g. `aria-label="Save"`).
>      - `<span className="sr-only">`: Screen-reader-only element for semantic document outlining when helpful.
> 3. **STANDARDIZED ICON SIZING & SPACING**:
>    - Toolbar buttons must use standard preset sizes (typically `size="xs"` or `size="iconXs"` with icon size `12px` - `14px`).
>    - Group separators (`<div className="office-toolbar-divider" />` or `w-px h-4 theme-border`) should partition functional clusters cleanly.
> 4. **ELIMINATION OF TOOLBAR CLUTTER & WRAPPING**:
>    - Stripping textual labels maximizes horizontal density, eliminates awkward line wrapping across laptop screens, and maintains consistent visual rhythm across languages (English, Vietnamese, Japanese).
> 5. **GOVERNANCE & AUDIT**:
>    - Governed by `.agents/rules/toolbar-only-display-icons.md` and registered in workspace standards (`Packages/Shared/standards/types.ts`).

---

## 1. Core Purpose & Architectural Importance

1. **High Visual Density & Clean Workspace**:
   - Modern creative and productivity suites (Microsoft 365 Ribbon, Figma, VSCode, Canva, Google Docs) use compact icon buttons for toolbar actions to minimize vertical and horizontal space consumption.
   - Text labels clutter toolbar rows, causing overflow, forced horizontal scrolling, and multi-line breaks.

2. **Internationalization & Multi-lingual Consistency**:
   - Word length varies significantly across languages (e.g., "Merge & Center" vs "Trộn và Căn Giữa"). Icon-only buttons maintain uniform button geometry regardless of active locale.

3. **Accessibility Without Compromise**:
   - Utilizing `title`, `aria-label`, and `.sr-only` guarantees full WCAG compliance and optimal screen reader navigation without visual clutter.

---

## 2. Comparison Matrix

| Prohibited Toolbar Button ❌ | Mandatory Icon-Only Toolbar Button ✅ |
|---|---|
| `<Button><IdeIcon name="Save" /><span>Lưu</span></Button>` | `<Button title="Lưu (Ctrl+S)" aria-label="Lưu"><IdeIcon name="Save" /><span className="sr-only">Lưu</span></Button>` |
| `<Button><IdeIcon name="Trash" /> Delete</Button>` | `<Button title="Delete" aria-label="Delete"><IdeIcon name="Trash" /><span className="sr-only">Delete</span></Button>` |
| `<Button><IdeIcon name="FileText" /> Docs</Button>` | `<Button title="Văn bản (Docs)" aria-label="Docs"><IdeIcon name="FileText" /><span className="sr-only">Docs</span></Button>` |
| `<Button><span>Trang Word</span></Button>` | `<Button title="Trang Word" aria-label="Trang Word"><IdeIcon name="FileText" /><span className="sr-only">Trang Word</span></Button>` |

---

## 3. Strict Prohibitions ❌

1. ❌ **FORBIDDEN** to render visible text spans or plain string labels inside toolbar action buttons.
2. ❌ **FORBIDDEN** to omit `title` or `aria-label` attributes on icon-only toolbar buttons.
3. ❌ **FORBIDDEN** to use raw emojis or text symbols instead of `<IdeIcon>` or SVG icons.
