# Mandatory Rule: Office Toolbars Design — Multi-Group Toolbars Displayed as Tabs (Rule 60)

<!-- Compatibility / Test Alias: Rule 55 / OFFICE TOOLBARS DESIGN — MULTI-GROUP TOOLBARS DISPLAYED AS TABS -->

> **ZERO TOLERANCE** (Rule 60 / Rule 55 Compatibility Alias):
> Across the entire Office Suite (Word/Document, Excel/Spreadsheet, PowerPoint/Presentation, Combo):
> 1. **MANDATORY TABBED RIBBON ARCHITECTURE (BẮT BUỘC KIẾN TRÚC THANH CÔNG CỤ NHIỀU NHÓM HIỂN THỊ DẠNG TAB)**:
>    - All toolbars in Office editors MUST NOT be designed or rendered as a single monolithic flat bar or cluttered unorganized strip.
>    - Toolbars MUST be structured into **Multiple Functional Groups displayed as Tabs** (Ribbon Tabbed Toolbar Architecture) allowing users to switch between cohesive tool groups seamlessly.
> 2. **STANDARDIZED TAB GROUPS PER MODULE**:
>    - **Document (Word/Docs)**: Minimum 4 required tabs:
>      1. `home` (Trang Đầu): Typography, bold/italic/underline/strikethrough, text color, highlight, text alignment, block type selector, clear formatting.
>      2. `insert` (Chèn): Block insertion, tables, pictures/images, charts, page break, tab space, special symbols.
>      3. `layout` (Bố Cục): Page setup dialog, ruler toggle, rule lines toggle, ruler unit switcher (cm, in, mm, pt), line spacing.
>      4. `view` (Xem & Tiện Ích): View mode switcher (fullpage / blocks), outline document map navigation, document stats (word/char count), print setup dialog, contextual right inspector toggle.
>    - **Spreadsheet (Excel/Sheets)**: Minimum 4 required tabs (or distinct functional tab groups):
>      1. `home` (Trang Đầu): Font styling, font size, cell background, text color, borders, alignment, text wrap, number format, merge & center.
>      2. `insert` (Chèn): Insert row/column, charts, images, comments, auto-sum functions (SUM, AVERAGE, COUNT, MAX, MIN).
>      3. `data` (Dữ Liệu): Sort ascending/descending, custom multi-level sort, auto filter toggle, find & replace, conditional formatting, text-to-columns, remove duplicates.
>      4. `view` (Xem & Tiện Ích): Freeze panes toggle, gridlines toggle, table lock/unlock, formula bar toggle, zoom controls.
>    - **Presentation (PowerPoint/Slides)**: Minimum 3 required tabs:
>      1. `home` (Trang Đầu): Text formatting, card/slide styling, font controls, alignment.
>      2. `insert` (Chèn): Add card/slide, shapes, text box, images, icons, tables.
>      3. `design` / `view` (Thiết Kế & Trình Chiếu): Slide layout selector, background theme color, transitions, fullscreen interactive slideshow.
> 3. **STRUCTURAL & SEMANTIC STANDARDS (QUY CHUẨN CẤU TRÚC VÀ ĐỊNH DANH)**:
>    - **Tab Strip Container**: Each tabbed toolbar must declare an outer wrapper (`[module]-toolbar-wrapper`), a tab strip header (`[module]-toolbar-tabs-strip`), and a nav group (`[module]-toolbar-tabs-group` or `[module]-toolbar-tabs-nav-group`).
>    - **Semantic Tab Buttons**: Each tab button MUST have a descriptive ID (`[module]-tab-btn-[tabId]`), `size="xs"`, variant `primary` when active and `ghost` when inactive, icon `<IdeIcon>`, and localized label via `{t("tab.[tabId]", "Default")}`.
>    - **Tab Panes**: Each functional group pane MUST have ID (`[module]-tab-pane-[tabId]`), with class `is-active` when selected and `hidden` when inactive.
>    - **No Flat Monolithic Sprawl**: Prohibited to dump all controls from multiple functional domains into a single flat un-tabbed container.
> 4. **GOVERNANCE & ENGINE ENFORCEMENT**:
>    - Governed automatically by `LcOfficeToolbarGroupsEngine` (`Lowcode/sources/office/lc-office-toolbar-groups-engine.ts`) and registered in `Lowcode/.standards/Office/standard-specification.md` under Section 22.

---

## 1. Core Purpose & Architectural Importance

1. **Elimination of Monolithic Toolbar Clutter**:
   - Modern office productivity suites (Microsoft Office Ribbon, Google Workspace, Apple iWork) group hundreds of distinct formatting and computational commands into focused context tabs.
   - Forcing all buttons into one horizontal scrolling bar causes visual noise, layout overflow, poor mobile/tablet responsiveness, and extreme cognitive load.

2. **Context-Driven Workflow & Single Screen Clarity (Rule 17 & Rule 15)**:
   - Users focus on specific phases of document creation: Drafting (`home`), Sourcing & Media (`insert`), Page Geometry & Margins (`layout`), or Review & Analytics (`view`).
   - Grouping tools into tabs guarantees each screen state has clear, non-redundant controls without duplicating action buttons across headers or sidebars.

3. **Accessibility & Keyboard Navigation**:
   - Tab-based ribbon groups provide clean ARIA tablist patterns (`role="tablist"`, `role="tab"`, `aria-selected`, `role="tabpanel"`).
   - Test suites and AI agents can target discrete groups with predictable test IDs (`[module]-tab-btn-[tabId]`, `[module]-tab-pane-[tabId]`).

---

## 2. Standard Tabbed Toolbar Architecture Matrix

| Module | Tab ID | Tab Name (VI / EN) | Core Functional Group Tools | Container / Pane ID |
|---|---|---|---|---|
| **Document** | `home` | Trang Đầu / Home | Typography, Bold/Italic/Underline, Colors, Align, Blocks | `doc-tab-pane-home` |
| **Document** | `insert` | Chèn / Insert | Add Blocks, Tables, Images, Charts, Breaks, Symbols | `doc-tab-pane-insert` |
| **Document** | `layout` | Bố Cục / Layout | Page Setup, Rulers, Ruled Lines, Unit Switcher, Margins | `doc-tab-pane-layout` |
| **Document** | `view` | Xem & Tiện Ích / View | Fullpage/Blocks Mode, Outline Map, Stats, Print Setup | `doc-tab-pane-view` |
| **Spreadsheet** | `home` | Trang Đầu / Home | Fonts, Cell Styles, Borders, Alignment, Format, Merge | `spreadsheet-tab-pane-home` |
| **Spreadsheet** | `insert` | Chèn / Insert | Insert Rows/Cols, Charts, Images, AutoSum Functions | `spreadsheet-tab-pane-insert` |
| **Spreadsheet** | `data` | Dữ Liệu / Data | Sort A-Z/Z-A, Auto Filter, Find/Replace, Cond Format | `spreadsheet-tab-pane-data` |
| **Spreadsheet** | `view` | Xem & Tiện Ích / View | Freeze Panes, Gridlines, Lock Table, Zoom, Formulas | `spreadsheet-tab-pane-view` |
| **Presentation** | `home` | Trang Đầu / Home | Text Formatting, Slide Styles, Card Typography | `presentation-tab-pane-home` |
| **Presentation** | `insert` | Chèn / Insert | Add Slide/Card, Shapes, Text Boxes, Images, Tables | `presentation-tab-pane-insert` |
| **Presentation** | `design` / `view` | Thiết Kế & Xem | Slide Layouts, Themes, Backgrounds, Slideshow | `presentation-tab-pane-view` |

---

## 3. Strict Prohibitions ❌ (Zero Tolerance)

1. ❌ **FORBIDDEN** to build or render Office toolbars as a flat, single monolithic strip with all controls mixed together without tab groups.
2. ❌ **FORBIDDEN** to omit semantic IDs on tab buttons (`[module]-tab-btn-[tabId]`) or tab panes (`[module]-tab-pane-[tabId]`).
3. ❌ **FORBIDDEN** to use raw emojis or text-only buttons in tab strips; all tabs must use Base `<IdeIcon>` (Rule 14).
4. ❌ **FORBIDDEN** to use inline styles for tab strip layout, background, or active indicators (Rules 18 & 20).
5. ❌ **FORBIDDEN** to hardcode unlocalized tab label strings; all tab labels and tooltips must use `{t("tab.[id]", "Default")}` (Rule 54 & Rule 21).
