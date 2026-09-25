"use client";

import { Badge } from "../badge";
import { Button } from "../button";
import { DivBetween, DivRow } from "../div";
import { IdeIcon } from "../ide-icon";
import type { BaseSidebarHeaderProps, SidebarHeaderProps } from "./types";

export type { BaseSidebarHeaderProps, SidebarHeaderProps };

/**
 * SidebarHeader / BaseSidebarHeader — Section 484 Standard
 *
 * Header component for left sidebars, detail panels, and folder tree headers.
 * Composed entirely with Base components (<DivBetween>, <DivRow>, <Button>, <IdeIcon>, <Badge>)
 * with zero forbidden static inline styles (Rule 18 & 20) and semantic kebab-case IDs (Rule 13).
 */
export function SidebarHeader({
  id = "base-sidebar-header",
  className = "",
  title,
  icon,
  badge,
  actions,
  onClose,
  closeAriaLabel = "Đóng thanh bên",
  closeButtonId,
  isFolder = false,
  isExpanded = false,
  onToggle,
  level = 0,
  children,
  onClick,
  style,
}: SidebarHeaderProps) {
  const headerClasses: string = [
    "base-sidebar-header",
    "sidebar-header",
    isFolder ? "is-folder" : "",
    isExpanded ? "is-expanded" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const resolvedIcon = icon
    ? icon
    : isFolder
    ? (isExpanded ? "FolderOpen" : "Folder")
    : undefined;

  // Custom composition mode: if only children are supplied without structured header props
  if (children && !title && !icon && !badge && !actions && !onClose && !isFolder) {
    return (
      <DivBetween
        id={id}
        data-testid={id}
        className={headerClasses}
        onClick={onClick}
        style={style}
      >
        {children}
      </DivBetween>
    );
  }

  // Structured Base components composition mode
  return (
    <DivBetween
      id={id}
      data-testid={id}
      className={headerClasses}
      onClick={onClick}
      role={isFolder ? "button" : undefined}
      aria-expanded={isFolder ? isExpanded : undefined}
      data-level={level > 0 ? level : undefined}
      style={style}
    >
      <DivRow
        id={`${id}-title-group`}
        data-testid={`${id}-title-group`}
        className="base-sidebar-title min-w-0 flex-1 items-center gap-1.5"
      >
        {isFolder && onToggle && (
          <Button
            type="button"
            id={`${id}-toggle-btn`}
            data-testid={`${id}-toggle-btn`}
            variant="ghost"
            size="xs"
            className="base-sidebar-header-toggle-btn p-0.5"
            onClick={(e) => {
              e.stopPropagation();
              onToggle(e);
            }}
            aria-label={isExpanded ? "Thu gọn" : "Mở rộng"}
          >
            <IdeIcon
              name={isExpanded ? "ChevronDown" : "ChevronRight"}
              size="xs"
            />
          </Button>
        )}

        {resolvedIcon && (
          <IdeIcon
            name={resolvedIcon}
            size="sm"
            color="var(--primary, #6938ef)"
          />
        )}

        {title && (
          <span
            id={`${id}-title-text`}
            data-testid={`${id}-title-text`}
            className="truncate font-semibold text-xs theme-text text-text"
          >
            {title}
          </span>
        )}

        {badge &&
          (typeof badge === "string" || typeof badge === "number" ? (
            <Badge
              id={`${id}-badge`}
              data-testid={`${id}-badge`}
              variant="secondary"
              size="xs"
            >
              {badge}
            </Badge>
          ) : (
            badge
          ))}
      </DivRow>

      {(actions || onClose || children) && (
        <DivRow
          id={`${id}-header-actions`}
          data-testid={`${id}-header-actions`}
          className="flex items-center gap-1 shrink-0"
        >
          {actions}
          {children}
          {onClose && (
            <Button
              type="button"
              id={closeButtonId || `${id}-close-btn`}
              data-testid={closeButtonId || `${id}-close-btn`}
              variant="ghost"
              size="xs"
              onClick={(e) => {
                e.stopPropagation();
                onClose(e);
              }}
              title={closeAriaLabel}
              aria-label={closeAriaLabel}
            >
              <IdeIcon name="X" size="xs" />
            </Button>
          )}
        </DivRow>
      )}
    </DivBetween>
  );
}

export const BaseSidebarHeader = SidebarHeader;
export default SidebarHeader;
