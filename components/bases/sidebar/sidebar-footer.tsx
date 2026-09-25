"use client";

import React from "react";
import { DivRow } from "../div";
import type { SidebarFooterProps } from "./types";

export type { SidebarFooterProps };

/**
 * SidebarFooter — Section 484 Standard
 * Composed with Base <DivRow> container with zero inline styles.
 */
export function SidebarFooter({
  id = "base-sidebar-footer",
  className = "",
  children,
}: SidebarFooterProps) {
  return (
    <DivRow
      id={id}
      data-testid={id}
      className={`base-sidebar-footer ${className}`}
    >
      {children}
    </DivRow>
  );
}

export default SidebarFooter;
