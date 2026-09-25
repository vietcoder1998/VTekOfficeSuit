"use client";

import React, { forwardRef, useId } from "react";

/**
 * ── BASE HEADING COMPONENTS (H1 - H6) ──
 * Conforms to Section 269 of standard-specification.md, Rule 13 (Default ID),
 * Rule 18 (Theme Classes) & Rule 20 (All New Components Created With Class).
 */

function formatAutoId(rawId: string, prefix: string): string {
  const clean = rawId.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  return clean ? `${prefix}${clean}` : `${prefix}default`;
}

export type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
export type HeadingSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "none";
export type HeadingWeight = "normal" | "medium" | "semibold" | "bold";

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: HeadingTag;
  size?: HeadingSize;
  weight?: HeadingWeight;
  muted?: boolean;
}

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ as: Component = "h2", size, weight, muted, id, className = "", children, ...rest }, ref) => {
    const rawId = useId();
    const effectiveId = id || formatAutoId(rawId, `base-${Component}-`);

    const classes = [
      "base-heading",
      `base-${Component}`,
      size && size !== "none" ? `heading-${size}` : "",
      weight ? `font-${weight}` : "",
      muted ? "theme-text-muted" : "theme-text",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <Component ref={ref as any} id={effectiveId} className={classes} {...rest}>
        {children}
      </Component>
    );
  }
);
Heading.displayName = "BaseHeading";

export interface SubHeadingProps extends Omit<HeadingProps, "as"> {}

export const H1 = forwardRef<HTMLHeadingElement, SubHeadingProps>((props, ref) => (
  <Heading ref={ref} as="h1" {...props} />
));
H1.displayName = "BaseH1";

export const H2 = forwardRef<HTMLHeadingElement, SubHeadingProps>((props, ref) => (
  <Heading ref={ref} as="h2" {...props} />
));
H2.displayName = "BaseH2";

export const H3 = forwardRef<HTMLHeadingElement, SubHeadingProps>((props, ref) => (
  <Heading ref={ref} as="h3" {...props} />
));
H3.displayName = "BaseH3";

export const H4 = forwardRef<HTMLHeadingElement, SubHeadingProps>((props, ref) => (
  <Heading ref={ref} as="h4" {...props} />
));
H4.displayName = "BaseH4";

export const H5 = forwardRef<HTMLHeadingElement, SubHeadingProps>((props, ref) => (
  <Heading ref={ref} as="h5" {...props} />
));
H5.displayName = "BaseH5";

export const H6 = forwardRef<HTMLHeadingElement, SubHeadingProps>((props, ref) => (
  <Heading ref={ref} as="h6" {...props} />
));
H6.displayName = "BaseH6";

// ── Canonical Aliases ──
export {
  Heading as BaseHeading,
  H1 as BaseH1,
  H2 as BaseH2,
  H3 as BaseH3,
  H4 as BaseH4,
  H5 as BaseH5,
  H6 as BaseH6,
};
