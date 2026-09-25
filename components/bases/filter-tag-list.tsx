"use client";

import React from "react";

export interface FilterTagListProps extends React.HTMLAttributes<HTMLDivElement> {
  /** List of tag labels */
  tags: string[];
  /** Currently active tag */
  activeTag: string;
  /** Called when a tag is clicked */
  onTagChange: (tag: string) => void;
  /** Label shown for the "show all" option (default: "All") */
  allLabel?: string;
  /** Value used as the "all" sentinel (default: "all") */
  allValue?: string;
}

/**
 * FilterTagList
 * ─────────────
 * Shared chip/pill filter row used across pages to filter list items by category/tag.
 *
 * Usage:
 * ```tsx
 * <FilterTagList
 *   tags={["pending", "running", "done"]}
 *   activeTag={filterTag}
 *   onTagChange={setFilterTag}
 * />
 * ```
 */
export function FilterTagList({
  tags,
  activeTag,
  onTagChange,
  allLabel = "All",
  allValue = "all",
  className = "",
  style,
  ...rest
}: FilterTagListProps) {
  const allTags = [allValue, ...tags];
  const labelFor = (t: string) => (t === allValue ? allLabel : t);

  return (
    <div className={`filter-tag-list ${className}`} style={style} {...rest}>
      {allTags.map((tag) => {
        const isActive = tag === activeTag;
        return (
          <button
            key={tag}
            type="button"
            onClick={() => onTagChange(tag)}
            className={`filter-tag-list__chip ${isActive ? "active" : ""}`}
            data-tag={tag}
            aria-pressed={isActive}
          >
            {labelFor(tag)}
          </button>
        );
      })}
    </div>
  );
}

export { FilterTagList as BaseFilterTagList };
