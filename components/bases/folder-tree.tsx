"use client";

import React, { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { IdeIcon } from "./ide-icon";
import { Button } from "./button";
import { Input } from "./input";

export interface FolderTreeNode {
  id: string;
  name: string;
  type: "folder" | "file";
  path?: string;
  icon?: string;
  iconColor?: string;
  badge?: string | number;
  badgeColor?: string;
  children?: FolderTreeNode[];
  isExpanded?: boolean;
  disabled?: boolean;
  fileType?: string;
  folderType?: string;
  metadata?: Record<string, any>;
  useCaseId?: string;
  controllerName?: string;
  dtoName?: string;
  entityName?: string;
  repoName?: string;
  storyId?: string;
  taskId?: string;
}

export interface FolderTreeProps {
  id?: string;
  nodes: FolderTreeNode[];
  selectedId?: string;
  defaultSelectedId?: string;
  selectedPath?: string;
  onSelectNode?: (node: FolderTreeNode) => void;
  onSelectFile?: (node: FolderTreeNode) => void;
  onSelectFolder?: (node: FolderTreeNode) => void;
  showSearch?: boolean;
  searchPlaceholder?: string;
  title?: string;
  titleIcon?: string;
  defaultExpandedIds?: string[];
  expandAll?: boolean;
  actions?: Array<{
    id: string;
    icon: string;
    title: string;
    onClick: () => void;
  }>;
  emptyText?: string;
  className?: string;
  style?: React.CSSProperties;
  isLight?: boolean;
  getNodeTestId?: (node: FolderTreeNode) => string;
  searchInputTestId?: string;
  renderNodeRight?: (node: FolderTreeNode, isSelected: boolean) => React.ReactNode;
  getNodeClassName?: (node: FolderTreeNode, isSelected: boolean) => string;
}

/**
 * Common IDE FolderTree — Section 543 & 573
 * Fully controllable tree view with search filter, badge counts, and Base components.
 */
export const FolderTree = React.memo(function FolderTree({
  id = "common-folder-tree",
  nodes = [],
  selectedId,
  defaultSelectedId,
  selectedPath,
  onSelectNode,
  onSelectFile,
  onSelectFolder,
  showSearch = true,
  searchPlaceholder = "Tìm kiếm tệp & thư mục...",
  title,
  titleIcon = "FolderTree",
  defaultExpandedIds,
  expandAll = false,
  actions = [],
  emptyText = "Không có mục nào phù hợp",
  className = "",
  style,
  isLight = true,
  getNodeTestId,
  searchInputTestId,
  renderNodeRight,
  getNodeClassName,
}: FolderTreeProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [internalSelectedId, setInternalSelectedId] = useState<string | undefined>(
    defaultSelectedId || selectedId
  );
  const effectiveSelectedId = selectedId !== undefined ? selectedId : internalSelectedId;

  useEffect(() => {
    if (selectedId !== undefined) {
      setInternalSelectedId(selectedId);
    }
  }, [selectedId]);

  // Collect all folder IDs recursively
  const allFolderIds = useMemo(() => {
    const ids: string[] = [];
    const traverse = (items: FolderTreeNode[]) => {
      for (const item of items) {
        if (item.type === "folder") {
          ids.push(item.id);
          if (item.children) traverse(item.children);
        }
      }
    };
    traverse(nodes);
    return ids;
  }, [nodes]);

  // Expanded folders state
  const [expandedFolderIds, setExpandedFolderIds] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    if (expandAll) {
      allFolderIds.forEach((fId) => {
        initial[fId] = true;
      });
    } else if (defaultExpandedIds && defaultExpandedIds.length > 0) {
      defaultExpandedIds.forEach((fId) => {
        initial[fId] = true;
      });
    } else {
      // Default: Expand first 3 levels of folders
      nodes.forEach((root) => {
        if (root.type === "folder") {
          initial[root.id] = true;
          root.children?.forEach((child) => {
            if (child.type === "folder") {
              initial[child.id] = true;
              child.children?.forEach((subchild) => {
                if (subchild.type === "folder") {
                  initial[subchild.id] = true;
                }
              });
            }
          });
        }
      });
    }
    return initial;
  });

  // Sync expandAll prop changes (e.g. when user clicks Expand All / Collapse All in parent)
  const prevExpandAll = useRef(expandAll);
  useEffect(() => {
    if (expandAll === undefined || prevExpandAll.current === expandAll) return;
    prevExpandAll.current = expandAll;
    if (expandAll) {
      const next: Record<string, boolean> = {};
      allFolderIds.forEach((fId) => { next[fId] = true; });
      setExpandedFolderIds(next);
    } else {
      setExpandedFolderIds({});
    }
  }, [expandAll, allFolderIds]);

  const toggleFolder = useCallback((folderId: string) => {
    setExpandedFolderIds((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
  }, []);

  const handleExpandAll = useCallback(() => {
    const next: Record<string, boolean> = {};
    allFolderIds.forEach((fId) => {
      next[fId] = true;
    });
    setExpandedFolderIds(next);
  }, [allFolderIds]);

  const handleCollapseAll = useCallback(() => {
    setExpandedFolderIds({});
  }, []);

  // Filter tree nodes and auto-expand parents of matching nodes
  const filteredTree = useMemo(() => {
    if (!searchQuery.trim()) return nodes;
    const query = searchQuery.toLowerCase();

    const filterNodes = (items: FolderTreeNode[]): FolderTreeNode[] => {
      const result: FolderTreeNode[] = [];
      for (const item of items) {
        if (item.type === "file") {
          if (item.name.toLowerCase().includes(query) || item.path?.toLowerCase().includes(query)) {
            result.push(item);
          }
        } else if (item.type === "folder") {
          const matchedChildren = item.children ? filterNodes(item.children) : [];
          if (matchedChildren.length > 0 || item.name.toLowerCase().includes(query)) {
            result.push({
              ...item,
              children: matchedChildren,
            });
          }
        }
      }
      return result;
    };

    return filterNodes(nodes);
  }, [nodes, searchQuery]);

  // Resolve vector icon according to file extension or node props
  const getNodeIcon = useCallback((node: FolderTreeNode, isExpanded: boolean) => {
    if (node.type === "folder") {
      if (node.icon) {
        return <IdeIcon name={node.icon} size={13} color={node.iconColor || "var(--primary, #6938ef)"} />;
      }
      return (
        <IdeIcon
          name={isExpanded ? "FolderOpen" : "Folder"}
          size={13}
          color={node.iconColor || "#d97706"}
        />
      );
    }

    // Explicit icon defined
    if (node.icon) {
      return <IdeIcon name={node.icon} size={12} color={node.iconColor || "currentColor"} />;
    }

    const lowerCaseName: string = node.name.toLowerCase();
    const isTestLcFile: boolean = lowerCaseName.endsWith(".test.lc") || node.fileType === "test-lc";
    const fileExtension: string = isTestLcFile
      ? "test.lc"
      : (node.fileType || lowerCaseName.split(".").pop() || "").toLowerCase();

    switch (fileExtension) {
      case "test.lc":
      case "test-lc":
        return <IdeIcon name="FlaskConical" size={12} color="#10b981" />;
      case "lc":
        return <IdeIcon name="Zap" size={12} color="var(--primary, #6938ef)" />;
      case "ts":
      case "tsx":
      case "js":
      case "jsx":
      case "mjs":
      case "cjs":
        return <IdeIcon name="FileCode" size={12} color="#0284c7" />;
      case "json":
        return <IdeIcon name="FileJson" size={12} color="#d97706" />;
      case "css":
      case "scss":
      case "sass":
      case "less":
        return <IdeIcon name="Palette" size={12} color="#06b6d4" />;
      case "md":
      case "markdown":
        return <IdeIcon name="FileCode2" size={12} color="#0284c7" />;
      case "txt":
      case "text":
      case "log":
        return <IdeIcon name="FileText" size={12} color="#64748b" />;
      case "sql":
      case "db":
      case "sqlite":
        return <IdeIcon name="Database" size={12} color="#8b5cf6" />;
      case "png":
      case "jpg":
      case "jpeg":
      case "svg":
      case "webp":
      case "gif":
      case "ico":
        return <IdeIcon name="Image" size={12} color="#10b981" />;
      case "pdf":
        return <IdeIcon name="FileType" size={12} color="#ef4444" />;
      case "xlsx":
      case "xls":
      case "csv":
      case "excel":
        return <IdeIcon name="FileSpreadsheet" size={12} color="#10b981" />;
      case "docx":
      case "doc":
      case "rtf":
        return <IdeIcon name="FileText" size={12} color="#3b82f6" />;
      case "pptx":
      case "ppt":
      case "presentation":
        return <IdeIcon name="Presentation" size={12} color="#f59e0b" />;
      case "zip":
      case "rar":
      case "tar":
      case "gz":
      case "7z":
        return <IdeIcon name="FileArchive" size={12} color="#d97706" />;
      case "mp3":
      case "wav":
      case "ogg":
      case "flac":
        return <IdeIcon name="FileAudio" size={12} color="#ec4899" />;
      case "mp4":
      case "mov":
      case "avi":
      case "mkv":
      case "webm":
        return <IdeIcon name="FileVideo" size={12} color="#8b5cf6" />;
      case "html":
      case "htm":
      case "xml":
        return <IdeIcon name="Code" size={12} color="#f97316" />;
      case "py":
      case "python":
        return <IdeIcon name="FileCode" size={12} color="#38bdf8" />;
      case "sh":
      case "bash":
      case "zsh":
        return <IdeIcon name="Terminal" size={12} color="#4ade80" />;
      default:
        return <IdeIcon name="File" size={12} color="#64748b" />;
    }
  }, []);

  // Recursive tree node renderer — memoized to prevent re-creation on every render
  const renderNode = useCallback((node: FolderTreeNode, depth = 0): React.ReactNode => {
    const isFolder = node.type === "folder";
    // When searching, force expand parent folders that contain matching items
    const isExpanded = searchQuery.trim() ? true : Boolean(expandedFolderIds[node.id]);
    const isSelected = Boolean(effectiveSelectedId === node.id || (selectedPath && node.path && selectedPath === node.path));

    const paddingLeft = depth * 14 + 8;

    return (
      <div key={node.id} id={`folder-tree-node-wrapper-${node.id}`} className="folder-tree-node-wrapper">
        <div
          id={`folder-tree-node-row-${node.id}`}
          data-testid={getNodeTestId ? getNodeTestId(node) : `folder-tree-node-${node.name}`}
          data-active={isSelected ? "true" : undefined}
          data-selected={isSelected ? "true" : undefined}
          data-tree-focused={isSelected ? "true" : undefined}
          onClick={() => {
            if (node.disabled) return;
            setInternalSelectedId(node.id);
            if (isFolder) {
              toggleFolder(node.id);
              onSelectFolder?.(node);
            } else {
              onSelectFile?.(node);
            }
            onSelectNode?.(node);
          }}
          style={{
            paddingLeft: `${paddingLeft}px`,
          }}
          className={`folder-tree-item-row ${isSelected ? "active selected theme-active" : ""} ${getNodeClassName ? getNodeClassName(node, isSelected) : ""}`.trim()}
        >
          {/* Left section: expand arrow + icon + label */}
          <div
            id={`folder-tree-node-left-${node.id}`}
            className="folder-tree-node-left"
          >
            {isFolder ? (
              <span
                id={`folder-tree-chevron-${node.id}`}
                className="folder-tree-chevron"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFolder(node.id);
                }}
              >
                <IdeIcon
                  name={isExpanded ? "ChevronDown" : "ChevronRight"}
                  size={11}
                  color="var(--text-muted, #64748b)"
                />
              </span>
            ) : (
              <span id={`folder-tree-leaf-indent-${node.id}`} className="folder-tree-leaf-indent" />
            )}

            <span
              id={`folder-tree-icon-${node.id}`}
              className="folder-tree-icon"
            >
              {getNodeIcon(node, isExpanded)}
            </span>

            <span
              id={`folder-tree-label-${node.id}`}
              className="folder-tree-label"
              title={node.path || node.name}
            >
              {node.name}
            </span>
          </div>

          {/* Right section: Badge & Custom Node Right Actions */}
          <div
            id={`folder-tree-node-right-${node.id}`}
            className="folder-tree-node-right"
          >
            {node.badge !== undefined && (
              <span
                id={`folder-tree-badge-${node.id}`}
                className="folder-tree-badge"
              >
                {node.badge}
              </span>
            )}
            {renderNodeRight?.(node, isSelected)}
          </div>
        </div>

        {/* Children nodes if folder is expanded */}
        {isFolder && isExpanded && node.children && (
          <div id={`folder-tree-children-${node.id}`}>
            {node.children.map((child) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expandedFolderIds, effectiveSelectedId, selectedId, selectedPath, searchQuery, getNodeTestId, getNodeIcon, renderNodeRight, getNodeClassName, toggleFolder, onSelectNode, onSelectFile, onSelectFolder]);

  return (
    <div
      id={id}
      data-testid={id}
      data-multi-folder="true"
      data-selected-id={effectiveSelectedId || ""}
      data-selected-item-id={effectiveSelectedId || ""}
      className={`ide-folder-tree-container theme-surface theme-text flex flex-col h-full w-full overflow-hidden ${className}`.trim()}
      style={style}
    >
      {/* ── 1. Top Header: Title & Controls ── */}
      {(title || actions.length > 0) && (
        <div
          id={`${id}-header`}
          data-testid={`${id}-header`}
          className="folder-tree-toolbar theme-surface-muted theme-border"
        >
          {title && (
            <div
              id={`${id}-title-wrap`}
              className="flex items-center gap-1-5 text-xs font-extrabold text-muted uppercase tracking-wider"
            >
              <IdeIcon name={titleIcon} size={12} color="var(--primary, #6938ef)" />
              <span id={`${id}-title-text`}>{title}</span>
            </div>
          )}

          <div
            id={`${id}-header-actions`}
            className="flex items-center gap-1"
          >
            {/* Expand All */}
            <Button
              id={`${id}-expand-all-btn`}
              variant="ghost"
              size="xs"
              type="button"
              onClick={handleExpandAll}
              data-testid={`${id}-expand-all-btn`}
              title="Mở rộng tất cả thư mục"
              className="p-1 h-5"
            >
              <IdeIcon name="ChevronsUpDown" size={11} color="var(--text-muted, #64748b)" />
            </Button>

            {/* Collapse All */}
            <Button
              id={`${id}-collapse-all-btn`}
              variant="ghost"
              size="xs"
              type="button"
              onClick={handleCollapseAll}
              data-testid={`${id}-collapse-all-btn`}
              title="Thu gọn tất cả thư mục"
              className="p-1 h-5"
            >
              <IdeIcon name="ChevronsDownUp" size={11} color="var(--text-muted, #64748b)" />
            </Button>

            {/* Custom actions */}
            {actions.map((act) => (
              <Button
                key={act.id}
                id={`${id}-action-${act.id}`}
                variant="ghost"
                size="xs"
                type="button"
                onClick={act.onClick}
                title={act.title}
                data-testid={`${id}-action-${act.id}`}
                className="p-1 h-5"
              >
                <IdeIcon name={act.icon} size={11} color="var(--text-muted, #64748b)" />
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* ── 2. Quick Search Filter ── */}
      {showSearch && (
        <div
          id={`${id}-search-container`}
          data-testid={`${id}-search-container`}
          className="folder-tree-search-row theme-surface"
        >
          <Input
            id={`${id}-search-input`}
            data-testid={searchInputTestId || `${id}-search-input`}
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            inputSize="xs"
            leftIcon={<IdeIcon name="Search" size={11} color="var(--text-muted, #64748b)" />}
            className="h-6 text-xs"
          />
        </div>
      )}

      {/* ── 3. Tree Content Scroll Area ── */}
      <div
        id={`${id}-nodes-list`}
        data-testid={`${id}-nodes-list`}
        className="flex-1 overflow-y-auto p-1 flex flex-col gap-0-5"
      >
        {filteredTree.length > 0 ? (
          filteredTree.map((node) => renderNode(node, 0) as React.ReactNode)
        ) : (
          <div
            id={`${id}-empty-state`}
            data-testid={`${id}-empty-state`}
            className="p-6 text-center text-muted text-xs"
          >
            <span>{emptyText}</span>
          </div>
        )}
      </div>
    </div>
  );
});

// Alias TreeFolder for maximum compatibility
export const TreeFolder = FolderTree;
