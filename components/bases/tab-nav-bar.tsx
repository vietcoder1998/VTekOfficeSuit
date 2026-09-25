"use client";

import React from "react";

export interface TabNavItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  count?: number;
}

export interface TabNavBarProps extends React.HTMLAttributes<HTMLDivElement> {
  tabs: TabNavItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  /** Visual style variant */
  variant?: "underline" | "pill" | "subtle";
  size?: "xs" | "sm" | "md";
}

/**
 * TabNavBar
 * ─────────
 * Shared horizontal tab navigator used across all dashboard pages.
 *
 * Usage:
 * ```tsx
 * <TabNavBar
 *   tabs={[{ id: "overview", label: "Overview" }, { id: "logs", label: "Logs" }]}
 *   activeTab={activeTab}
 *   onTabChange={setActiveTab}
 * />
 * ```
 */
export function TabNavBar({
  tabs,
  activeTab,
  onTabChange,
  variant = "underline",
  size = "sm",
  className = "",
  style,
  ...rest
}: TabNavBarProps) {
  const sizeClass =
    size === "xs" ? "tab-nav-bar--xs" : size === "md" ? "tab-nav-bar--md" : "tab-nav-bar--sm";
  const variantClass = `tab-nav-bar--${variant}`;

  return (
    <div
      className={`tab-nav-bar ${variantClass} ${sizeClass} ${className}`}
      style={style}
      {...rest}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`tab-nav-bar__tab ${isActive ? "active" : ""}`}
            data-tab-id={tab.id}
            aria-selected={isActive}
            role="tab"
          >
            {tab.icon && <span className="tab-nav-bar__tab-icon">{tab.icon}</span>}
            <span className="tab-nav-bar__tab-label">{tab.label}</span>
            {tab.count !== undefined && (
              <span className="tab-nav-bar__tab-count">{tab.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export { TabNavBar as BaseTabNavBar };
