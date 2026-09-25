"use client";

import React, { forwardRef, useId } from "react";

/**
 * ── BASE FORM COMPONENT ──
 * Conforms to Section 269 of standard-specification.md, Rule 13 (Default ID),
 * Rule 18 (Theme Classes) & Rule 20 (All New Components Created With Class).
 */

function formatAutoId(rawId: string, prefix: string): string {
  const clean = rawId.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  return clean ? `${prefix}${clean}` : `${prefix}default`;
}

export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  inline?: boolean;
}

export const Form = forwardRef<HTMLFormElement, FormProps>(
  ({ id, className = "", inline, children, ...rest }, ref) => {
    const rawId = useId();
    const effectiveId = id || formatAutoId(rawId, "base-form-");

    const classes = [
      "base-form",
      inline ? "base-form-inline" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <form ref={ref} id={effectiveId} className={classes} {...rest}>
        {children}
      </form>
    );
  }
);

Form.displayName = "BaseForm";
export { Form as BaseForm };
