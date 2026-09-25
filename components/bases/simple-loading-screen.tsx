"use client";

import React from "react";

export interface SimpleLoadingScreenConfig {
  id: string;
  textId: string;
  label: string;
  route?: string;
  customClass?: string;
}

export interface SimpleLoadingScreenProps {
  /** Canonical DOM ID for container (Rule 13) */
  id?: string;
  /** Canonical DOM ID for centered label (Rule 13) */
  textId?: string;
  /** Text label displayed in the center */
  label?: string;
  /** Route context for automatic label resolution */
  route?: string;
  /** Optional custom CSS class */
  className?: string;
}

/**
 * SimpleLoadingScreen (Section 272)
 *
 * A clean, ultra-minimalist full-screen loading screen with text in center only.
 * Strictly adheres to:
 * - Rule 13: Default semantic kebab-case ID on container & text
 * - Rule 15: Strict user-defined UI (text in center only, zero unsolicited bloat)
 * - Rule 18 & Rule 20: 100% Theme CSS classes, zero inline styles
 */
export function SimpleLoadingScreen({
  id = "simple-loading-screen",
  textId = "simple-loading-text",
  label = "Đang tải...",
  route,
  className = "",
}: SimpleLoadingScreenProps) {
  const containerClasses: string = [
    "simple-loading-screen-container",
    "theme-surface",
    "flex",
    "items-center",
    "justify-center",
    "w-full",
    "h-full",
    "min-h-screen",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      id={id}
      data-testid="simple-loading-screen"
      className={containerClasses}
    >
      <span
        id={textId}
        data-testid="simple-loading-text"
        className="simple-loading-text theme-text font-medium text-sm animate-pulse"
      >
        {label}
      </span>
    </div>
  );
}

export default SimpleLoadingScreen;
