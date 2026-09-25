"use client";
/**
 * components/bases/sidebar.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Canonical Single Sidebar Base Component (`<Sidebar>` / `<EditorSidebar>`)
 * Re-exports from modular sub-components in `./sidebar/`
 *
 * Conforms to:
 * - RULE[always-use-ide-icon.md]: Uses <IdeIcon> from @/components/bases (no raw emoji).
 * - RULE[default-id-for-div-container.md]: Descriptive semantic kebab-case ID on all containers/divs.
 * - RULE[standard-for-project.md]: Theme variables, #6938ef, font Inter, 8-pt grid.
 * - RULE[break-long-files-into-multi-components]: Sub-components modularized into ./sidebar/ (< 350 lines per file)
 * - Section 484 in .lowcode/.standards/MCP/standard-specification.md
 * ─────────────────────────────────────────────────────────────────────────────
 */

export * from "./sidebar/index";
export { default } from "./sidebar/index";
