"use client";

import React, { forwardRef, useEffect, useRef } from "react";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: React.ReactNode;
  indeterminate?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, indeterminate = false, className = "", disabled, ...rest }, ref) => {
    const localRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      const element = (ref && typeof ref !== "function" ? ref.current : localRef.current);
      if (element) {
        element.indeterminate = indeterminate;
      }
    }, [indeterminate, ref]);

    return (
      <label
        className={`base-checkbox-label ${disabled ? "is-disabled" : ""}`}
      >
        <input
          ref={ref || localRef}
          type="checkbox"
          disabled={disabled}
          className={`base-checkbox ${className}`}
          {...rest}
        />
        {label && <span>{label}</span>}
      </label>
    );
  }
);

Checkbox.displayName = "BaseCheckbox";
export { Checkbox as BaseCheckbox };
