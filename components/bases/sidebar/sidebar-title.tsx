"use client";

import React from "react";
import { DivRow } from "../div";
import { IdeIcon } from "../ide-icon";
import type { SidebarTitleProps } from "./types";

export type { SidebarTitleProps };

/**
 * SidebarTitle — Section 484 Standard
 * Composed with Base <DivRow> and Base <IdeIcon> with zero inline styles.
 */
export function SidebarTitle({
  id = "base-sidebar-title",
  icon,
  children,
  className = "",
}: SidebarTitleProps) {
  return (
    <DivRow
      id={id}
      data-testid={id}
      className={`base-sidebar-title ${className}`}
    >
      {icon && <IdeIcon name={icon} size="sm" />}
      <span id={`${id}-text`} data-testid={`${id}-text`}>
        {children}
      </span>
    </DivRow>
  );
}

export default SidebarTitle;
