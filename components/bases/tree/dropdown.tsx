"use client";

import React, { useState, useCallback, useId } from "react";
import { TreeItem } from "../tree-item";
import { DivCol } from "../div";

export interface TreeDropdownProps {
  id?: string;
  label: React.ReactNode;
  icon?: string;
  iconColor?: string;
  iconSize?: number;
  iconElement?: React.ReactNode;
  level?: number;
  isExpanded?: boolean;
  defaultExpanded?: boolean;
  isActive?: boolean;
  isSelected?: boolean;
  badge?: React.ReactNode;
  rightElement?: React.ReactNode;
  actions?: React.ReactNode;
  onToggle?: (expanded: boolean, e: React.MouseEvent) => void;
  onToggleExpand?: (e: React.MouseEvent) => void;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  headerId?: string;
  headerTestId?: string;
  headerDataTestId?: string;
  childrenId?: string;
  childrenTestId?: string;
  childrenDataTestId?: string;
  className?: string;
  headerClassName?: string;
  childrenClassName?: string;
  testId?: string;
  "data-testid"?: string;
  title?: string;
  headerTitle?: string;
  chevronId?: string;
  chevronTestId?: string;
  chevronClassName?: string;
  chevronSize?: number;
  chevronColor?: string;
  dataVersion?: string;
  "data-version"?: string;
  dataActive?: boolean | string;
  "data-active"?: boolean | string;
  dataSelected?: boolean | string;
  "data-selected"?: boolean | string;
  dataTreeFocused?: boolean | string;
  "data-tree-focused"?: boolean | string;
  dataConfigsLoaded?: boolean | string;
  "data-configs-loaded"?: boolean | string;
  dataLoadedCount?: number | string;
  "data-loaded-count"?: number | string;
  onDragOver?: React.DragEventHandler<HTMLDivElement>;
  onDrop?: React.DragEventHandler<HTMLDivElement>;
  children?: React.ReactNode;
  items?: React.ReactNode[];
}

/**
 * Base TreeDropdown Component — Section 853 & Section 876
 * Standard collapsible tree dropdown container wrapping canonical Base TreeItem for the header
 * and standard Base DivCol for children dropdown items.
 * Ensures zero inline styles, 100% Base styling, semantic IDs, and theme tokens.
 */
export const TreeDropdown = React.memo(function TreeDropdown({
  id,
  label,
  icon,
  iconColor,
  iconSize,
  iconElement,
  level = 0,
  isExpanded: controlledExpanded,
  defaultExpanded = false,
  isActive = false,
  isSelected = false,
  badge,
  rightElement,
  actions,
  onToggle,
  onToggleExpand,
  onClick,
  headerId,
  headerTestId,
  headerDataTestId,
  childrenId,
  childrenTestId,
  childrenDataTestId,
  className = "",
  headerClassName = "",
  childrenClassName = "",
  testId,
  "data-testid": dataTestId,
  title,
  headerTitle,
  chevronId,
  chevronTestId,
  chevronClassName,
  chevronSize,
  chevronColor,
  dataVersion,
  "data-version": propDataVersion,
  dataActive,
  "data-active": propDataActive,
  dataSelected,
  "data-selected": propDataSelected,
  dataTreeFocused,
  "data-tree-focused": propDataTreeFocused,
  dataConfigsLoaded,
  "data-configs-loaded": propDataConfigsLoaded,
  dataLoadedCount,
  "data-loaded-count": propDataLoadedCount,
  onDragOver,
  onDrop,
  children,
  items,
}: TreeDropdownProps) {
  const autoId: string = useId().replace(/:/g, "");
  const effectiveId: string = id || `base-tree-dropdown-${autoId}`;

  const [internalExpanded, setInternalExpanded] = useState<boolean>(defaultExpanded);
  const isControlled: boolean = controlledExpanded !== undefined;
  const effectiveExpanded: boolean = isControlled ? Boolean(controlledExpanded) : internalExpanded;

  const handleToggle = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      const nextExpanded: boolean = !effectiveExpanded;
      if (!isControlled) {
        setInternalExpanded(nextExpanded);
      }
      onToggle?.(nextExpanded, e);
      onToggleExpand?.(e);
    },
    [effectiveExpanded, isControlled, onToggle, onToggleExpand]
  );

  const effectiveHeaderId: string = headerId || `${effectiveId}-header`;
  const effectiveChildrenId: string = childrenId || `${effectiveId}-children`;
  const effectiveTestId: string = dataTestId || testId || effectiveId;
  const effectiveHeaderTestId: string =
    headerDataTestId ||
    headerTestId ||
    (headerId ? headerId : `${effectiveTestId}-header`);
  const effectiveChildrenTestId: string =
    childrenDataTestId ||
    childrenTestId ||
    (childrenId ? childrenId : `${effectiveTestId}-children`);

  const resolvedDataVersion: string | undefined = dataVersion || propDataVersion;
  const resolvedDataActive: string | undefined =
    dataActive !== undefined ? String(dataActive) : propDataActive !== undefined ? String(propDataActive) : undefined;
  const resolvedDataSelected: string | undefined =
    dataSelected !== undefined ? String(dataSelected) : propDataSelected !== undefined ? String(propDataSelected) : undefined;
  const resolvedDataTreeFocused: string | undefined =
    dataTreeFocused !== undefined ? String(dataTreeFocused) : propDataTreeFocused !== undefined ? String(propDataTreeFocused) : undefined;
  const resolvedDataConfigsLoaded: string | undefined =
    dataConfigsLoaded !== undefined ? String(dataConfigsLoaded) : propDataConfigsLoaded !== undefined ? String(propDataConfigsLoaded) : undefined;
  const resolvedDataLoadedCount: string | undefined =
    dataLoadedCount !== undefined ? String(dataLoadedCount) : propDataLoadedCount !== undefined ? String(propDataLoadedCount) : undefined;

  return (
    <DivCol
      id={effectiveId}
      data-testid={effectiveTestId}
      data-version={resolvedDataVersion}
      data-active={resolvedDataActive}
      data-selected={resolvedDataSelected}
      data-tree-focused={resolvedDataTreeFocused}
      className={`tree-dropdown base-tree-dropdown w-full ${className}`.trim()}
    >
      <TreeItem
        id={effectiveHeaderId}
        data-testid={effectiveHeaderTestId}
        level={level}
        isFolder={true}
        isExpanded={effectiveExpanded}
        isActive={isActive}
        isSelected={isSelected}
        icon={icon}
        iconColor={iconColor}
        iconSize={iconSize}
        iconElement={iconElement}
        label={label}
        badge={badge}
        rightElement={rightElement}
        actions={actions}
        title={headerTitle || title}
        chevronId={chevronId}
        chevronTestId={chevronTestId}
        chevronClassName={chevronClassName}
        chevronSize={chevronSize}
        chevronColor={chevronColor}
        data-configs-loaded={resolvedDataConfigsLoaded}
        data-loaded-count={resolvedDataLoadedCount}
        onClick={onClick}
        onToggle={handleToggle}
        onToggleExpand={handleToggle}
        className={`tree-dropdown-header ${headerClassName}`.trim()}
      />

      {effectiveExpanded && (children || (items && items.length > 0)) && (
        <DivCol
          id={effectiveChildrenId}
          data-testid={effectiveChildrenTestId}
          className={`tree-dropdown-children w-full ${childrenClassName}`.trim()}
          onDragOver={onDragOver}
          onDrop={onDrop}
        >
          {children || items}
        </DivCol>
      )}
    </DivCol>
  );
});
