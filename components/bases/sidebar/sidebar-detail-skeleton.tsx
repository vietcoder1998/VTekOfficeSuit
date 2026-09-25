"use client";

import React from "react";
import { Skeleton } from "../loading";
import { useSafeTranslations } from "../use-safe-translations";

import type { SidebarDetailSkeletonProps, DetailBarSkeletonProps } from "./types";
export type { SidebarDetailSkeletonProps, DetailBarSkeletonProps };

/**
 * SidebarDetailSkeleton — Section 484 & Rule 51 Standard
 * High-fidelity theme-adaptive skeleton loading placeholder for Sidebar Detail Panel and Detail Right Bar.
 */
export function SidebarDetailSkeleton({
  id = "sidebar-detail-skeleton",
  className = "",
  showHeader = true,
  showTabs = false,
  showSearch = false,
  showFooter = false,
  tabsCount = 4,
  sectionsCount = 3,
  fieldsPerSection = 3,
  width,
  ariaLabel,
}: SidebarDetailSkeletonProps): React.JSX.Element {
  const t = useSafeTranslations("components.bases.sidebar", {
    loadingDetail: "Đang tải chi tiết thanh bên...",
  });
  const effectiveAriaLabel: string = ariaLabel ?? t("loadingDetail", "Đang tải chi tiết thanh bên...");

  const sectionIndices: number[] = Array.from(
    { length: sectionsCount },
    (_unusedItem: unknown, index: number): number => index
  );
  const fieldIndices: number[] = Array.from(
    { length: fieldsPerSection },
    (_unusedItem: unknown, index: number): number => index
  );
  const tabIndices: number[] = Array.from(
    { length: tabsCount },
    (_unusedItem: unknown, index: number): number => index
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
      aria-label={effectiveAriaLabel}
      className={`base-sidebar-detail-skeleton skeleton-detail-bar ${className}`.trim()}
      style={Object.keys(containerStyles).length > 0 ? containerStyles : undefined}
    >
      {/* ── 1. Header Skeleton ── */}
      {showHeader && (
        <div
          id={`${id}-header`}
          className="skeleton-detail-header"
          data-testid={`${id}-header`}
        >
          <div
            id={`${id}-header-leading`}
            className="skeleton-detail-header-leading"
          >
            <Skeleton
              id={`${id}-header-icon`}
              width={20}
              height={20}
              borderRadius={4}
            />
            <Skeleton
              id={`${id}-header-title`}
              width={110}
              height={14}
            />
          </div>
          <div
            id={`${id}-header-trailing`}
            className="skeleton-detail-header-trailing"
          >
            <Skeleton
              id={`${id}-header-badge`}
              width={42}
              height={16}
              borderRadius={8}
            />
            <Skeleton
              id={`${id}-header-close-btn`}
              width={18}
              height={18}
              borderRadius={4}
            />
          </div>
        </div>
      )}

      {/* ── 2. Tabs Row Skeleton ── */}
      {showTabs && (
        <div
          id={`${id}-tabs-row`}
          className="skeleton-detail-tabs-row"
          data-testid={`${id}-tabs-row`}
        >
          {tabIndices.map((tabIndex: number): React.JSX.Element => (
            <Skeleton
              key={tabIndex}
              id={`${id}-tab-${tabIndex}`}
              width={28}
              height={22}
              borderRadius={4}
            />
          ))}
        </div>
      )}

      {/* ── 3. Search Box Skeleton ── */}
      {showSearch && (
        <div
          id={`${id}-search-box`}
          className="skeleton-detail-search-box"
          data-testid={`${id}-search-box`}
        >
          <Skeleton
            id={`${id}-search-input`}
            width="100%"
            height={26}
            borderRadius={5}
          />
        </div>
      )}

      {/* ── 4. Main Body Fields Skeleton ── */}
      <div
        id={`${id}-body`}
        className="skeleton-detail-body"
        data-testid={`${id}-body`}
      >
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
                    width="32%"
                    height={10}
                  />
                  <Skeleton
                    id={`${id}-section-${sectionIndex}-input-${fieldIndex}`}
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

      {/* ── 5. Footer Buttons Skeleton ── */}
      {showFooter && (
        <div
          id={`${id}-footer`}
          className="skeleton-detail-footer"
          data-testid={`${id}-footer`}
        >
          <Skeleton
            id={`${id}-footer-btn-1`}
            width={72}
            height={26}
            borderRadius={4}
          />
          <Skeleton
            id={`${id}-footer-btn-2`}
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
  SidebarDetailSkeleton as DetailBarSkeleton,
};

export default SidebarDetailSkeleton;
