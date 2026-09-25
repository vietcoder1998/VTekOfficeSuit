"use client";

import React from "react";

export interface PageSectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  /** Icon rendered before the title */
  icon?: React.ReactNode;
  /** Action buttons / controls rendered at the far right */
  actions?: React.ReactNode;
  /** Heading level to render (default: "h2") */
  as?: "h1" | "h2" | "h3";
}

/**
 * PageSectionHeader
 * ─────────────────
 * Shared page / section header block. Renders title + optional description + action slot.
 *
 * Usage:
 * ```tsx
 * <PageSectionHeader
 *   title="SSH Connections"
 *   description="Manage your remote SSH profiles"
 *   icon={<Terminal size={16} />}
 *   actions={<Button size="sm">New Profile</Button>}
 * />
 * ```
 */
export function PageSectionHeader({
  title,
  description,
  icon,
  actions,
  as: HeadingTag = "h2",
  className = "",
  style,
  ...rest
}: PageSectionHeaderProps) {
  return (
    <div
      className={`page-section-header ${className}`}
      style={style}
      {...rest}
    >
      <div className="page-section-header__title-row">
        {icon && <span className="page-section-header__icon">{icon}</span>}
        <HeadingTag className="page-section-header__title">{title}</HeadingTag>
        {actions && (
          <div className="page-section-header__actions">{actions}</div>
        )}
      </div>
      {description && (
        <p className="page-section-header__description">{description}</p>
      )}
    </div>
  );
}

export { PageSectionHeader as BasePageSectionHeader };
