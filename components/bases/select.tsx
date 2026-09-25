"use client";

import React, { forwardRef } from "react";

export type SelectSize = "xs" | "sm" | "md";
export type SelectVariant = "default" | "unstyled" | "outline" | "none";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  selectSize?: SelectSize;
  variant?: SelectVariant;
  options?: SelectOption[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      selectSize = "md",
      variant = "default",
      options,
      className = "",
      children,
      ...rest
    },
    ref
  ) => {
    const isUnstyled = variant === "unstyled" || variant === "none";
    const variantClass = !isUnstyled && variant !== "default" ? `variant-${variant}` : "";
    const sizeClass = isUnstyled || selectSize === "md" ? "" : `size-${selectSize}`;
    const baseClass = isUnstyled ? "" : "base-select";
    const combined = [baseClass, variantClass, sizeClass, className].filter(Boolean).join(" ");

    return (
      <select ref={ref} className={combined} {...rest}>
        {options
          ? options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))
          : children}
      </select>
    );
  }
);

Select.displayName = "BaseSelect";
export { Select as BaseSelect };
