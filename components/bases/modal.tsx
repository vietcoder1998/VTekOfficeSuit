"use client";

import { useSafeTranslations } from "./use-safe-translations";
import { ArrowLeft, X, type LucideIcon } from "lucide-react";
import React, { useEffect, type CSSProperties, type ReactNode } from "react";

function formatModalTitle(title: string): string {
  if (!title || typeof title !== "string") return "";
  return title.replace(/\s+/g, " ").replace(/^[\s\-–—•:.*]+/, "").trim();
}
import { Button } from "./button";
import { IdeIcon } from "./ide-icon";

export type ModalSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "full" | "auto";

export const MODAL_SIZE_MAP: Record<ModalSize, string> = {
  xs: "360px",
  sm: "440px",
  md: "560px",
  lg: "720px",
  xl: "900px",
  "2xl": "1100px",
  full: "calc(100vw - 48px)",
  auto: "auto",
};

export interface ModalProps {
  id?: string;
  isOpen?: boolean;
  open?: boolean;
  onClose: () => void;
  title?: ReactNode;
  subtitle?: ReactNode;
  icon?: LucideIcon | ReactNode | string;
  iconColor?: string;
  iconBg?: string;
  onBack?: () => void;
  children?: ReactNode;
  footer?: ReactNode;
  size?: ModalSize;
  maxWidth?: number | string;
  width?: number | string;
  height?: number | string;
  maxHeight?: number | string;
  className?: string;
  dialogClassName?: string;
  overlayClassName?: string;
  style?: CSSProperties;
  bodyStyle?: CSSProperties;
  headerStyle?: CSSProperties;
  footerStyle?: CSSProperties;
  hideHeader?: boolean;
  hideCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  rightActions?: ReactNode;
  "data-testid"?: string;
  closeTestId?: string;
  backTestId?: string;
  role?: string;
  ariaLabelledBy?: string;
  forceShowIcon?: boolean;
  forceShowSubtitle?: boolean;
}

export type BaseModalProps = ModalProps;

export function Modal({
  id,
  isOpen,
  open,
  onClose,
  title,
  subtitle,
  icon,
  iconColor = "var(--primary, #6938ef)",
  iconBg = "transparent",
  onBack,
  children,
  footer,
  size = "md",
  maxWidth,
  width,
  height,
  maxHeight,
  className = "",
  dialogClassName = "",
  overlayClassName = "",
  style,
  bodyStyle,
  headerStyle,
  footerStyle,
  hideHeader = false,
  hideCloseButton = false,
  closeOnOverlayClick = true,
  closeOnEsc = true,
  rightActions,
  "data-testid": dataTestId,
  closeTestId = "base-modal-close-btn",
  backTestId = "base-modal-back-btn",
  role = "dialog",
  ariaLabelledBy,
  forceShowIcon = false,
  forceShowSubtitle = false,
}: ModalProps) {
  const isModalOpen = isOpen ?? open ?? false;
  const t = useSafeTranslations("components.bases.modal", {
    back: "Quay lại",
    closeEsc: "Đóng (Esc)",
  });
  const generatedId = React.useId().replace(/:/g, "");
  const effectiveId = id || `modal-${generatedId}`;

  useEffect(() => {
    if (!isModalOpen || !closeOnEsc) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen, closeOnEsc, onClose]);

  if (!isModalOpen) return null;

  const resolvedMaxWidth =
    maxWidth !== undefined
      ? typeof maxWidth === "number"
        ? `${maxWidth}px`
        : maxWidth
      : MODAL_SIZE_MAP[size] || MODAL_SIZE_MAP.md;

  const renderIcon = () => {
    if (!icon) return null;
    if (React.isValidElement(icon)) {
      return icon;
    }
    if (typeof icon === "string") {
      return <IdeIcon name={icon} size={12} />;
    }
    const IconComponent = icon as LucideIcon;
    return <IconComponent size={12} />;
  };

  const resolvedTitle =
    typeof title === "string" ? formatModalTitle(title) : title;

  const hasHeaderContent =
    !hideHeader &&
    (title !== undefined ||
      (subtitle !== undefined && forceShowSubtitle) ||
      (icon !== undefined && forceShowIcon) ||
      onBack !== undefined ||
      !hideCloseButton ||
      rightActions !== undefined);

  return (
    <div
      id={`${effectiveId}-overlay`}
      className={`base-modal-overlay ide-modal-backdrop ${overlayClassName}`}
      role={role}
      aria-modal="true"
      aria-labelledby={ariaLabelledBy}
      onClick={(e) => {
        if (closeOnOverlayClick && e.target === e.currentTarget) {
          onClose();
        }
      }}
      data-testid={dataTestId ? `${dataTestId}-overlay` : "base-modal-overlay"}
    >
      <div
        id={id || `${effectiveId}-dialog`}
        className={`base-modal-dialog ide-modal-dialog ${dialogClassName} ${className}`}
        style={{
          width: width !== undefined ? (typeof width === "number" ? `${width}px` : width) : "100%",
          maxWidth: resolvedMaxWidth,
          height: height !== undefined ? (typeof height === "number" ? `${height}px` : height) : undefined,
          maxHeight: maxHeight !== undefined ? (typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight) : "90vh",
          ...style,
        }}
        onClick={(e) => e.stopPropagation()}
        data-testid={dataTestId || "base-modal-dialog"}
      >
        {hasHeaderContent && (
          <div
            id={`${effectiveId}-header`}
            className="base-modal-header modal-header-compact"
            data-testid="base-modal-header"
            style={headerStyle}
          >
            {/* Left Header Area: Back Button + Clean Text Title */}
            <div
              id={`${effectiveId}-header-left`}
              className="base-modal-header-left"
            >
              {onBack && (
                <Button
                  id={`${effectiveId}-back-btn`}
                  variant="secondary"
                  size="iconXs"
                  type="button"
                  onClick={onBack}
                  data-testid={backTestId}
                  title={t("back")}
                  className="modal-icon-btn"
                >
                  <ArrowLeft size={12} />
                </Button>
              )}

              {icon && forceShowIcon && (
                <div
                  id={`${effectiveId}-header-icon`}
                  className="modal-icon-btn"
                  style={{
                    background: iconBg,
                    color: iconColor,
                  }}
                >
                  {renderIcon()}
                </div>
              )}

              <div
                id={`${effectiveId}-title-wrap`}
                className="min-w-0 flex flex-col justify-center"
              >
                {resolvedTitle !== undefined && (
                  <div
                    id={`${effectiveId}-title`}
                    className="text-xs font-semibold theme-text leading-tight truncate tracking-tight"
                  >
                    {resolvedTitle}
                  </div>
                )}
                {subtitle !== undefined && forceShowSubtitle && (
                  <div
                    id={`${effectiveId}-subtitle`}
                    className="text-xs text-muted leading-tight truncate mt-0-5"
                  >
                    {subtitle}
                  </div>
                )}
              </div>
            </div>

            {/* Right Header Area: Custom Actions + Close Button */}
            <div
              id={`${effectiveId}-header-actions`}
              className="base-modal-header-actions"
            >
              {rightActions}
              {!hideCloseButton && (
                <Button
                  id={`${effectiveId}-close-btn`}
                  variant="ghost"
                  size="iconXs"
                  type="button"
                  onClick={onClose}
                  title={t("closeEsc")}
                  aria-label="Close"
                  data-testid={closeTestId || `${effectiveId}-close-btn`}
                  className="modal-icon-btn text-muted"
                >
                  <X size={12} />
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Modal Body Content */}
        <div
          id={`${effectiveId}-body`}
          className="base-modal-body"
          data-testid="base-modal-body"
          style={bodyStyle}
        >
          {children}
        </div>

        {/* Modal Footer (if provided) */}
        {footer && (
          <div
            id={`${effectiveId}-footer`}
            className="base-modal-footer"
            data-testid="base-modal-footer"
            style={footerStyle}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export function ModalHeader({
  id,
  className = "",
  children,
  onClose,
  title,
  subtitle,
  icon,
  iconColor,
  iconBg,
  onBack,
  rightActions,
  closeTestId = "base-modal-close-btn",
  backTestId = "base-modal-back-btn",
  style,
  forceShowIcon = false,
  forceShowSubtitle = false,
  ...rest
}: React.HTMLAttributes<HTMLDivElement> & {
  id?: string;
  onClose?: () => void;
  title?: ReactNode;
  subtitle?: ReactNode;
  icon?: LucideIcon | ReactNode | string;
  iconColor?: string;
  iconBg?: string;
  onBack?: () => void;
  rightActions?: ReactNode;
  closeTestId?: string;
  backTestId?: string;
  forceShowIcon?: boolean;
  forceShowSubtitle?: boolean;
}) {
  const t = useSafeTranslations("components.bases.modal", {
    back: "Quay lại",
    closeEsc: "Đóng (Esc)",
  });
  const generatedId = React.useId().replace(/:/g, "");
  const effectiveId = id || `modal-header-${generatedId}`;

  const renderIcon = () => {
    if (!icon) return null;
    if (React.isValidElement(icon)) return icon;
    if (typeof icon === "string") {
      return <IdeIcon name={icon} size={12} />;
    }
    const IconComponent = icon as LucideIcon;
    return <IconComponent size={12} />;
  };

  const resolvedTitle =
    typeof title === "string" ? formatModalTitle(title) : title;

  return (
    <div
      id={effectiveId}
      className={`base-modal-header modal-header-compact ${className}`}
      data-testid="base-modal-header"
      style={style}
      {...rest}
    >
      {children ? (
        <>
          {children}
          {onClose && (
            <Button
              id={`${effectiveId}-close-btn`}
              variant="ghost"
              size="iconXs"
              type="button"
              onClick={onClose}
              title={t("closeEsc")}
              aria-label="Close"
              data-testid={closeTestId}
              className="modal-icon-btn text-muted"
            >
              <X size={12} />
            </Button>
          )}
        </>
      ) : (
        <>
          <div
            id={`${effectiveId}-left`}
            className="base-modal-header-left"
          >
            {onBack && (
              <Button
                id={`${effectiveId}-back-btn`}
                variant="secondary"
                size="iconXs"
                type="button"
                onClick={onBack}
                data-testid={backTestId}
                title={t("back")}
                className="modal-icon-btn"
              >
                <ArrowLeft size={12} />
              </Button>
            )}

            {icon && forceShowIcon && (
              <div
                id={`${effectiveId}-icon`}
                className="modal-icon-btn"
                style={{
                  background: iconBg,
                  color: iconColor,
                }}
              >
                {renderIcon()}
              </div>
            )}

            <div
              id={`${effectiveId}-title-wrap`}
              className="min-w-0 flex flex-col justify-center"
            >
              {resolvedTitle !== undefined && (
                <div
                  id={`${effectiveId}-title`}
                  className="text-xs font-semibold theme-text leading-tight truncate tracking-tight"
                >
                  {resolvedTitle}
                </div>
              )}
              {subtitle !== undefined && forceShowSubtitle && (
                <div
                  id={`${effectiveId}-subtitle`}
                  className="text-xs text-muted leading-tight truncate mt-0-5"
                >
                  {subtitle}
                </div>
              )}
            </div>
          </div>

          <div
            id={`${effectiveId}-actions`}
            className="base-modal-header-actions"
          >
            {rightActions}
            {onClose && (
              <Button
                id={`${effectiveId}-close-btn`}
                variant="ghost"
                size="iconXs"
                type="button"
                onClick={onClose}
                title={t("closeEsc")}
                aria-label="Close"
                data-testid={closeTestId}
                className="modal-icon-btn text-muted"
              >
                <X size={12} />
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export function ModalBody({
  id,
  className = "",
  children,
  style,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  const generatedId = React.useId().replace(/:/g, "");
  const effectiveId = id || `modal-body-${generatedId}`;
  return (
    <div
      id={effectiveId}
      className={`base-modal-body ${className}`}
      data-testid="base-modal-body"
      style={style}
      {...rest}
    >
      {children}
    </div>
  );
}

export function ModalFooter({
  id,
  className = "",
  children,
  style,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  const generatedId = React.useId().replace(/:/g, "");
  const effectiveId = id || `modal-footer-${generatedId}`;
  return (
    <div
      id={effectiveId}
      className={`base-modal-footer ${className}`}
      data-testid="base-modal-footer"
      style={style}
      {...rest}
    >
      {children}
    </div>
  );
}

export const BaseModal = Modal;
export const BaseModalHeader = ModalHeader;
export const BaseModalBody = ModalBody;
export const BaseModalFooter = ModalFooter;

export default Modal;
