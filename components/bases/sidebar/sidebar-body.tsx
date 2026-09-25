"use client";

import React from "react";
import { DivCol } from "../div";
import type { SidebarBodyProps } from "./types";

export type { SidebarBodyProps };

/**
 * SidebarBody — Section 484 Standard
 * Composed with Base <DivCol> container with zero inline styles.
 */
export function SidebarBody({
  id = "base-sidebar-body",
  className = "",
  children,
}: SidebarBodyProps) {
  return (
    <DivCol
      id={id}
      data-testid={id}
      className={`base-sidebar-body ${className}`}
    >
      {children}
    </DivCol>
  );
}

export default SidebarBody;
