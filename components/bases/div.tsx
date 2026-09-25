"use client";

import React, { ElementType, forwardRef } from "react";
import {
    lc_div_variants_engine,
    type DivAlign,
    type DivGap,
    type DivJustify,
    type DivLayout,
    type DivPadding,
    type DivRounded,
    type DivShadow,
    type DivSize,
    type DivVariant,
} from "./div-variants";

export type {
    DivAlign, DivGap, DivJustify, DivLayout, DivPadding,
    DivRounded,
    DivShadow,
    DivSize, DivVariant
};

export interface DivProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: ElementType;
  variant?: DivVariant;
  layout?: DivLayout;
  direction?: "row" | "col" | "row-reverse" | "col-reverse";
  align?: DivAlign;
  justify?: DivJustify;
  gap?: DivGap;
  padding?: DivPadding;
  rounded?: DivRounded;
  shadow?: DivShadow;
  bordered?: boolean;
  scrollable?: boolean | "x" | "y" | "both";
  centered?: boolean;
  fillHeight?: boolean;
  size?: DivSize;
  compact?: boolean;
  dense?: boolean;
  minHeight?: number | string;
  height?: number | string;
}

/**
 * ── 1. CANONICAL BASE DIV COMPONENT ──
 * Powers all variants via switch-case resolution
 */
export const Div = forwardRef<HTMLDivElement, DivProps>(
  (
    {
      as: Component = "div",
      variant = "default",
      layout,
      direction,
      align,
      justify,
      gap,
      padding,
      rounded,
      shadow,
      bordered,
      scrollable,
      centered = false,
      fillHeight = false,
      size,
      compact,
      dense,
      minHeight,
      height,
      className = "",
      style,
      id,
      children,
      ...rest
    },
    ref
  ) => {
    // Default ID auto-generation conformance according to .standards/MCP and .agents/rules
    const autoId = React.useId ? React.useId() : "";
    const prefix = lc_div_variants_engine.getDefaultIdPrefix("div", variant);
    const cleanId = autoId.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
    const sanitizedAutoId = cleanId ? `${prefix}${cleanId}` : undefined;
    const effectiveId = id || sanitizedAutoId;

    const resolved = lc_div_variants_engine.resolveDivClassesAndStyles({
      variant,
      layout,
      direction,
      align,
      justify,
      gap,
      padding,
      rounded,
      shadow,
      bordered,
      scrollable,
      centered,
      fillHeight,
      size,
      compact,
      dense,
      minHeight,
      height,
      className,
      style,
    });

    const effectiveStyle =
      resolved.customStyle && Object.keys(resolved.customStyle).length > 0
        ? resolved.customStyle
        : undefined;

    return (
      <Component
        ref={ref}
        id={effectiveId}
        className={resolved.className || undefined}
        style={effectiveStyle}
        {...rest}
      >
        {children}
      </Component>
    );
  }
);
Div.displayName = "BaseDiv";

/**
 * ── CONVENIENCE PRESET WRAPPERS ──
 */

export const DivRow = forwardRef<HTMLDivElement, Omit<DivProps, "variant">>(
  (props, ref) => <Div ref={ref} variant="row" {...props} />
);
DivRow.displayName = "BaseDivRow";

export const DivTreeItemRow = forwardRef<HTMLDivElement, Omit<DivProps, "variant">>(
  (props, ref) => <Div ref={ref} variant="row" size="tree-item" {...props} />
);
DivTreeItemRow.displayName = "BaseDivTreeItemRow";
export const BaseDivTreeItemRow = DivTreeItemRow;

export const DivCol = forwardRef<HTMLDivElement, Omit<DivProps, "variant">>(
  (props, ref) => <Div ref={ref} variant="col" {...props} />
);
DivCol.displayName = "BaseDivCol";
export const DivStack = DivCol;

export const DivCenter = forwardRef<HTMLDivElement, Omit<DivProps, "variant">>(
  (props, ref) => <Div ref={ref} variant="center" {...props} />
);
DivCenter.displayName = "BaseDivCenter";

export const DivBetween = forwardRef<HTMLDivElement, Omit<DivProps, "variant">>(
  (props, ref) => <Div ref={ref} variant="between" {...props} />
);
DivBetween.displayName = "BaseDivBetween";

export const DivGrid = forwardRef<HTMLDivElement, Omit<DivProps, "variant">>(
  (props, ref) => <Div ref={ref} variant="grid" {...props} />
);
DivGrid.displayName = "BaseDivGrid";

export const DivCard = forwardRef<HTMLDivElement, Omit<DivProps, "variant">>(
  (props, ref) => <Div ref={ref} variant="card" {...props} />
);
DivCard.displayName = "BaseDivCard";

export const DivPanel = forwardRef<HTMLDivElement, Omit<DivProps, "variant">>(
  (props, ref) => <Div ref={ref} variant="panel" {...props} />
);
DivPanel.displayName = "BaseDivPanel";

export const DivDivider = forwardRef<HTMLDivElement, Omit<DivProps, "variant">>(
  (props, ref) => <Div ref={ref} variant="divider" {...props} />
);
DivDivider.displayName = "BaseDivDivider";

export const DivSpacer = forwardRef<HTMLDivElement, Omit<DivProps, "variant">>(
  (props, ref) => <Div ref={ref} variant="spacer" {...props} />
);
DivSpacer.displayName = "BaseDivSpacer";

export const DivGlass = forwardRef<HTMLDivElement, Omit<DivProps, "variant">>(
  (props, ref) => <Div ref={ref} variant="glass" {...props} />
);
DivGlass.displayName = "BaseDivGlass";

export { Div as BaseDiv };
export default Div;
