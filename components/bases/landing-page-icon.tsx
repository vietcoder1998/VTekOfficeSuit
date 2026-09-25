"use client";

export type LowcodeIconVariant = "squircle" | "circle" | "hexagon" | "badge" | "minimal" | "monochrome" | "outline" | "flat";
import React, { useId } from "react";

export interface LowcodeIconProps {
  variant?: LowcodeIconVariant;
  size?: number | "xs" | "sm" | "md" | "lg" | "xl";
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  includeDropShadow?: boolean;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
  "aria-label"?: string;
  title?: string;
  onClick?: (e: React.MouseEvent<SVGSVGElement>) => void;
}

const SIZE_PRESETS: Record<string, number> = {
  xs: 14,
  sm: 18,
  md: 24,
  lg: 32,
  xl: 48,
};

/**
 * Lowcode Official Vector SVG Icon Base Component
 * ─────────────────────────────────────────────────────────────────────────────
 * Provides crisp, high-fidelity vector rendering for the Lowcode / V-TEK Studio
 * platform icon across all sizes, variants, and themes.
 */
export function LowcodeIcon({
  variant = "squircle",
  size = "sm",
  primaryColor = "#6938ef",
  secondaryColor = "#875bf7",
  accentColor = "#22d3ee",
  includeDropShadow = false,
  className = "",
  style,
  id,
  "aria-label": ariaLabel = "Lowcode Official Icon",
  title,
  onClick,
}: LowcodeIconProps) {
  const autoId = useId();
  const effectiveId = id || `lowcode-page-icon-${autoId.replace(/[:]/g, "")}`;
  const numSize = typeof size === "number" ? size : SIZE_PRESETS[size] || 18;

  // 1. Monochrome variant (currentColor)
  if (variant === "monochrome") {
    return (
      <svg
        id={effectiveId}
        className={`lowcode-page-icon lowcode-page-icon-monochrome ${className}`}
        width={numSize}
        height={numSize}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={ariaLabel}
        style={style}
        onClick={onClick}
      >
        {title && <title>{title}</title>}
        <rect x="2" y="3" width="20" height="18" rx="3" />
        <line x1="2" y1="7" x2="22" y2="7" />
        <circle cx="5" cy="5" r="0.5" fill="currentColor" />
        <circle cx="7.5" cy="5" r="0.5" fill="currentColor" />
        <rect x="5" y="9.5" width="14" height="5.5" rx="1" strokeWidth={1.5} />
        <line x1="7" y1="12" x2="11" y2="12" strokeWidth={1.5} />
        <rect x="5" y="17" width="3.5" height="2.5" rx="0.5" strokeWidth={1} />
        <rect x="10.25" y="17" width="3.5" height="2.5" rx="0.5" strokeWidth={1} />
        <rect x="15.5" y="17" width="3.5" height="2.5" rx="0.5" strokeWidth={1} />
      </svg>
    );
  }

  // 2. Favicon variant (crisp 32x32)
  if (variant === "favicon") {
    return (
      <svg
        id={effectiveId}
        className={`lowcode-page-icon lowcode-page-icon-favicon ${className}`}
        width={numSize}
        height={numSize}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={ariaLabel}
        style={style}
        onClick={onClick}
      >
        {title && <title>{title}</title>}
        <defs>
          <linearGradient id={`${effectiveId}-fbg`} x1="2" y1="2" x2="30" y2="30" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={secondaryColor} />
            <stop offset="100%" stopColor={primaryColor} />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="7" fill={`url(#${effectiveId}-fbg)`} />
        <rect x="5" y="5" width="22" height="4" rx="1.5" fill="#ffffff" fillOpacity={0.35} />
        <circle cx="8" cy="7" r="1" fill="#f43f5e" />
        <circle cx="11" cy="7" r="1" fill="#fbbf24" />
        <circle cx="14" cy="7" r="1" fill={accentColor} />
        <rect x="5" y="11" width="22" height="9" rx="2" fill="#ffffff" fillOpacity={0.2} />
        <rect x="7" y="13" width="10" height="2" rx="1" fill="#ffffff" />
        <rect x="7" y="16" width="6" height="2" rx="1" fill={accentColor} />
        <path d="M 18 13 L 21 18 L 24 13" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="5" y="22" width="6" height="5" rx="1.5" fill="#ffffff" fillOpacity={0.3} />
        <rect x="13" y="22" width="6" height="5" rx="1.5" fill={accentColor} fillOpacity={0.7} />
        <rect x="21" y="22" width="6" height="5" rx="1.5" fill="#ffffff" fillOpacity={0.3} />
      </svg>
    );
  }

  // 3. Minimal variant (64x64)
  if (variant === "minimal") {
    return (
      <svg
        id={effectiveId}
        className={`lowcode-page-icon lowcode-page-icon-minimal ${className}`}
        width={numSize}
        height={numSize}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={ariaLabel}
        style={style}
        onClick={onClick}
      >
        {title && <title>{title}</title>}
        <defs>
          <linearGradient id={`${effectiveId}-mbg`} x1="4" y1="4" x2="60" y2="60" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={secondaryColor} />
            <stop offset="100%" stopColor={primaryColor} />
          </linearGradient>
        </defs>
        <rect width="64" height="64" rx="14" fill={`url(#${effectiveId}-mbg)`} />
        <rect x="10" y="10" width="44" height="8" rx="3" fill="#ffffff" fillOpacity={0.25} />
        <circle cx="15" cy="14" r="2" fill="#f43f5e" />
        <circle cx="21" cy="14" r="2" fill="#fbbf24" />
        <circle cx="27" cy="14" r="2" fill={accentColor} />
        <rect x="10" y="22" width="44" height="20" rx="4" fill="#ffffff" fillOpacity={0.15} />
        <rect x="14" y="26" width="18" height="4" rx="2" fill="#ffffff" />
        <rect x="14" y="33" width="10" height="4" rx="2" fill={accentColor} />
        <path d="M 38 26 L 44 36 L 50 26" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="10" y="46" width="12" height="8" rx="2" fill="#ffffff" fillOpacity={0.2} />
        <rect x="26" y="46" width="12" height="8" rx="2" fill={accentColor} fillOpacity={0.6} />
        <rect x="42" y="46" width="12" height="8" rx="2" fill="#ffffff" fillOpacity={0.2} />
      </svg>
    );
  }

  // 4. Badge variant (128x128)
  if (variant === "badge") {
    return (
      <svg
        id={effectiveId}
        className={`lowcode-page-icon lowcode-page-icon-badge ${className}`}
        width={numSize}
        height={numSize}
        viewBox="0 0 128 128"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={ariaLabel}
        style={style}
        onClick={onClick}
      >
        {title && <title>{title}</title>}
        <defs>
          <linearGradient id={`${effectiveId}-bbg`} x1="8" y1="8" x2="120" y2="120" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={secondaryColor} />
            <stop offset="60%" stopColor={primaryColor} />
            <stop offset="100%" stopColor="#311075" />
          </linearGradient>
        </defs>
        <rect width="128" height="128" rx="28" fill={`url(#${effectiveId}-bbg)`} />
        <rect x="2" y="2" width="124" height="124" rx="26" fill="none" stroke="#ffffff" strokeOpacity={0.2} strokeWidth="2" />
        <rect x="18" y="18" width="92" height="12" rx="4" fill="#0f172a" fillOpacity={0.35} />
        <circle cx="25" cy="24" r="2.5" fill="#f43f5e" />
        <circle cx="33" cy="24" r="2.5" fill="#fbbf24" />
        <circle cx="41" cy="24" r="2.5" fill={accentColor} />
        <rect x="18" y="34" width="92" height="42" rx="6" fill="#ffffff" fillOpacity={0.14} stroke="#ffffff" strokeOpacity={0.2} strokeWidth="1" />
        <rect x="26" y="42" width="40" height="6" rx="2" fill="#ffffff" />
        <rect x="26" y="52" width="28" height="4" rx="1.5" fill="#ffffff" fillOpacity={0.6} />
        <rect x="26" y="60" width="22" height="8" rx="3" fill={accentColor} />
        <path d="M 74 44 L 84 62 L 94 44" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="18" y="82" width="26" height="28" rx="5" fill="#ffffff" fillOpacity={0.08} stroke="#ffffff" strokeOpacity={0.15} />
        <rect x="51" y="82" width="26" height="28" rx="5" fill="#ffffff" fillOpacity={0.2} stroke="#ffffff" strokeOpacity={0.25} />
        <rect x="84" y="82" width="26" height="28" rx="5" fill="#ffffff" fillOpacity={0.08} stroke="#ffffff" strokeOpacity={0.15} />
      </svg>
    );
  }

  // 5. Standard / Squircle variant (512x512)
  const isSquircle = variant === "squircle";
  const containerRx = isSquircle ? "112" : "96";

  return (
    <svg
      id={effectiveId}
      className={`lowcode-page-icon lowcode-page-icon-${variant} ${className}`}
      width={numSize}
      height={numSize}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={ariaLabel}
      style={style}
      onClick={onClick}
    >
      {title && <title>{title}</title>}
      <defs>
        <linearGradient id={`${effectiveId}-bg`} x1="48" y1="32" x2="464" y2="480" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={secondaryColor} />
          <stop offset="50%" stopColor={primaryColor} />
          <stop offset="100%" stopColor="#4318c4" />
        </linearGradient>
        <linearGradient id={`${effectiveId}-card-bg`} x1="80" y1="140" x2="432" y2="290" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" stopOpacity={0.18} />
          <stop offset="100%" stopColor="#ffffff" stopOpacity={0.06} />
        </linearGradient>
        <linearGradient id={`${effectiveId}-cta`} x1="108" y1="236" x2="228" y2="268" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={accentColor} />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        <linearGradient id={`${effectiveId}-accent-card`} x1="204" y1="310" x2="308" y2="430" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" stopOpacity={0.24} />
          <stop offset="100%" stopColor="#ffffff" stopOpacity={0.1} />
        </linearGradient>
        <linearGradient id={`${effectiveId}-headline`} x1="108" y1="172" x2="288" y2="192" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e0e7ff" />
        </linearGradient>
        {includeDropShadow && (
          <filter id={`${effectiveId}-shadow`} x="-10%" y="-10%" width="125%" height="125%">
            <feDropShadow dx="0" dy="12" stdDeviation="16" floodColor="#1e1b4b" floodOpacity={0.4} />
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#1e1b4b" floodOpacity={0.25} />
          </filter>
        )}
      </defs>

      {/* Squircle Base Canvas Container */}
      <rect
        width="512"
        height="512"
        rx={containerRx}
        fill={`url(#${effectiveId}-bg)`}
        filter={includeDropShadow ? `url(#${effectiveId}-shadow)` : undefined}
      />
      <rect
        x="2"
        y="2"
        width="508"
        height="508"
        rx={Number(containerRx) - 2}
        fill="none"
        stroke="#ffffff"
        strokeOpacity={0.18}
        strokeWidth="4"
      />

      {/* Ambient Light Reflection */}
      <path d="M 48 160 C 48 100, 100 48, 160 48 L 352 48 C 220 48, 48 180, 48 300 Z" fill="#ffffff" fillOpacity={0.07} />

      {/* Browser / Workspace Header Bar */}
      <rect x="76" y="76" width="360" height="42" rx="12" fill="#0f172a" fillOpacity={0.32} stroke="#ffffff" strokeOpacity={0.12} strokeWidth="1.5" />
      <circle cx="102" cy="97" r="5" fill="#f43f5e" />
      <circle cx="118" cy="97" r="5" fill="#fbbf24" />
      <circle cx="134" cy="97" r="5" fill={accentColor} />
      <rect x="160" y="87" width="192" height="20" rx="6" fill="#ffffff" fillOpacity={0.14} />

      {/* Hero Section Card */}
      <rect x="76" y="134" width="360" height="152" rx="18" fill={`url(#${effectiveId}-card-bg)`} stroke="#ffffff" strokeOpacity={0.22} strokeWidth="1.5" />

      {/* Hero Section Headline & Subheadline */}
      <rect x="104" y="162" width="168" height="20" rx="6" fill={`url(#${effectiveId}-headline)`} />
      <rect x="104" y="192" width="132" height="10" rx="5" fill="#ffffff" fillOpacity={0.65} />
      <rect x="104" y="208" width="96" height="10" rx="5" fill="#ffffff" fillOpacity={0.45} />

      {/* CTA Button with Spark */}
      <rect x="104" y="232" width="112" height="34" rx="10" fill={`url(#${effectiveId}-cta)`} />
      <rect x="122" y="244" width="56" height="10" rx="5" fill="#0f172a" fillOpacity={0.85} />
      <path d="M 190 249 L 198 249 M 195 245 L 199 249 L 195 253" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Hero Right Side: Layered Floating Preview Canvas */}
      <g transform="translate(290, 150)">
        <rect x="12" y="12" width="114" height="114" rx="14" fill="#1e1b4b" fillOpacity={0.4} stroke="#ffffff" strokeOpacity={0.15} strokeWidth="1.5" />
        <rect x="0" y="0" width="114" height="114" rx="14" fill="#0f172a" fillOpacity={0.6} stroke="#ffffff" strokeOpacity={0.25} strokeWidth="1.5" />
        <path d="M 32 34 L 57 84 L 82 34" stroke={`url(#${effectiveId}-cta)`} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="57" cy="84" r="4" fill={accentColor} />
        <path d="M 80 72 L 80 94 L 86 88 L 94 98 L 98 95 L 90 85 L 98 85 Z" fill="#ffffff" stroke="#0f172a" strokeWidth="1.5" />
      </g>

      {/* Bottom Grid Cards */}
      <g transform="translate(76, 302)">
        <rect width="108" height="126" rx="16" fill="#ffffff" fillOpacity={0.08} stroke="#ffffff" strokeOpacity={0.14} strokeWidth="1.5" />
        <circle cx="34" cy="32" r="14" fill={accentColor} fillOpacity={0.25} stroke={accentColor} strokeWidth="1.5" />
        <path d="M 28 32 L 32 36 L 40 28" stroke={accentColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="18" y="58" width="72" height="10" rx="5" fill="#ffffff" fillOpacity={0.75} />
        <rect x="18" y="76" width="54" height="8" rx="4" fill="#ffffff" fillOpacity={0.45} />
        <rect x="18" y="90" width="64" height="8" rx="4" fill="#ffffff" fillOpacity={0.3} />
      </g>

      <g transform="translate(202, 302)">
        <rect width="108" height="126" rx="16" fill={`url(#${effectiveId}-accent-card)`} stroke="#ffffff" strokeOpacity={0.3} strokeWidth="1.5" />
        <circle cx="34" cy="32" r="14" fill="#fbbf24" fillOpacity={0.25} stroke="#fbbf24" strokeWidth="1.5" />
        <path d="M 34 22 L 28 32 L 34 32 L 34 42 L 40 32 L 34 32 Z" fill="#fbbf24" />
        <rect x="18" y="58" width="72" height="10" rx="5" fill="#ffffff" fillOpacity={0.95} />
        <rect x="18" y="76" width="58" height="8" rx="4" fill="#ffffff" fillOpacity={0.65} />
        <rect x="18" y="90" width="48" height="8" rx="4" fill="#ffffff" fillOpacity={0.4} />
      </g>

      <g transform="translate(328, 302)">
        <rect width="108" height="126" rx="16" fill="#ffffff" fillOpacity={0.08} stroke="#ffffff" strokeOpacity={0.14} strokeWidth="1.5" />
        <circle cx="34" cy="32" r="14" fill="#c084fc" fillOpacity={0.25} stroke="#c084fc" strokeWidth="1.5" />
        <path d="M 34 24 L 42 28 L 34 32 L 26 28 Z M 26 33 L 34 37 L 42 33 M 26 38 L 34 42 L 42 38" stroke="#c084fc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="18" y="58" width="72" height="10" rx="5" fill="#ffffff" fillOpacity={0.75} />
        <rect x="18" y="76" width="50" height="8" rx="4" fill="#ffffff" fillOpacity={0.45} />
        <rect x="18" y="90" width="60" height="8" rx="4" fill="#ffffff" fillOpacity={0.3} />
      </g>

      {/* Top-Right Sparkle */}
      <path d="M 424 56 Q 424 72 440 72 Q 424 72 424 88 Q 424 72 408 72 Q 424 72 424 56 Z" fill="#ffffff" fillOpacity={0.85} />
    </svg>
  );
}

export default LowcodeIcon;
