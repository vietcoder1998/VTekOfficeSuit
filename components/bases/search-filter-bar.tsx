"use client";

import React, { forwardRef } from "react";
import { Search } from "lucide-react";
import { Input } from "./input";
import { useSafeTranslations } from "./use-safe-translations";

export interface SearchFilterBarProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Controlled search value */
  value: string;
  /** Called on every keystroke */
  onChange: (value: string) => void;
  placeholder?: string;
  /** Width of the search box (default: "220px") */
  width?: string | number;
  /** Size passed to the base Input */
  inputSize?: "xs" | "sm" | "md" | "lg";
  /** Extra data-testid for the underlying input */
  inputTestId?: string;
}

/**
 * SearchFilterBar
 * ───────────────
 * Shared search input used across all dashboard pages.
 * Renders: [🔍 icon] [Input]
 *
 * Usage:
 * ```tsx
 * <SearchFilterBar
 *   value={searchQuery}
 *   onChange={setSearchQuery}
 *   placeholder="Search..."
 * />
 * ```
 */
export const SearchFilterBar = forwardRef<HTMLDivElement, SearchFilterBarProps>(
  (
    {
      value,
      onChange,
      placeholder,
      width = "220px",
      inputSize = "sm",
      inputTestId,
      className = "",
      style,
      ...rest
    },
    ref
  ) => {
    const t = useSafeTranslations("components.bases.searchFilterBar", {
      placeholder: "Tìm kiếm...",
    });
    const effectivePlaceholder = placeholder ?? t("placeholder");

    return (
      <div
        id={rest.id || "search-filter-bar"}
        ref={ref}
        className={`search-filter-bar relative ${className}`}
        style={{ width, ...style }}
        {...rest}
      >
        <Search
          size={13}
          className="search-filter-bar-icon"
        />
        <Input
          variant="unstyled"
          type="text"
          placeholder={effectivePlaceholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          inputSize={inputSize}
          data-testid={inputTestId}
          className="search-filter-bar-input"
        />
      </div>
    );
  }
);

SearchFilterBar.displayName = "SearchFilterBar";
