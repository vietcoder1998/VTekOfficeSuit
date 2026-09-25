"use client";

import React, { useId } from "react";
import { IdeIcon } from "./ide-icon";

export interface TreeItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onToggle"> {
  id?: string;
  label: React.ReactNode;
  icon?: string;
  iconColor?: string;
  iconSize?: number;
  iconElement?: React.ReactNode;
  iconTestId?: string;
  level?: number;
  isFolder?: boolean;
  isExpanded?: boolean;
  isActive?: boolean;
  isSelected?: boolean;
  badge?: React.ReactNode;
  rightElement?: React.ReactNode;
  actions?: React.ReactNode;
  onToggle?: (e: React.MouseEvent) => void;
  onToggleExpand?: (e: React.MouseEvent) => void;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  className?: string;
  testId?: string;
  "data-testid"?: string;
  chevronId?: string;
  chevronTestId?: string;
  chevronClassName?: string;
  chevronAsButton?: boolean;
  chevronTitle?: string;
  chevronAriaLabel?: string;
  chevronSize?: number;
  chevronColor?: string;
  chevronIconClassName?: string;
  leftWrapId?: string;
  rightWrapId?: string;
  labelId?: string;
  labelTestId?: string;
  labelClassName?: string;
  labelTitle?: string;
  showLeafSpacer?: boolean;
}

/**
 * Base TreeItem Component ("All for Common")
 * Follows IDE Standard Theme, 100% IdeIcon, Semantic IDs on all elements.
 * Encapsulates standard tree-item design from bases components.
 */
export const TreeItem = React.memo(function TreeItem({
  id,
  label,
  icon,
  iconColor,
  iconSize,
  iconElement,
  iconTestId,
  level = 0,
  isFolder = false,
  isExpanded = false,
  isActive = false,
  isSelected = false,
  badge,
  rightElement,
  actions,
  onToggle,
  onToggleExpand,
  onClick,
  className = "",
  testId,
  "data-testid": dataTestId,
  chevronId,
  chevronTestId,
  chevronClassName,
  chevronAsButton = false,
  chevronTitle,
  chevronAriaLabel,
  chevronSize = 11,
  chevronColor,
  chevronIconClassName,
  leftWrapId,
  rightWrapId,
  labelId,
  labelTestId,
  labelClassName,
  labelTitle,
  showLeafSpacer = true,
  children,
  ...restProps
}: TreeItemProps) {
  const generatedId = useId().replace(/:/g, "");
  const effectiveId = id || `base-tree-item-${generatedId}`;
  const effectiveActive = isActive || isSelected;
  const levelClass = level > 0 ? `layer-tree-level-${level}` : "layer-tree-level-0";
  const effectiveRightElement = actions || rightElement;
  const handleToggle = onToggle || onToggleExpand;
  const ChevronComponent = chevronAsButton ? "button" : "span";

  return (
    <div
      id={effectiveId}
      data-testid={dataTestId || testId || effectiveId}
      data-active={effectiveActive ? "true" : undefined}
      data-selected={effectiveActive ? "true" : undefined}
      data-tree-focused={effectiveActive ? "true" : undefined}
      role={isFolder ? "group" : "treeitem"}
      aria-expanded={isFolder ? isExpanded : undefined}
      aria-selected={effectiveActive}
      onClick={onClick}
      className={`base-div base-div-row base-container-row base-container-align-center tree-item ${levelClass} base-sidebar-tree-item-row font-sans flex items-center justify-between py-1 px-1.5 rounded cursor-pointer select-none transition-colors text-xs ${
        effectiveActive
          ? "is-active active bg-primary/10 border border-primary/30 text-primary font-medium"
          : "hover:bg-muted/10 theme-text-muted hover:theme-text"
      } ${className}`.trim()}
      {...restProps}
    >
      <div id={leftWrapId || `${effectiveId}-left-wrap`} className="flex items-center gap-1.5 min-w-0 flex-1">
        {isFolder ? (
          <ChevronComponent
            type={chevronAsButton ? "button" : undefined}
            id={chevronId || `${effectiveId}-toggle-chevron`}
            data-testid={chevronTestId || chevronId || `${effectiveId}-toggle-chevron`}
            title={chevronTitle}
            aria-label={chevronAriaLabel}
            className={
              chevronClassName ||
              `inline-flex items-center justify-center p-0.5 rounded hover:bg-black/5 dark:hover:bg-white/10 shrink-0 ${
                isExpanded ? "rotated" : ""
              }`
            }
            onClick={(e: React.MouseEvent) => {
              if (handleToggle) {
                e.stopPropagation();
                handleToggle(e);
              }
            }}
          >
            <IdeIcon
              name={isExpanded ? "ChevronDown" : "ChevronRight"}
              size={chevronSize}
              color={chevronColor || "var(--text-muted, #64748b)"}
              className={chevronIconClassName}
            />
          </ChevronComponent>
        ) : showLeafSpacer ? (
          <span id={`${effectiveId}-leaf-spacer`} className="w-3 shrink-0" />
        ) : null}

        {iconElement ? (
          iconElement
        ) : icon ? (
          <IdeIcon
            id={iconTestId ? `${effectiveId}-icon` : undefined}
            data-testid={iconTestId}
            name={icon as any}
            size={iconSize || 12}
            color={iconColor || (effectiveActive ? "var(--primary, #6938ef)" : undefined)}
          />
        ) : null}

        {typeof label === "string" ? (
          <span
            id={labelId || `${effectiveId}-label`}
            data-testid={labelTestId}
            title={labelTitle || (typeof label === "string" ? label : undefined)}
            className={`truncate flex-1 font-sans tree-label ${labelClassName || ""}`.trim()}
          >
            {label}
          </span>
        ) : (
          <div
            id={labelId || `${effectiveId}-label-wrap`}
            data-testid={labelTestId}
            title={labelTitle}
            className={`truncate flex-1 flex items-center min-w-0 font-sans tree-label ${labelClassName || ""}`.trim()}
          >
            {label}
          </div>
        )}
      </div>

      {(badge || effectiveRightElement) && (
        <div id={rightWrapId || `${effectiveId}-right-wrap`} className="flex items-center gap-1 shrink-0 ml-1">
          {badge}
          {effectiveRightElement}
        </div>
      )}
      {children}
    </div>
  );
});
