"use client";
import { Button } from "./button";

import React, { forwardRef } from "react";

export interface SwitchProps {
  id?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: React.ReactNode;
  disabled?: boolean;
  size?: "sm" | "md";
  className?: string;
  "data-testid"?: string;
  "aria-label"?: string;
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      id,
      checked,
      onChange,
      label,
      disabled = false,
      size = "md",
      className = "",
      "data-testid": dataTestId,
      "aria-label": ariaLabel,
    },
    ref
  ) => {
    const isSm = size === "sm";
    const width = isSm ? 28 : 36;
    const height = isSm ? 16 : 20;
    const dotSize = isSm ? 12 : 16;
    const translate = checked ? (isSm ? 12 : 16) : 2;

    return (
      <label
        className={`inline-flex items-center gap-1.5 select-none ${
          disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer opacity-100"
        }`}
      >
        <Button
          variant="unstyled"
          ref={ref}
          id={id}
          type="button"
          role="switch"
          aria-checked={checked}
          aria-label={ariaLabel}
          disabled={disabled}
          onClick={() => onChange(!checked)}
          className={`base-switch ${isSm ? "base-switch-sm" : "base-switch-md"} ${
            checked ? "is-checked btn-active-primary" : ""
          } ${disabled ? "is-disabled" : ""} ${className}`.trim()}
          data-testid={dataTestId}
        >
          <span
            className={`base-switch-dot ${isSm ? "base-switch-dot-sm" : "base-switch-dot-md"} ${
              checked ? "is-checked" : ""
            }`}
          />
        </Button>
        {label && <span className="text-xs text-text">{label}</span>}
      </label>
    );
  }
);

Switch.displayName = "BaseSwitch";
export { Switch as BaseSwitch };
