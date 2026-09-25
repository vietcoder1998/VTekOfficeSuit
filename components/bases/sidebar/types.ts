"use client";

export type SidebarVariant = "default" | "explorer" | "compact" | "wide" | "floating" | "drawer";

export interface IdeSidebarTreeItem {
  id: string;
  label: string;
  icon?: string;
  children?: IdeSidebarTreeItem[];
  isExpanded?: boolean;
  isSelected?: boolean;
  badge?: string;
}
import type { MenuItemId } from "@/components/editor/navbar/common-menu";
import type { ServicesMenuItemId } from "@/components/editor/navbar/services-menu";
import React from "react";

export interface SidebarHeaderProps {
  id?: string;
  className?: string;
  title?: React.ReactNode;
  icon?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  onClose?: (e?: React.MouseEvent) => void;
  closeAriaLabel?: string;
  closeButtonId?: string;
  isFolder?: boolean;
  isExpanded?: boolean;
  onToggle?: (e?: React.MouseEvent) => void;
  level?: number;
  children?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  style?: React.CSSProperties;
}

export type BaseSidebarHeaderProps = SidebarHeaderProps;

export interface SidebarTitleProps {
  id?: string;
  icon?: string;
  children?: React.ReactNode;
  className?: string;
}

export interface SidebarBodyProps {
  id?: string;
  className?: string;
  children?: React.ReactNode;
}

export interface SidebarFooterProps {
  id?: string;
  className?: string;
  children?: React.ReactNode;
}

export interface SidebarIconStripItem {
  id: string;
  label: string;
  icon: string;
  href?: string;
  shortcut?: string;
  badge?: string;
  onClick?: () => void;
  isActive?: boolean;
}

export interface SidebarIconStripProps {
  id?: string;
  items?: SidebarIconStripItem[];
  activeItemId?: string;
  onItemSelect?: (id: string) => void;
  topContent?: React.ReactNode;
  bottomContent?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export interface SidebarDetailPanelProps {
  id?: string;
  title?: React.ReactNode;
  icon?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
  width?: number;
  onWidthChange?: (width: number) => void;
  searchPlaceholder?: string;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  headerExtra?: React.ReactNode;
  footer?: React.ReactNode;
  isLoading?: boolean;
  loadingSkeleton?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export interface SidebarDetailSkeletonProps {
  id?: string;
  className?: string;
  showHeader?: boolean;
  showTabs?: boolean;
  showSearch?: boolean;
  showFooter?: boolean;
  tabsCount?: number;
  sectionsCount?: number;
  fieldsPerSection?: number;
  width?: number | string;
  ariaLabel?: string;
}

export type DetailBarSkeletonProps = SidebarDetailSkeletonProps;

export interface SidebarItemTreeProps {
  id?: string;
  items: IdeSidebarTreeItem[];
  activeItemId?: string;
  defaultActiveItemId?: string;
  onSelectItem?: (item: IdeSidebarTreeItem) => void;
  level?: number;
  className?: string;
}

export interface SidebarProps {
  variant?: SidebarVariant;
  editorMode?: "ui" | "services" | "documents" | "custom";
  unifiedSidebar?: boolean;

  // ── UI Mode (CommonMenu & SubmenuPanel) ─────────────────────────
  activeItem?: MenuItemId | (string & {}) | null;
  onItemClick?: (id: MenuItemId) => void;
  onToggleCollapse?: () => void;
  isCollapsed?: boolean;
  onCollapseSubmenu?: () => void;
  children?: React.ReactNode;

  // ── Multi-Project Workspaces (Section 367 & 377) ──────────────────────
  workspaces?: any[];
  activeWorkspaceId?: string | null;
  onSelectWorkspace?: (workspaceId: string) => void;
  projects?: any[];
  activeProjectId?: string;
  onSelectProject?: (projectId: string) => void;
  onSelectPage?: (slug: string, projectId?: string) => void;
  onAddProject?: () => void;
  workspaceName?: string;

  // ── Services Mode (ServicesMenu & ServicesSidebarPanel) ─────────
  activeServicesItem?: ServicesMenuItemId | null;
  onServicesItemClick?: (item: any) => void;
  onToggleServicesCollapse?: () => void;
  onCollapseServices?: () => void;
  onOpenGitControl?: () => void;
  servicesPanelContent?: React.ReactNode;

  // ── Documents Mode (DocumentsMenu) ─────────────────────────────
  activeDocumentsItem?: any;
  onDocumentsItemClick?: (category: any) => void;
  onToggleDocumentsCollapse?: () => void;

  // ── Resize Handle ──────────────────────────────────────────────
  submenuWidth?: number;
  showResizeHandle?: boolean;
  onStartResize?: (e: React.MouseEvent<HTMLDivElement>) => void;

  // ── Generic / Standalone Mode ──────────────────────────────────
  side?: "left" | "right";
  width?: number | string;
  title?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  icon?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  isOpen?: boolean;
  onClose?: () => void;

  // ── Icon Strip Variant Props ───────────────────────────────────
  iconItems?: SidebarIconStripItem[];
  onIconItemSelect?: (id: string) => void;
  topContent?: React.ReactNode;
  bottomContent?: React.ReactNode;

  // ── Detail Panel Variant Props ─────────────────────────────────
  searchPlaceholder?: string;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  headerExtra?: React.ReactNode;
  onWidthChange?: (width: number) => void;
  isLoading?: boolean;
  loadingSkeleton?: React.ReactNode;

  // ── Tree Variant Props ─────────────────────────────────────────
  treeItems?: IdeSidebarTreeItem[];
  activeTreeItemId?: string;
  onSelectTreeItem?: (item: IdeSidebarTreeItem) => void;

  // ── Column 2 View Mode (Item View vs JSON View) ───────────────
  contentViewMode?: "item" | "json";
  defaultContentViewMode?: "item" | "json";
  onContentViewModeChange?: (mode: "item" | "json") => void;

  // ── Styling & IDs ──────────────────────────────────────────────
  id?: string;
  className?: string;
  style?: React.CSSProperties;
}

export type EditorSidebarProps = SidebarProps;
