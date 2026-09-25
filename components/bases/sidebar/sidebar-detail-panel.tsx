"use client";

import React, { useRef, useCallback } from "react";
import { SidebarHeader } from "./sidebar-header";
import { SidebarBody } from "./sidebar-body";
import { SidebarFooter } from "./sidebar-footer";
import { Input } from "../input";
import { IdeIcon } from "../ide-icon";
import { useSafeTranslations } from "../use-safe-translations";
import { SidebarDetailSkeleton } from "./sidebar-detail-skeleton";
import type { SidebarDetailPanelProps } from "./types";

export type { SidebarDetailPanelProps };

/**
 * SidebarDetailPanel — Section 484 Standard
 * 260px Detail Panel with search, header with Base <SidebarHeader>,
 * resizer line, and body/footer slots.
 */
export function SidebarDetailPanel({
  id = "base-sidebar-detail-panel",
  title,
  icon,
  badge,
  actions,
  isOpen = true,
  onClose,
  width = 260,
  onWidthChange,
  searchPlaceholder,
  searchQuery,
  onSearchChange,
  headerExtra,
  footer,
  isLoading = false,
  loadingSkeleton,
  children,
  className = "",
}: SidebarDetailPanelProps) {
  const t = useSafeTranslations("components.bases.sidebar", {
    detail: "Chi Tiết",
    closeSidebar: "Đóng thanh bên",
    resizePanel: "Thay đổi kích thước panel",
  });
  const effectiveTitle = title ?? t("detail", "Chi Tiết");
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startWidthRef = useRef(width);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      isDraggingRef.current = true;
      startXRef.current = e.clientX;
      startWidthRef.current = width;

      const handleMouseMove = (moveEvent: MouseEvent) => {
        if (!isDraggingRef.current) return;
        const delta = moveEvent.clientX - startXRef.current;
        const targetWidth = Math.max(180, Math.min(600, startWidthRef.current + delta));
        onWidthChange?.(targetWidth);
      };

      const handleMouseUp = () => {
        isDraggingRef.current = false;
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [width, onWidthChange]
  );

  if (!isOpen) return null;

  return (
    <aside
      id={id}
      data-testid={id}
      className={`base-sidebar-detail-panel ${className}`}
    >
      <SidebarHeader
        id={`${id}-header`}
        icon={icon}
        title={effectiveTitle}
        badge={badge}
        actions={actions}
        onClose={onClose}
        closeButtonId={`${id}-close-btn`}
        closeAriaLabel={t("closeSidebar", "Đóng thanh bên")}
      />

      {headerExtra && (
        <div id={`${id}-header-extra`} className="px-2 py-1 border-b border-border">
          {headerExtra}
        </div>
      )}

      {searchPlaceholder && (
        <div id={`${id}-search-container`} className="px-2 py-1.5 border-b border-border">
          <Input
            id={`${id}-search-input`}
            value={searchQuery ?? ""}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder={searchPlaceholder}
            inputSize="sm"
            leftIcon={<IdeIcon name="Search" size="xs" />}
          />
        </div>
      )}

      <SidebarBody id={`${id}-body`}>
        {isLoading ? (
          loadingSkeleton ?? (
            <SidebarDetailSkeleton
              id={`${id}-skeleton`}
              showHeader={false}
              showSearch={false}
              showFooter={false}
            />
          )
        ) : (
          children
        )}
      </SidebarBody>

      {footer && (
        <SidebarFooter id={`${id}-footer`}>
          {footer}
        </SidebarFooter>
      )}

      {onWidthChange && (
        <div
          id={`${id}-resizer`}
          data-testid={`${id}-resizer`}
          className="base-sidebar-resizer-line"
          onMouseDown={handleMouseDown}
          role="separator"
          aria-orientation="vertical"
          aria-label={t("resizePanel", "Thay đổi kích thước panel")}
        />
      )}
    </aside>
  );
}

export default SidebarDetailPanel;
