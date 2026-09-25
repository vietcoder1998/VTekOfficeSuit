"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Info,
  Sparkles,
  X,
} from "lucide-react";
import { useSafeTranslations } from "./use-safe-translations";

export type ToastType = "success" | "warning" | "error" | "info" | "default";
export type ToastPosition = "bottom-right" | "top-right" | "bottom-center" | "top-center";

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastProps {
  id?: string;
  "data-testid"?: string;
  message: string;
  title?: string;
  type?: ToastType;
  duration?: number; // in seconds (e.g. 2, 3, 5, 8)
  onClose?: () => void;
  action?: ToastAction;
  position?: ToastPosition;
  className?: string;
  style?: React.CSSProperties;
}


/**
 * Automatically infers the toast status type from the message text if not explicitly provided.
 */
export function inferToastType(message: string): ToastType {
  const lower = (message || "").toLowerCase();
  if (
    lower.includes("lỗi") ||
    lower.includes("error") ||
    lower.includes("failed") ||
    lower.includes("thất bại") ||
    lower.includes("maximum tabs reached") ||
    lower.includes("chưa có")
  ) {
    return "error";
  }
  if (
    lower.includes("cảnh báo") ||
    lower.includes("chú ý") ||
    lower.includes("warning") ||
    lower.includes("warn") ||
    lower.includes("xóa") ||
    lower.includes("cắt") ||
    lower.includes("hủy") ||
    lower.includes("thu gọn") ||
    lower.includes("đóng") ||
    lower.includes("gỡ bỏ") ||
    lower.includes("remove") ||
    lower.includes("delete")
  ) {
    return "warning";
  }
  if (
    lower.includes("thành công") ||
    lower.includes("đã lưu") ||
    lower.includes("đã thêm") ||
    lower.includes("đã chèn") ||
    lower.includes("đã tạo") ||
    lower.includes("đã dán") ||
    lower.includes("đã nhân bản") ||
    lower.includes("hoàn tất") ||
    lower.includes("success")
  ) {
    return "success";
  }
  if (
    lower.includes("đang tải") ||
    lower.includes("thông báo") ||
    lower.includes("loading") ||
    lower.includes("info") ||
    lower.includes("sao chép") ||
    lower.includes("copied") ||
    lower.includes("preview") ||
    lower.includes("xem trước") ||
    lower.includes("di chuyển") ||
    lower.includes("đặt lại") ||
    lower.includes("áp dụng") ||
    lower.includes("mở")
  ) {
    return "info";
  }
  return "default";
}

const STATUS_CONFIGS: Record<
  ToastType,
  {
    icon: React.ComponentType<{ size?: number; color?: string; className?: string }>;
    accentColor: string;
    bgSoft: string;
    borderAccent: string;
    label: string;
  }
> = {
  success: {
    icon: CheckCircle2,
    accentColor: "#16a34a",
    bgSoft: "rgba(22, 163, 74, 0.12)",
    borderAccent: "rgba(22, 163, 74, 0.35)",
    label: "Thành công",
  },
  warning: {
    icon: AlertTriangle,
    accentColor: "#f59e0b",
    bgSoft: "rgba(245, 158, 11, 0.12)",
    borderAccent: "rgba(245, 158, 11, 0.35)",
    label: "Lưu ý",
  },
  error: {
    icon: AlertCircle,
    accentColor: "#ef4444",
    bgSoft: "rgba(239, 68, 68, 0.12)",
    borderAccent: "rgba(239, 68, 68, 0.35)",
    label: "Lỗi",
  },
  info: {
    icon: Info,
    accentColor: "#2563eb",
    bgSoft: "rgba(37, 99, 235, 0.12)",
    borderAccent: "rgba(37, 99, 235, 0.35)",
    label: "Thông tin",
  },
  default: {
    icon: Sparkles,
    accentColor: "#6938ef",
    bgSoft: "rgba(105, 56, 239, 0.12)",
    borderAccent: "rgba(105, 56, 239, 0.35)",
    label: "Thông báo",
  },
};

export function Toast({
  id = "base-notification-toast",
  "data-testid": testId,
  message,
  title,
  type,
  duration = 3,
  onClose,
  action,
  position = "bottom-right",
  className = "",
  style = {},
}: ToastProps) {
  const t = useSafeTranslations("components.bases.toast", {
    closeNotification: "Đóng thông báo",
    "types.success": "Thành công",
    "types.warning": "Lưu ý",
    "types.error": "Lỗi",
    "types.info": "Thông tin",
    "types.default": "Thông báo",
  });
  const [progress, setProgress] = useState(100);
  const [isHovered, setIsHovered] = useState(false);
  const effectiveType = useMemo(() => type || inferToastType(message), [type, message]);
  const config = STATUS_CONFIGS[effectiveType] || STATUS_CONFIGS.default;
  const IconComponent = config.icon;

  const durationMs = Math.max(duration * 1000, 1500);

  useEffect(() => {
    if (!onClose || duration <= 0) return;
    const startTime = Date.now();
    const interval = setInterval(() => {
      if (isHovered) return;
      const elapsed = Date.now() - startTime;
      const remainingPct = Math.max(0, 100 - (elapsed / durationMs) * 100);
      setProgress(remainingPct);
      if (elapsed >= durationMs) {
        clearInterval(interval);
        onClose();
      }
    }, 40);

    return () => clearInterval(interval);
  }, [durationMs, onClose, isHovered, duration]);

  const positionClass = `toast-pos-${position}`;

  return (
    <div
      id={id}
      role={effectiveType === "error" ? "alert" : "status"}
      aria-live={effectiveType === "error" ? "assertive" : "polite"}
      className={`vtek-toast-container ${positionClass} toast-message ${className}`}
      data-testid={testId || "editor-toast-notification"}
      data-toast-type={effectiveType}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        borderLeft: `4px solid ${config.accentColor}`,
        ...style,
      }}
    >
      <div id={`${id}-body`} className="toast-body">
        {/* Status Icon Badge */}
        <div
          id={`${id}-icon-badge`}
          data-testid={`editor-toast-icon-${effectiveType}`}
          className="toast-icon-badge"
          style={{
            backgroundColor: config.bgSoft,
            color: config.accentColor,
          }}
        >
          <IconComponent size={15} color={config.accentColor} />
        </div>

        {/* Content Body */}
        <div id={`${id}-content`} className="toast-content">
          {title ? (
            <div id={`${id}-title`} className="toast-title">
              {title}
            </div>
          ) : null}
          <div
            id={`${id}-message`}
            data-testid="editor-toast-message"
            className="toast-message-text"
          >
            {message}
          </div>
        </div>

        {/* Optional Action Button */}
        {action && (
          <button
            id={`${id}-action-btn`}
            type="button"
            data-testid="editor-toast-action"
            onClick={(e) => {
              e.stopPropagation();
              action.onClick();
            }}
            className="toast-action-btn"
            style={{
              backgroundColor: config.bgSoft,
              color: config.accentColor,
              borderColor: config.borderAccent,
            }}
          >
            {action.label}
          </button>
        )}

        {/* Dismiss Close Button */}
        {onClose && (
          <button
            id={`${id}-close-btn`}
            type="button"
            data-testid="editor-toast-close"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            title={t("closeNotification", "Đóng thông báo")}
            className="toast-close-btn"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Remaining Duration Progress Bar */}
      {duration > 0 && onClose && (
        <div id={`${id}-progress-track`} className="toast-progress-track">
          <div
            id={`${id}-progress-fill`}
            className="toast-progress-fill"
            style={{
              width: `${progress}%`,
              backgroundColor: config.accentColor,
            }}
          />
        </div>
      )}
    </div>
  );
}

export const Notification = Toast;
export type NotificationProps = ToastProps;
export type NotificationType = ToastType;
export type NotificationPosition = ToastPosition;
export type NotificationAction = ToastAction;
export { inferToastType as inferNotificationType };
