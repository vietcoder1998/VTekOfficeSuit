"use client";

import React, { forwardRef } from "react";

export type TextareaVariant = "default" | "unstyled" | "outline" | "none";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: TextareaVariant;
  isInvalid?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ variant = "default", isInvalid = false, className = "", ...rest }, ref) => {
    const isUnstyled = variant === "unstyled" || variant === "none";
    const invalidClass = isInvalid ? "is-invalid" : "";
    const baseClass = isUnstyled ? "" : "base-textarea";
    const combined = [baseClass, invalidClass, className]
      .filter(Boolean)
      .join(" ");

    return <textarea ref={ref} className={combined} {...rest} />;
  }
);

Textarea.displayName = "BaseTextarea";
export { Textarea as BaseTextarea };
