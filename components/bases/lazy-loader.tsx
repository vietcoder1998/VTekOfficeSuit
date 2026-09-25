"use client";

import React, { Suspense } from "react";
import {
  Skeleton,
  CardSkeleton,
  TableSkeleton,
  TextSkeleton,
  PageSkeleton,
  AvatarSkeleton,
} from "./skeleton";

export type LazyFallbackType = "card" | "table" | "text" | "page" | "avatar" | "custom";

export interface LazyBoundaryProps {
  id?: string;
  fallback?: React.ReactNode;
  fallbackType?: LazyFallbackType;
  className?: string;
  children: React.ReactNode;
}

export function LazyBoundary({
  id = "base-lazy-boundary",
  fallback,
  fallbackType = "page",
  className = "",
  children,
}: LazyBoundaryProps): React.JSX.Element {
  const renderDefaultFallback = (): React.ReactNode => {
    switch (fallbackType) {
      case "card":
        return <CardSkeleton id={`${id}-fallback-card`} rows={3} />;
      case "table":
        return <TableSkeleton id={`${id}-fallback-table`} columns={4} rows={5} />;
      case "text":
        return <TextSkeleton id={`${id}-fallback-text`} linesCount={3} />;
      case "avatar":
        return <AvatarSkeleton id={`${id}-fallback-avatar`} size={40} />;
      case "page":
      case "custom":
      default:
        return <PageSkeleton id={`${id}-fallback-page`} />;
    }
  };

  const resolvedFallback: React.ReactNode = fallback !== undefined ? fallback : renderDefaultFallback();

  return (
    <div id={`${id}-container`} className={`lazy-boundary-container ${className}`.trim()} data-testid={id}>
      <Suspense fallback={resolvedFallback}>{children}</Suspense>
    </div>
  );
}

export interface WithLazyLoadOptions {
  id?: string;
  fallback?: React.ReactNode;
  fallbackType?: LazyFallbackType;
  className?: string;
}

export function withLazyLoad<P extends object>(
  Component: React.ComponentType<P>,
  options: WithLazyLoadOptions = {}
): React.FC<P> {
  const LazyWrappedComponent: React.FC<P> = (props: P): React.JSX.Element => {
    const boundaryId: string = options.id || "lazy-wrapped-component";
    return (
      <LazyBoundary
        id={boundaryId}
        fallback={options.fallback}
        fallbackType={options.fallbackType}
        className={options.className}
      >
        <Component {...props} />
      </LazyBoundary>
    );
  };

  LazyWrappedComponent.displayName = `WithLazyLoad(${Component.displayName || Component.name || "Component"})`;

  return LazyWrappedComponent;
}

export {
  LazyBoundary as LazyLoader,
};

export default LazyBoundary;
