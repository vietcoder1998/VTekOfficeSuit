"use client";

import React, { forwardRef } from "react";
import { Loader2 } from "lucide-react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "default"
  | "gray"
  | "outline"
  | "ghost"
  | "danger"
  | "warning"
  | "success"
  | "navbar"
  | "unstyled"
  | "none";

export type ButtonSize =
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "icon"
  | "iconSm"
  | "iconXs"
  | "none";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isActive?: boolean;
  isSelected?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "secondary",
      size = "sm",
      isActive = false,
      isSelected,
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      className = "",
      children,
      type = "button",
      ...rest
    },
    ref
  ) => {
    const isChosen = Boolean(isSelected !== undefined ? isSelected : isActive);
    const isUnstyled = variant === "unstyled" || variant === "none";
    const variantClass = isUnstyled ? "" : `base-btn-${variant}`;
    const resolvedSize = size;
    const sizeClass =
      isUnstyled || resolvedSize === "none"
        ? ""
        : resolvedSize === "iconSm"
        ? "base-btn-icon-sm"
        : resolvedSize === "iconXs"
        ? "base-btn-icon-xs"
        : `base-btn-${resolvedSize}`;
    const widthClass = fullWidth ? "base-btn-full" : "base-btn-fit";
    const loadingClass = isLoading ? "is-loading" : "";
    const chosenClass = isChosen ? "active selected" : "";
    const baseClass = isUnstyled ? "" : "base-btn";

    const combinedClassName = [
      baseClass,
      variantClass,
      sizeClass,
      widthClass,
      loadingClass,
      chosenClass,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const iconSize =
      resolvedSize === "xs" || resolvedSize === "iconXs"
        ? 11
        : resolvedSize === "sm" || resolvedSize === "iconSm"
        ? 12
        : resolvedSize === "lg"
        ? 16
        : resolvedSize === "xl"
        ? 18
        : 14;

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={combinedClassName}
        data-active={isChosen ? "true" : undefined}
        data-selected={isChosen ? "true" : undefined}
        aria-selected={isChosen ? "true" : (rest["aria-selected"] as any)}
        {...rest}
      >
        {isLoading ? (
          <Loader2
            size={iconSize}
            className="animate-spin"
          />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "BaseButton";
export { Button as BaseButton };
