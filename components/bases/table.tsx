"use client";

import React, { forwardRef, useId } from "react";

/**
 * ── BASE TABLE COMPONENTS ──
 * Conforms to Section 269 of standard-specification.md, Rule 13 (Default ID),
 * Rule 18 (Theme Classes) & Rule 20 (All New Components Created With Class).
 */

function formatAutoId(rawId: string, prefix: string): string {
  const clean = rawId.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  return clean ? `${prefix}${clean}` : `${prefix}default`;
}

// ── 1. Table ──
export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  striped?: boolean;
  bordered?: boolean;
  hoverable?: boolean;
  compact?: boolean;
}

export const Table = forwardRef<HTMLTableElement, TableProps>(
  ({ id, className = "", striped, bordered, hoverable, compact, children, ...rest }, ref) => {
    const rawId = useId();
    const effectiveId = id || formatAutoId(rawId, "base-tbl-");

    const classes = [
      "base-table",
      striped ? "base-table-striped" : "",
      bordered ? "base-table-bordered" : "",
      hoverable ? "base-table-hoverable" : "",
      compact ? "base-table-compact" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <table ref={ref} id={effectiveId} className={classes} {...rest}>
        {children}
      </table>
    );
  }
);
Table.displayName = "BaseTable";

// ── 2. Thead ──
export interface TheadProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

export const Thead = forwardRef<HTMLTableSectionElement, TheadProps>(
  ({ id, className = "", children, ...rest }, ref) => {
    const rawId = useId();
    const effectiveId = id || formatAutoId(rawId, "base-thd-");
    const classes = ["base-thead", className].filter(Boolean).join(" ");

    return (
      <thead ref={ref} id={effectiveId} className={classes} {...rest}>
        {children}
      </thead>
    );
  }
);
Thead.displayName = "BaseThead";

// ── 3. Tbody ──
export interface TbodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

export const Tbody = forwardRef<HTMLTableSectionElement, TbodyProps>(
  ({ id, className = "", children, ...rest }, ref) => {
    const rawId = useId();
    const effectiveId = id || formatAutoId(rawId, "base-tbd-");
    const classes = ["base-tbody", className].filter(Boolean).join(" ");

    return (
      <tbody ref={ref} id={effectiveId} className={classes} {...rest}>
        {children}
      </tbody>
    );
  }
);
Tbody.displayName = "BaseTbody";

// ── 4. Tr ──
export interface TrProps extends React.HTMLAttributes<HTMLTableRowElement> {
  isSelected?: boolean;
  isHighlighted?: boolean;
}

export const Tr = forwardRef<HTMLTableRowElement, TrProps>(
  ({ id, className = "", isSelected, isHighlighted, children, ...rest }, ref) => {
    const rawId = useId();
    const effectiveId = id || formatAutoId(rawId, "base-tr-");
    const classes = [
      "base-tr",
      isSelected ? "is-selected" : "",
      isHighlighted ? "is-highlighted" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <tr ref={ref} id={effectiveId} className={classes} {...rest}>
        {children}
      </tr>
    );
  }
);
Tr.displayName = "BaseTr";

// ── 5. Th ──
export interface ThProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  alignContent?: "left" | "center" | "right";
}

export const Th = forwardRef<HTMLTableCellElement, ThProps>(
  ({ id, className = "", alignContent, children, ...rest }, ref) => {
    const rawId = useId();
    const effectiveId = id || formatAutoId(rawId, "base-th-");
    const classes = [
      "base-th",
      alignContent ? `text-${alignContent}` : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <th ref={ref} id={effectiveId} className={classes} {...rest}>
        {children}
      </th>
    );
  }
);
Th.displayName = "BaseTh";

// ── 6. Td ──
export interface TdProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  alignContent?: "left" | "center" | "right";
}

export const Td = forwardRef<HTMLTableCellElement, TdProps>(
  ({ id, className = "", alignContent, children, ...rest }, ref) => {
    const rawId = useId();
    const effectiveId = id || formatAutoId(rawId, "base-td-");
    const classes = [
      "base-td",
      alignContent ? `text-${alignContent}` : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <td ref={ref} id={effectiveId} className={classes} {...rest}>
        {children}
      </td>
    );
  }
);
Td.displayName = "BaseTd";

// ── 7. Tfoot ──
export interface TfootProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

export const Tfoot = forwardRef<HTMLTableSectionElement, TfootProps>(
  ({ id, className = "", children, ...rest }, ref) => {
    const rawId = useId();
    const effectiveId = id || formatAutoId(rawId, "base-tft-");
    const classes = ["base-tfoot", className].filter(Boolean).join(" ");

    return (
      <tfoot ref={ref} id={effectiveId} className={classes} {...rest}>
        {children}
      </tfoot>
    );
  }
);
Tfoot.displayName = "BaseTfoot";

// ── Canonical Aliases ──
export {
  Table as BaseTable,
  Thead as BaseThead,
  Tbody as BaseTbody,
  Tr as BaseTr,
  Th as BaseTh,
  Td as BaseTd,
  Tfoot as BaseTfoot,
  Thead as TableHead,
  Thead as TableHeader,
  Tbody as TableBody,
  Tr as TableRow,
  Th as TableHeadCell,
  Th as TableHeaderCell,
  Td as TableCell,
  Tfoot as TableFooter,
};
