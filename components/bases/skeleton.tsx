"use client";

import React from "react";

export type SkeletonVariant = "rectangular" | "text" | "avatar" | "card" | "button";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  id?: string;
  variant?: SkeletonVariant;
  width?: number | string;
  height?: number | string;
  borderRadius?: number | string;
  className?: string;
  ariaLabel?: string;
}

export function Skeleton({
  id = "base-skeleton-loader",
  variant = "rectangular",
  width,
  height,
  borderRadius,
  className = "",
  ariaLabel = "Loading...",
  style,
  ...restProps
}: SkeletonProps): React.JSX.Element {
  const variantClassMap: Record<SkeletonVariant, string> = {
    rectangular: "",
    text: "skeleton-text",
    avatar: "skeleton-avatar",
    card: "skeleton-card",
    button: "skeleton-button",
  };

  const computedVariantClass: string = variantClassMap[variant] || "";

  const dynamicStyles: React.CSSProperties = {
    ...(width !== undefined ? { width: typeof width === "number" ? `${width}px` : width } : {}),
    ...(height !== undefined ? { height: typeof height === "number" ? `${height}px` : height } : {}),
    ...(borderRadius !== undefined ? { borderRadius: typeof borderRadius === "number" ? `${borderRadius}px` : borderRadius } : {}),
    ...style,
  };

  return (
    <div
      id={id}
      role="status"
      aria-label={ariaLabel}
      className={`vtek-skeleton-shimmer ${computedVariantClass} ${className}`.trim()}
      style={Object.keys(dynamicStyles).length > 0 ? dynamicStyles : undefined}
      data-testid={id}
      {...restProps}
    />
  );
}

export interface TextSkeletonProps {
  id?: string;
  linesCount?: number;
  className?: string;
}

export function TextSkeleton({
  id = "base-text-skeleton",
  linesCount = 3,
  className = "",
}: TextSkeletonProps): React.JSX.Element {
  const lineIndices: number[] = Array.from({ length: linesCount }, (_item: unknown, index: number): number => index);

  return (
    <div id={`${id}-container`} className={`skeleton-text-container ${className}`.trim()} role="status" aria-label="Loading text...">
      {lineIndices.map((lineIndex: number): React.JSX.Element => {
        const isLastLine: boolean = lineIndex === linesCount - 1;
        const lineWidth: string = isLastLine ? "60%" : "100%";
        return (
          <Skeleton
            key={lineIndex}
            id={`${id}-line-${lineIndex}`}
            variant="text"
            width={lineWidth}
            className="skeleton-text"
          />
        );
      })}
    </div>
  );
}

export interface AvatarSkeletonProps {
  id?: string;
  size?: number;
  className?: string;
}

export function AvatarSkeleton({
  id = "base-avatar-skeleton",
  size = 40,
  className = "",
}: AvatarSkeletonProps): React.JSX.Element {
  return (
    <Skeleton
      id={id}
      variant="avatar"
      width={size}
      height={size}
      className={`skeleton-avatar ${className}`.trim()}
      ariaLabel="Loading avatar..."
    />
  );
}

export interface CardSkeletonProps {
  id?: string;
  hasAvatar?: boolean;
  rows?: number;
  className?: string;
}

export function CardSkeleton({
  id = "base-card-skeleton",
  hasAvatar = false,
  rows = 3,
  className = "",
}: CardSkeletonProps): React.JSX.Element {
  return (
    <div id={`${id}-card`} className={`skeleton-card ${className}`.trim()} role="status" aria-label="Loading card content...">
      {hasAvatar && (
        <div id={`${id}-avatar-row`} className="skeleton-card-header">
          <AvatarSkeleton id={`${id}-header-avatar`} size={36} />
          <div id={`${id}-header-text`} className="skeleton-card-header-text">
            <Skeleton id={`${id}-title-skeleton`} variant="text" width="50%" height={14} />
            <Skeleton id={`${id}-subtitle-skeleton`} variant="text" width="30%" height={10} />
          </div>
        </div>
      )}
      <TextSkeleton id={`${id}-body-text`} linesCount={rows} />
    </div>
  );
}

export interface TableSkeletonProps {
  id?: string;
  columns?: number;
  rows?: number;
  className?: string;
}

export function TableSkeleton({
  id = "base-table-skeleton",
  columns = 4,
  rows = 5,
  className = "",
}: TableSkeletonProps): React.JSX.Element {
  const rowIndices: number[] = Array.from({ length: rows }, (_item: unknown, index: number): number => index);
  const colIndices: number[] = Array.from({ length: columns }, (_item: unknown, index: number): number => index);

  return (
    <div id={`${id}-table`} className={`skeleton-table-wrapper ${className}`.trim()} role="status" aria-label="Loading table data...">
      <div id={`${id}-header-row`} className="skeleton-table-row">
        {colIndices.map((colIndex: number): React.JSX.Element => (
          <Skeleton
            key={colIndex}
            id={`${id}-th-${colIndex}`}
            className="skeleton-table-cell"
            height={16}
          />
        ))}
      </div>
      {rowIndices.map((rowIndex: number): React.JSX.Element => (
        <div key={rowIndex} id={`${id}-tr-${rowIndex}`} className="skeleton-table-row">
          {colIndices.map((colIndex: number): React.JSX.Element => (
            <Skeleton
              key={colIndex}
              id={`${id}-td-${rowIndex}-${colIndex}`}
              className="skeleton-table-cell"
              height={14}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export interface PageSkeletonProps {
  id?: string;
  className?: string;
}

export function PageSkeleton({
  id = "base-page-skeleton",
  className = "",
}: PageSkeletonProps): React.JSX.Element {
  return (
    <div id={`${id}-page`} className={`skeleton-page-container ${className}`.trim()} role="status" aria-label="Loading page...">
      <div id={`${id}-header`} className="skeleton-page-header">
        <Skeleton id={`${id}-title`} variant="text" width="35%" height={28} />
        <Skeleton id={`${id}-action-button`} variant="button" width={110} height={36} />
      </div>
      <div id={`${id}-grid`} className="skeleton-page-grid">
        <CardSkeleton id={`${id}-card-0`} rows={4} />
        <CardSkeleton id={`${id}-card-1`} rows={4} />
        <CardSkeleton id={`${id}-card-2`} rows={4} />
      </div>
    </div>
  );
}

export interface SidebarDetailSkeletonProps {
  id?: string;
  className?: string;
  showHeader?: boolean;
  showTabs?: boolean;
  showSearch?: boolean;
  showFooter?: boolean;
  tabsCount?: number;
  sectionsCount?: number;
  fieldsPerSection?: number;
  width?: number | string;
  ariaLabel?: string;
}

export function SidebarDetailSkeleton({
  id = "base-sidebar-detail-skeleton",
  className = "",
  showHeader = true,
  showTabs = false,
  showSearch = false,
  showFooter = false,
  tabsCount = 4,
  sectionsCount = 3,
  fieldsPerSection = 3,
  width,
  ariaLabel = "Loading detail bar...",
}: SidebarDetailSkeletonProps): React.JSX.Element {
  const sectionIndices: number[] = Array.from(
    { length: sectionsCount },
    (_item: unknown, index: number): number => index
  );
  const fieldIndices: number[] = Array.from(
    { length: fieldsPerSection },
    (_item: unknown, index: number): number => index
  );
  const tabIndices: number[] = Array.from(
    { length: tabsCount },
    (_item: unknown, index: number): number => index
  );

  const containerStyles: React.CSSProperties = {
    ...(width !== undefined
      ? { width: typeof width === "number" ? `${width}px` : width }
      : {}),
  };

  return (
    <div
      id={id}
      data-testid={id}
      role="status"
      aria-label={ariaLabel}
      className={`base-sidebar-detail-skeleton skeleton-detail-bar ${className}`.trim()}
      style={Object.keys(containerStyles).length > 0 ? containerStyles : undefined}
    >
      {showHeader && (
        <div id={`${id}-header`} className="skeleton-detail-header" data-testid={`${id}-header`}>
          <div id={`${id}-header-leading`} className="skeleton-detail-header-leading">
            <Skeleton
              id={`${id}-header-icon`}
              variant="rectangular"
              width={20}
              height={20}
              borderRadius={4}
            />
            <Skeleton
              id={`${id}-header-title`}
              variant="text"
              width={110}
              height={14}
            />
          </div>
          <div id={`${id}-header-trailing`} className="skeleton-detail-header-trailing">
            <Skeleton
              id={`${id}-header-badge`}
              variant="rectangular"
              width={42}
              height={16}
              borderRadius={8}
            />
            <Skeleton
              id={`${id}-header-close-btn`}
              variant="rectangular"
              width={18}
              height={18}
              borderRadius={4}
            />
          </div>
        </div>
      )}

      {showTabs && (
        <div id={`${id}-tabs-row`} className="skeleton-detail-tabs-row" data-testid={`${id}-tabs-row`}>
          {tabIndices.map((tabIndex: number): React.JSX.Element => (
            <Skeleton
              key={tabIndex}
              id={`${id}-tab-${tabIndex}`}
              variant="rectangular"
              width={28}
              height={22}
              borderRadius={4}
            />
          ))}
        </div>
      )}

      {showSearch && (
        <div id={`${id}-search-box`} className="skeleton-detail-search-box" data-testid={`${id}-search-box`}>
          <Skeleton
            id={`${id}-search-input`}
            variant="rectangular"
            width="100%"
            height={26}
            borderRadius={5}
          />
        </div>
      )}

      <div id={`${id}-body`} className="skeleton-detail-body" data-testid={`${id}-body`}>
        {sectionIndices.map((sectionIndex: number): React.JSX.Element => (
          <div
            key={sectionIndex}
            id={`${id}-section-${sectionIndex}`}
            className="skeleton-detail-section"
            data-testid={`${id}-section-${sectionIndex}`}
          >
            <div
              id={`${id}-section-${sectionIndex}-header`}
              className="skeleton-detail-section-header"
            >
              <Skeleton
                id={`${id}-section-${sectionIndex}-title`}
                variant="text"
                width={sectionIndex === 0 ? "45%" : "35%"}
                height={12}
              />
            </div>
            <div
              id={`${id}-section-${sectionIndex}-fields`}
              className="skeleton-detail-section-fields"
            >
              {fieldIndices.map((fieldIndex: number): React.JSX.Element => (
                <div
                  key={fieldIndex}
                  id={`${id}-section-${sectionIndex}-field-${fieldIndex}`}
                  className="skeleton-detail-field-row"
                  data-testid={`${id}-section-${sectionIndex}-field-${fieldIndex}`}
                >
                  <Skeleton
                    id={`${id}-section-${sectionIndex}-label-${fieldIndex}`}
                    variant="text"
                    width="32%"
                    height={10}
                  />
                  <Skeleton
                    id={`${id}-section-${sectionIndex}-input-${fieldIndex}`}
                    variant="rectangular"
                    width="100%"
                    height={24}
                    borderRadius={4}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showFooter && (
        <div id={`${id}-footer`} className="skeleton-detail-footer" data-testid={`${id}-footer`}>
          <Skeleton
            id={`${id}-footer-btn-1`}
            variant="button"
            width={72}
            height={26}
            borderRadius={4}
          />
          <Skeleton
            id={`${id}-footer-btn-2`}
            variant="button"
            width={72}
            height={26}
            borderRadius={4}
          />
        </div>
      )}
    </div>
  );
}

export {
  Skeleton as BaseSkeleton,
  SidebarDetailSkeleton as DetailBarSkeleton,
};

export default Skeleton;
