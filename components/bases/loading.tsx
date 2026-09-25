"use client";

import React from "react";
import { Loader2 } from "lucide-react";

export type SpinnerSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface SpinnerProps {
  size?: SpinnerSize;
  color?: string;
  className?: string;
}

export function Spinner({
  size = "md",
  color,
  className = "",
}: SpinnerProps) {
  const pixelSize =
    size === "xs" ? 12 : size === "sm" ? 16 : size === "lg" ? 24 : size === "xl" ? 32 : 20;

  return (
    <Loader2
      id="base-spinner-icon"
      size={pixelSize}
      className={`animate-spin vtek-spinner-icon ${className}`}
      style={color ? { color } : undefined}
      data-testid="base-spinner"
    />
  );
}

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: number | string;
  height?: number | string;
  borderRadius?: number | string;
}

export function Skeleton({
  id = "base-skeleton-loader",
  width = "100%",
  height = "16px",
  borderRadius = "4px",
  className = "",
  style,
  ...rest
}: SkeletonProps) {
  return (
    <div
      id={id}
      className={`vtek-skeleton-shimmer ${className}`}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
        borderRadius: typeof borderRadius === "number" ? `${borderRadius}px` : borderRadius,
        ...style,
      }}
      data-testid="base-skeleton"
      {...rest}
    />
  );
}

export function DotsLoader({ id = "base-dots-loader", className = "" }: { id?: string; className?: string }) {
  return (
    <div
      id={id}
      className={`vtek-dots-loader vtek-dots-pulse ${className}`}
      data-testid="base-dots-loader"
    >
      <span id={`${id}-dot-1`} className="dot" />
      <span id={`${id}-dot-2`} className="dot" />
      <span id={`${id}-dot-3`} className="dot" />
    </div>
  );
}

export {
  Spinner as BaseSpinner,
  Skeleton as BaseSkeleton,
  DotsLoader as BaseDots,
  Spinner as Loading,
};

export {
  TextSkeleton,
  AvatarSkeleton,
  CardSkeleton,
  TableSkeleton,
  PageSkeleton,
} from "./skeleton";
export type {
  TextSkeletonProps,
  AvatarSkeletonProps,
  CardSkeletonProps,
  TableSkeletonProps,
  PageSkeletonProps,
} from "./skeleton";

export {
  LazyBoundary,
  LazyLoader,
  withLazyLoad,
} from "./lazy-loader";

export default Spinner;
