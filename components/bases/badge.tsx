"use client";

import React from "react";

export type BadgeVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "success"
  | "warning"
  | "danger"
  | "neutral"
  | "default"
  | "unstyled"
  | "none";

export type BadgeSize = "xs" | "sm" | "md" | "lg" | "none";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: React.ReactNode;
  suppressHydrationWarning?: boolean;
}

export function Badge({
  variant = "neutral",
  size = "sm",
  icon,
  className = "",
  children,
  suppressHydrationWarning = true,
  ...rest
}: BadgeProps) {
  const isUnstyled: boolean = variant === "unstyled" || variant === "none";
  const variantClass: string = isUnstyled ? "" : `base-badge-${variant}`;
  const sizeClass: string = isUnstyled || size === "none" ? "" : `base-badge-${size}`;
  const baseClass: string = isUnstyled ? "" : "base-badge";
  const combined: string = [baseClass, variantClass, sizeClass, className]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={combined} suppressHydrationWarning={suppressHydrationWarning} {...rest}>
      {icon}
      {children}
    </span>
  );
}

export { Badge as BaseBadge };
