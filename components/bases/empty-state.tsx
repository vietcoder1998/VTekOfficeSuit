"use client";

import React from "react";
import { SearchX } from "lucide-react";
import { useSafeTranslations } from "./use-safe-translations";

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  /** Custom icon override (default: SearchX) */
  icon?: React.ReactNode;
  /** Optional CTA rendered below description */
  action?: React.ReactNode;
}

/**
 * EmptyState
 * ──────────
 * Shared "no results / no data" block used across pages when list is empty.
 *
 * Usage:
 * ```tsx
 * {list.length === 0 && (
 *   <EmptyState
 *     title="No connections found"
 *     description="Try adjusting your search or filters."
 *   />
 * )}
 * ```
 */
export function EmptyState({
  title,
  description,
  icon,
  action,
  className = "",
  style,
  ...rest
}: EmptyStateProps) {
  const t = useSafeTranslations("components.bases.emptyState", {
    noResults: "Không tìm thấy kết quả",
  });
  const effectiveTitle = title ?? t("noResults", "Không tìm thấy kết quả");

  return (
    <div
      id={rest.id || "base-empty-state"}
      className={`empty-state ${className}`}
      style={style}
      role="status"
      aria-label={effectiveTitle}
      {...rest}
    >
      <div id={`${rest.id || "base-empty-state"}-icon`} className="empty-state__icon">
        {icon ?? <SearchX size={32} strokeWidth={1.5} />}
      </div>
      <p id={`${rest.id || "base-empty-state"}-title`} className="empty-state__title">{effectiveTitle}</p>
      {description && (
        <p id={`${rest.id || "base-empty-state"}-desc`} className="empty-state__description">{description}</p>
      )}
      {action && <div id={`${rest.id || "base-empty-state"}-action`} className="empty-state__action">{action}</div>}
    </div>
  );
}

export { EmptyState as BaseEmptyState };
