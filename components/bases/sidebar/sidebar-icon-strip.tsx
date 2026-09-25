"use client";

import React from "react";
import { Button } from "../button";
import { IdeIcon } from "../ide-icon";
import { DivCol } from "../div";
import type { SidebarIconStripProps, SidebarIconStripItem } from "./types";

export type { SidebarIconStripProps, SidebarIconStripItem };

/**
 * SidebarIconStrip — Section 484 Standard
 * 44px Icon Activity Bar composed with Base <Button> and Base <IdeIcon>.
 */
export function SidebarIconStrip({
  id = "base-sidebar-icon-strip",
  items = [],
  activeItemId,
  onItemSelect,
  topContent,
  bottomContent,
  children,
  className = "",
}: SidebarIconStripProps) {
  return (
    <aside
      id={id}
      data-testid={id}
      role="toolbar"
      aria-orientation="vertical"
      aria-label="Sidebar Icon Strip"
      className={`base-sidebar-icon-strip ${className}`}
    >
      <DivCol
        id={`${id}-top-section`}
        data-testid={`${id}-top-section`}
        className="base-sidebar-icon-strip-top"
      >
        {topContent}
        {items.map((item) => {
          const isActive =
            item.isActive !== undefined ? item.isActive : activeItemId === item.id;
          const tooltip = item.shortcut ? `${item.label} (${item.shortcut})` : item.label;

          return (
            <div
              key={item.id}
              id={`${id}-wrapper-${item.id}`}
              className="relative w-full flex justify-center"
            >
              {isActive && (
                <span
                  id={`${id}-indicator-${item.id}`}
                  data-testid={`${id}-indicator-${item.id}`}
                  className="base-sidebar-active-indicator"
                />
              )}
              <Button
                id={`${id}-btn-${item.id}`}
                data-testid={`${id}-btn-${item.id}`}
                variant={isActive ? "secondary" : "ghost"}
                size="sm"
                className={`base-sidebar-icon-btn ${
                  isActive
                    ? "base-sidebar-icon-btn-active"
                    : "base-sidebar-icon-btn-inactive"
                }`}
                title={tooltip}
                aria-label={item.label}
                aria-pressed={isActive}
                onClick={() => {
                  item.onClick?.();
                  onItemSelect?.(item.id);
                }}
              >
                <IdeIcon name={item.icon} size="md" />
              </Button>
            </div>
          );
        })}
      </DivCol>

      {children && (
        <div id={`${id}-middle-section`} className="flex-1 w-full overflow-y-auto">
          {children}
        </div>
      )}

      {bottomContent && (
        <DivCol
          id={`${id}-bottom-section`}
          data-testid={`${id}-bottom-section`}
          className="base-sidebar-icon-strip-bottom"
        >
          {bottomContent}
        </DivCol>
      )}
    </aside>
  );
}

export default SidebarIconStrip;
