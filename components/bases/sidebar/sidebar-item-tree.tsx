"use client";

import React, { useState } from "react";
import { IdeIcon } from "../ide-icon";
import { useSafeTranslations } from "../use-safe-translations";
import type { SidebarItemTreeProps, IdeSidebarTreeItem } from "./types";

export type { SidebarItemTreeProps };

/**
 * SidebarItemTree — Section 484 Standard
 * Recursive tree navigator with expand/collapse states and IdeIcons.
 */
export function SidebarItemTree({
  id = "base-sidebar-item-tree",
  items = [],
  activeItemId,
  defaultActiveItemId,
  onSelectItem,
  level = 0,
  className = "",
}: SidebarItemTreeProps) {
  const t = useSafeTranslations("components.bases.sidebar", {
    collapse: "Thu gọn",
    expand: "Mở rộng",
  });
  const [internalActiveId, setInternalActiveId] = useState<string | undefined>(
    defaultActiveItemId || activeItemId
  );
  const effectiveActiveId = activeItemId !== undefined ? activeItemId : internalActiveId;

  const [expandedMap, setExpandedMap] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    items.forEach((item) => {
      if (item.isExpanded !== undefined) {
        initial[item.id] = item.isExpanded;
      }
    });
    return initial;
  });

  const toggleExpand = (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedMap((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const handleRowClick = (item: IdeSidebarTreeItem) => {
    setInternalActiveId(item.id);
    onSelectItem?.(item);
  };

  const resolveItemIcon = (item: IdeSidebarTreeItem, isExpanded: boolean) => {
    if (item.icon) return item.icon;
    if (item.type === "folder") {
      return isExpanded ? "FolderOpen" : "Folder";
    }
    if (item.type === "route") return "Layers";
    if (item.type === "component") return "Box";
    if (item.type === "entity") return "Database";
    return "FileCode";
  };

  return (
    <ul
      id={id}
      data-testid={id}
      data-multi-folder="true"
      data-selected-item-id={effectiveActiveId || ""}
      role="tree"
      className={`base-sidebar-tree-list ${className}`}
    >
      {items.map((item) => {
        const isFolder = item.type === "folder" || (item.children && item.children.length > 0);
        const isExpanded = expandedMap[item.id] ?? item.isExpanded ?? false;
        const isActive = effectiveActiveId === item.id;
        const iconName = resolveItemIcon(item, isExpanded);

        return (
          <li
            key={item.id}
            id={`${id}-item-${item.id}`}
            data-testid={`${id}-item-${item.id}`}
            role="treeitem"
            aria-expanded={isFolder ? isExpanded : undefined}
            aria-selected={isActive}
            className="flex flex-col"
          >
            <div
              id={`${id}-row-${item.id}`}
              data-testid={`${id}-row-${item.id}`}
              data-active={isActive ? "true" : undefined}
              data-selected={isActive ? "true" : undefined}
              onClick={() => handleRowClick(item)}
              className={`base-sidebar-tree-item-row px-2 py-1 font-sans ${isActive ? "is-active" : ""}`}
            >
              {isFolder ? (
                <button
                  type="button"
                  id={`${id}-toggle-${item.id}`}
                  data-testid={`${id}-toggle-${item.id}`}
                  onClick={(e) => toggleExpand(item.id, e)}
                  className="p-0.5 rounded hover:bg-black/5 dark:hover:bg-white/10"
                  aria-label={isExpanded ? t("collapse", "Thu gọn") : t("expand", "Mở rộng")}
                >
                  <IdeIcon
                    name={isExpanded ? "ChevronDown" : "ChevronRight"}
                    size="xs"
                  />
                </button>
              ) : (
                <span className="w-3" />
              )}
              <IdeIcon name={iconName} size="xs" />
              <span className="truncate flex-1 font-sans">{item.label}</span>
              {item.badge && (
                <span className="text-[10px] text-muted px-1 rounded bg-surface-muted">
                  {item.badge}
                </span>
              )}
            </div>

            {isFolder && isExpanded && item.children && item.children.length > 0 && (
              <div id={`${id}-subtree-${item.id}`} className="pl-3">
                <SidebarItemTree
                  id={`${id}-sub-${item.id}`}
                  items={item.children}
                  activeItemId={effectiveActiveId}
                  onSelectItem={handleRowClick}
                  level={level + 1}
                />
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export default SidebarItemTree;
