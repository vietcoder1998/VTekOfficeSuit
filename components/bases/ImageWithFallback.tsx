"use client";

import React, { useState } from "react";
import { ImageOff } from "lucide-react";

export interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  fallbackIcon?: React.ReactNode;
  containerClassName?: string;
}

export function ImageWithFallback({
  src,
  alt = "",
  fallbackSrc,
  fallbackIcon,
  containerClassName = "",
  className = "",
  onError,
  ...props
}: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState<boolean>(false);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setHasError(true);
    if (onError) onError(e);
  };

  if (hasError) {
    if (fallbackSrc) {
      return (
        <img
          src={fallbackSrc}
          alt={alt}
          className={className}
          {...props}
        />
      );
    }
    return (
      <div
        className={`flex items-center justify-center bg-slate-800 text-slate-400 p-2 rounded border border-slate-700 ${containerClassName}`}
        data-testid="image-fallback-container"
      >
        {fallbackIcon || <ImageOff className="w-5 h-5 text-slate-500" />}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={handleError}
      {...props}
    />
  );
}
