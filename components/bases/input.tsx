"use client";

import React, { forwardRef } from "react";

export type InputSize = "xs" | "sm" | "md" | "lg";
export type InputVariant = "default" | "unstyled" | "outline" | "none";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  size?: InputSize;
  inputSize?: InputSize;
  variant?: InputVariant;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isInvalid?: boolean;
  wrapperClassName?: string;
  wrapperStyle?: React.CSSProperties;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size,
      inputSize = "md",
      variant = "default",
      leftIcon,
      rightIcon,
      isInvalid = false,
      wrapperClassName = "",
      wrapperStyle,
      className = "",
      disabled,
      ...rest
    },
    ref
  ) => {
    const isUnstyled = variant === "unstyled" || variant === "none";

    if (isUnstyled && !leftIcon && !rightIcon && !wrapperClassName && !wrapperStyle) {
      return (
        <input
          ref={ref}
          disabled={disabled}
          className={className}
          {...rest}
        />
      );
    }

    const effectiveSize: InputSize = size || inputSize;
    const sizeClass = isUnstyled ? "" : `size-${effectiveSize}`;

    const invalidClass = isInvalid ? "is-invalid" : "";
    const disabledClass = disabled ? "is-disabled" : "";
    const baseWrapperClass = isUnstyled ? "" : "base-input-wrapper";

    const wrapperCombined = [
      baseWrapperClass,
      sizeClass,
      invalidClass,
      disabledClass,
      wrapperClassName,
    ]
      .filter(Boolean)
      .join(" ");

    const autoId = React.useId();
    const wrapperId = rest.id ? `${rest.id}-wrapper` : `base-input-wrapper-${autoId.replace(/:/g, "")}`;

    return (
      <div id={wrapperId} className={wrapperCombined} style={wrapperStyle}>
        {leftIcon && <div id={`${wrapperId}-adornment-left`} className="base-input-adornment left">{leftIcon}</div>}
        <input
          ref={ref}
          disabled={disabled}
          className={isUnstyled ? className : `base-input ${className}`}
          {...rest}
        />
        {rightIcon && <div id={`${wrapperId}-adornment-right`} className="base-input-adornment right">{rightIcon}</div>}
      </div>
    );
  }
);

Input.displayName = "BaseInput";
export { Input as BaseInput };
export default Input;
