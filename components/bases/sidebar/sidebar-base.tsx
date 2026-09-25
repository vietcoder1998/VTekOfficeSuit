"use client";

type MenuItemId = string;
const CommonMenu: React.FC<any> = () => null;
const DocumentsMenu: React.FC<any> = () => null;
const ServicesMenu: React.FC<any> = () => null;
const SubmenuPanel: React.FC<any> = () => null;
const ServicesSidebarPanel: React.FC<any> = () => null;
import React from "react";
import { SidebarBody } from "./sidebar-body";
import { SidebarDetailPanel } from "./sidebar-detail-panel";
import { SidebarFooter } from "./sidebar-footer";
import { SidebarHeader } from "./sidebar-header";
import { SidebarIconStrip } from "./sidebar-icon-strip";
import { SidebarItemTree } from "./sidebar-item-tree";
import { SidebarTitle } from "./sidebar-title";
import type { EditorSidebarProps, SidebarProps } from "./types";

export type { EditorSidebarProps, SidebarProps };

/**
 * Common Base Component: Sidebar & EditorSidebar — Section 484 Standard
 * Refactored into clean modular architecture with Base components.
 */
export function Sidebar({
  variant,
  editorMode = "ui",
  unifiedSidebar,

  // UI Mode
  activeItem = null,
  onItemClick,
  onToggleCollapse,
  isCollapsed,
  onCollapseSubmenu,
  children,

  // Multi-Project Workspaces
  workspaces,
  activeWorkspaceId,
  onSelectWorkspace,
  projects,
  activeProjectId,
  onSelectProject,
  onSelectPage,
  onAddProject,
  workspaceName,

  // Services Mode
  activeServicesItem = null,
  onServicesItemClick,
  onToggleServicesCollapse,
  onCollapseServices,
  onOpenGitControl,
  servicesPanelContent,

  // Documents Mode
  activeDocumentsItem = null,
  onDocumentsItemClick,
  onToggleDocumentsCollapse,

  // Resizing
  showResizeHandle = true,
  onStartResize,

  // Standalone / Generic
  side = "left",
  width,
  title,
  header,
  footer,
  icon,
  badge,
  actions,
  isOpen = true,
  onClose,

  // Icon Strip Props
  iconItems,
  onIconItemSelect,
  topContent,
  bottomContent,

  // Detail Panel Props
  searchPlaceholder,
  searchQuery,
  onSearchChange,
  headerExtra,
  onWidthChange,
  isLoading = false,
  loadingSkeleton,

  // Tree Props
  treeItems,
  activeTreeItemId,
  onSelectTreeItem,

  // View Mode
  contentViewMode,
  defaultContentViewMode = "item",
  onContentViewModeChange,

  // Identifiers & Styling
  id = "layout-editor-sidebar-container",
  className = "",
  style,
}: SidebarProps) {
  const [currentContentViewMode, setCurrentContentViewMode] = React.useState<"item" | "json">(
    contentViewMode ?? defaultContentViewMode ?? "item"
  );

  React.useEffect(() => {
    if (contentViewMode !== undefined) {
      setCurrentContentViewMode(contentViewMode);
    }
  }, [contentViewMode]);

  const effectiveVariant = variant || (editorMode ? "explorer" : "default");

  // ── Variant: Icon Strip (44px) ──────────────────────────────────
  if (effectiveVariant === "icon-strip") {
    return (
      <SidebarIconStrip
        id={id}
        items={iconItems}
        activeItemId={activeItem ?? undefined}
        onItemSelect={onIconItemSelect}
        topContent={topContent}
        bottomContent={bottomContent}
        className={className}
      >
        {children}
      </SidebarIconStrip>
    );
  }

  // ── Variant: Detail Panel (260px) ──────────────────────────────
  if (effectiveVariant === "detail-panel") {
    const numericWidth = typeof width === "number" ? width : 260;
    return (
      <SidebarDetailPanel
        id={id}
        title={title}
        icon={icon}
        badge={badge}
        actions={actions}
        isOpen={isOpen}
        onClose={onClose}
        width={numericWidth}
        onWidthChange={onWidthChange}
        searchPlaceholder={searchPlaceholder}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        headerExtra={headerExtra}
        footer={footer}
        isLoading={isLoading}
        loadingSkeleton={loadingSkeleton}
        className={className}
      >
        {children}
      </SidebarDetailPanel>
    );
  }

  // ── Variant: Tree ──────────────────────────────────────────────
  if (effectiveVariant === "tree") {
    return (
      <aside
        id={id}
        data-testid={id}
        className={`base-sidebar base-sidebar-tree ${className}`}
      >
        {header && <SidebarHeader id={`${id}-header`}>{header}</SidebarHeader>}
        {title && !header && (
          <SidebarTitle id={`${id}-title`} icon={icon}>
            {title}
          </SidebarTitle>
        )}
        <SidebarBody id={`${id}-body`}>
          {treeItems ? (
            <SidebarItemTree
              id={`${id}-tree`}
              items={treeItems}
              activeItemId={activeTreeItemId}
              onSelectItem={onSelectTreeItem}
            />
          ) : (
            children
          )}
        </SidebarBody>
        {footer && <SidebarFooter id={`${id}-footer`}>{footer}</SidebarFooter>}
      </aside>
    );
  }

  // ── Variant: Standalone / Custom ───────────────────────────────
  if (effectiveVariant === "standalone") {
    const isStandaloneCollapsed = isCollapsed ?? false;
    return (
      <aside
        id={id}
        data-testid={id}
        className={`base-sidebar base-sidebar-standalone ${className}`}
        data-side={side}
        data-collapsed={isStandaloneCollapsed}
        data-sidebar-content-view={currentContentViewMode}
        style={style}
      >
        {header ? (
          <SidebarHeader id={`${id}-header`}>{header}</SidebarHeader>
        ) : title ? (
          <SidebarTitle id={`${id}-title`} icon={icon}>
            {title}
          </SidebarTitle>
        ) : null}
        <SidebarBody id={`${id}-body`} className="flex-1 overflow-y-auto">
          {children}
        </SidebarBody>
        {footer && (
          <SidebarFooter id={`${id}-footer`}>
            {footer}
          </SidebarFooter>
        )}
      </aside>
    );
  }

  // ── Variant: Editor (Two-Columns IDE Mode) ──────────────────────
  const isUiCollapsed = isCollapsed !== undefined ? isCollapsed : activeItem === null;
  const isServicesCollapsed = activeServicesItem === null;
  const isDocumentsCollapsed = activeDocumentsItem === null;

  // Unified mode determination
  const isUnified = Boolean(
    unifiedSidebar ||
    (unifiedSidebar !== false && activeItem !== undefined && !activeServicesItem && !activeDocumentsItem && Boolean(children))
  );

  if (isUnified) {
    return (
      <div
        id={id}
        data-testid={id}
        className={`layout-editor-sidebar base-sidebar ${className}`}
        data-sidebar-layout="two-columns"
        data-sidebar-content-view={currentContentViewMode}
        data-editor-mode={editorMode}
        data-unified-sidebar="true"
        style={style}
      >
        <div
          id="layout-editor-ui-sidebar-group"
          data-testid="layout-editor-ui-sidebar-group"
          className="layout-editor-ui-sidebar-group base-sidebar-ui-group"
          data-sidebar-col1="tool"
          data-sidebar-col2="content"
          data-sidebar-content-view={currentContentViewMode}
          data-content-type={activeItem || "tree"}
        >
          {/* Cột 1: Tool Activity Bar */}
          <CommonMenu
            activeItem={activeItem as MenuItemId | null}
            onItemClick={onItemClick || (() => {})}
            onToggleCollapse={onToggleCollapse}
            isCollapsed={isUiCollapsed}
          />
          {/* Cột 2: Show content trong tool, file hoặc tree-item */}
          <SubmenuPanel
            activeItem={activeItem as MenuItemId | null}
            onCollapse={onCollapseSubmenu}
            workspaces={workspaces}
            activeWorkspaceId={activeWorkspaceId}
            onSelectWorkspace={onSelectWorkspace}
            projects={projects}
            activeProjectId={activeProjectId}
            onSelectProject={onSelectProject}
            onSelectPage={onSelectPage}
            onAddProject={onAddProject}
            workspaceName={workspaceName}
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
          >
            {children}
          </SubmenuPanel>
        </div>

        {/* Resize Handle */}
        {showResizeHandle && onStartResize && (
          <div
            id="layout-editor-sidebar-resize-handle"
            data-testid="layout-editor-sidebar-resize-handle"
            className="sidebar-resize-handle base-sidebar-resizer"
            onMouseDown={onStartResize}
            role="separator"
            aria-orientation="vertical"
            aria-label="Thay đổi kích thước thanh bên"
          />
        )}
      </div>
    );
  }

  return (
    <div
      id={id}
      data-testid={id}
      className={`layout-editor-sidebar base-sidebar ${className}`}
      data-sidebar-layout="two-columns"
      data-sidebar-content-view={currentContentViewMode}
      data-editor-mode={editorMode}
      style={style}
    >
      {editorMode === "services" ? (
        <div
          id="layout-editor-services-sidebar-group"
          data-testid="layout-editor-services-sidebar-group"
          className="layout-editor-services-sidebar-group base-sidebar-services-group"
          data-sidebar-col1="tool"
          data-sidebar-col2="content"
          data-sidebar-content-view={currentContentViewMode}
          data-content-type="file"
        >
          <ServicesMenu
            activeItem={activeServicesItem}
            onItemClick={onServicesItemClick || (() => {})}
            onToggleCollapse={onToggleServicesCollapse}
            isCollapsed={isServicesCollapsed}
          />
          {servicesPanelContent ? (
            servicesPanelContent
          ) : (
            <ServicesSidebarPanel
              activeItem={activeServicesItem}
              onCollapse={onCollapseServices || (() => {})}
              onOpenGitControl={onOpenGitControl}
            />
          )}
        </div>
      ) : editorMode === "documents" ? (
        <div
          id="layout-editor-documents-sidebar-group"
          data-testid="layout-editor-documents-sidebar-group"
          className="layout-editor-documents-sidebar-group base-sidebar-documents-group"
          data-sidebar-col1="tool"
        >
          <DocumentsMenu
            activeItem={activeDocumentsItem}
            onItemClick={onDocumentsItemClick || (() => {})}
            onToggleCollapse={onToggleDocumentsCollapse}
            isCollapsed={isDocumentsCollapsed}
          />
        </div>
      ) : (
        <div
          id="layout-editor-ui-sidebar-group"
          data-testid="layout-editor-ui-sidebar-group"
          className="layout-editor-ui-sidebar-group base-sidebar-ui-group"
          data-sidebar-col1="tool"
          data-sidebar-col2="content"
          data-sidebar-content-view={currentContentViewMode}
          data-content-type={activeItem || "tree"}
        >
          <CommonMenu
            activeItem={activeItem as MenuItemId | null}
            onItemClick={onItemClick || (() => {})}
            onToggleCollapse={onToggleCollapse}
            isCollapsed={isUiCollapsed}
          />
          <SubmenuPanel
            activeItem={activeItem as MenuItemId | null}
            onCollapse={onCollapseSubmenu}
            workspaces={workspaces}
            activeWorkspaceId={activeWorkspaceId}
            onSelectWorkspace={onSelectWorkspace}
            projects={projects}
            activeProjectId={activeProjectId}
            onSelectProject={onSelectProject}
            onSelectPage={onSelectPage}
            onAddProject={onAddProject}
            workspaceName={workspaceName}
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
          >
            {children}
          </SubmenuPanel>
        </div>
      )}

      {showResizeHandle && editorMode !== "documents" && onStartResize && (
        <div
          id="layout-editor-sidebar-resize-handle"
          data-testid="layout-editor-sidebar-resize-handle"
          className="sidebar-resize-handle base-sidebar-resizer"
          onMouseDown={onStartResize}
          role="separator"
          aria-orientation="vertical"
          aria-label="Thay đổi kích thước thanh bên"
        />
      )}
    </div>
  );
}

export const EditorSidebar = Sidebar;
export default Sidebar;
