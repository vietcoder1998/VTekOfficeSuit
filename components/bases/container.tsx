"use client";

import React, { ElementType, forwardRef, ReactNode, useEffect, useState } from "react";
import {
    lc_div_variants_engine,
    type DivVariant,
} from "./div-variants";
import {
    BaseDiv,
    Div,
    DivBetween,
    DivCard,
    DivCenter,
    DivCol,
    DivDivider,
    DivGlass,
    DivGrid,
    DivPanel,
    DivRow,
    DivSpacer,
    DivStack,
} from "./div";

export type ContainerVariant =
  | "default"
  | "surface"
  | "panel"
  | "card"
  | "subbar"
  | "toolbar"
  | "stage"
  | "muted"
  | "bordered"
  | "fluid"
  | "shell"
  | "glass"
  | "dashboard"
  | "row"
  | "col"
  | "flex"
  | "center"
  | "between"
  | "around"
  | "grid"
  | "divider"
  | "spacer"
  | "unstyled"
  | "none";

export type ContainerSize =
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "full"
  | "screen"
  | "fluid"
  | "none";

export type ContainerLayout = "block" | "flex" | "row" | "col" | "grid";
export type ContainerAlign = "start" | "center" | "end" | "stretch" | "baseline";
export type ContainerJustify = "start" | "center" | "end" | "between" | "around" | "evenly";
export type ContainerGap = "none" | "xs" | "sm" | "md" | "lg" | "xl" | number | string;
export type ContainerPadding = "none" | "xs" | "sm" | "md" | "lg" | "xl" | number | string;
export type ContainerRounded = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "full" | boolean;
export type ContainerShadow = "none" | "sm" | "md" | "lg" | boolean;

export interface ContainerProps extends React.HTMLAttributes<HTMLElement> {
  as?: ElementType;
  variant?: ContainerVariant;
  size?: ContainerSize;
  layout?: ContainerLayout;
  direction?: "row" | "col" | "row-reverse" | "col-reverse";
  align?: ContainerAlign;
  justify?: ContainerJustify;
  gap?: ContainerGap;
  padding?: ContainerPadding;
  bordered?: boolean;
  rounded?: ContainerRounded;
  shadow?: ContainerShadow;
  scrollable?: boolean | "x" | "y" | "both";
  centered?: boolean;
  fillHeight?: boolean;
  fillWidth?: boolean;
}

/**
 * ── 1. BASE CONTAINER COMPONENT ──
 */
export const Container = forwardRef<HTMLElement, ContainerProps>(
  (
    {
      as: Component = "div",
      variant = "default",
      size,
      layout,
      direction,
      align,
      justify,
      gap,
      padding,
      bordered,
      rounded,
      shadow,
      scrollable,
      centered = false,
      fillHeight = false,
      fillWidth = false,
      className = "",
      style,
      children,
      ...rest
    },
    ref
  ) => {
    const isUnstyled = variant === "unstyled" || variant === "none";
    const specs = lc_div_variants_engine.resolveVariantSpecs(variant as DivVariant);
    const variantClass = isUnstyled || variant === "default" ? "" : specs.className || `base-container-${variant}`;
    const sizeClass = size && size !== "none" && size !== "fluid" ? `base-container-${size}` : "";

    // Layout classes
    let layoutClass = "";
    if (centered) {
      layoutClass = "base-container-centered";
    } else if (layout) {
      layoutClass = `base-container-${layout}`;
    } else if (direction) {
      layoutClass = direction === "col" || direction === "col-reverse" ? "base-container-col" : "base-container-row";
    }

    const alignClass = align ? `base-container-align-${align}` : "";
    const justifyClass = justify ? `base-container-justify-${justify}` : "";

    // Gap class
    const gapClass =
      typeof gap === "string" && ["none", "xs", "sm", "md", "lg", "xl"].includes(gap)
        ? `base-container-gap-${gap}`
        : "";

    // Padding class
    const paddingClass =
      typeof padding === "string" && ["none", "xs", "sm", "md", "lg", "xl"].includes(padding)
        ? `base-container-p-${padding}`
        : "";

    // Bordered class
    const borderClass = bordered ? "base-container-bordered" : "";

    // Rounded class
    let roundedClass = "";
    if (typeof rounded === "boolean" && rounded) {
      roundedClass = "base-container-rounded-md";
    } else if (typeof rounded === "string" && rounded !== "none") {
      roundedClass = `base-container-rounded-${rounded}`;
    }

    // Shadow class
    let shadowClass = "";
    if (typeof shadow === "boolean" && shadow) {
      shadowClass = "base-container-shadow-sm";
    } else if (typeof shadow === "string" && shadow !== "none") {
      shadowClass = `base-container-shadow-${shadow}`;
    }

    // Scrollable class
    let scrollClass = "";
    if (scrollable === true || scrollable === "y") {
      scrollClass = "base-container-scroll-y";
    } else if (scrollable === "x") {
      scrollClass = "base-container-scroll-x";
    } else if (scrollable === "both") {
      scrollClass = "base-container-scroll-both";
    }

    const fillHeightClass = fillHeight ? "base-container-fill-height" : "";
    const fillWidthClass = fillWidth ? "base-container-fill-width" : "";
    const baseClass = isUnstyled ? "" : "base-container";

    const customStyle: React.CSSProperties & Record<string, any> = { ...style };
    if (typeof gap === "number" || (typeof gap === "string" && !["none", "xs", "sm", "md", "lg", "xl"].includes(gap))) {
      customStyle.gap = gap;
    }
    if (typeof padding === "number" || (typeof padding === "string" && !["none", "xs", "sm", "md", "lg", "xl"].includes(padding))) {
      customStyle.padding = padding;
    }

    const combinedClassName = [
      baseClass,
      variantClass,
      sizeClass,
      layoutClass,
      alignClass,
      justifyClass,
      gapClass,
      paddingClass,
      borderClass,
      roundedClass,
      shadowClass,
      scrollClass,
      fillHeightClass,
      fillWidthClass,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const autoId = React.useId ? React.useId() : "";
    const prefix = lc_div_variants_engine.getDefaultIdPrefix("container", variant);
    const cleanId = autoId.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
    const sanitizedAutoId = cleanId ? `${prefix}${cleanId}` : undefined;
    const effectiveId = rest.id || sanitizedAutoId;

    return (
      <Component
        ref={ref}
        id={effectiveId}
        className={combinedClassName || undefined}
        style={Object.keys(customStyle).length > 0 ? customStyle : undefined}
        {...rest}
      >
        {children}
      </Component>
    );
  }
);
Container.displayName = "BaseContainer";

/**
 * ── 2. CONTAINER HEADER ──
 */
export interface ContainerHeaderProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  as?: ElementType;
  title?: ReactNode;
  subtitle?: ReactNode;
  icon?: ReactNode;
  badge?: ReactNode;
  actions?: ReactNode;
  borderBottom?: boolean;
  sticky?: boolean;
}

export const ContainerHeader = forwardRef<HTMLElement, ContainerHeaderProps>(
  (
    {
      as: Component = "header",
      title,
      subtitle,
      icon,
      badge,
      actions,
      borderBottom = false,
      sticky = true,
      className = "",
      style,
      children,
      ...rest
    },
    ref
  ) => {
    const stickyStyle: React.CSSProperties = sticky
      ? {
          position: "sticky",
          top: 0,
          zIndex: 40,
          flexShrink: 0,
        }
      : {};

    const mergedStyle: React.CSSProperties = {
      ...stickyStyle,
      ...style,
    };

    const autoId = React.useId ? React.useId() : "";
    const effectiveId = rest.id || (autoId ? `base-container-header-${autoId.replace(/[^a-zA-Z0-9_-]/g, "")}` : undefined);

    return (
      <Component
        ref={ref}
        id={effectiveId}
        className={`base-container-header ${sticky ? "sticky-header" : ""} ${borderBottom ? "with-border" : ""} ${className}`.trim()}
        style={mergedStyle}
        {...rest}
      >
        {(title || subtitle || icon || badge) && (
          <div id={`${effectiveId}-title-group`} className="base-container-header-title-group flex items-center gap-2">
            {icon && <span id={`${effectiveId}-icon`} className="base-container-header-icon">{icon}</span>}
            <div id={`${effectiveId}-title-wrapper`}>
              {title && (
                <div id={`${effectiveId}-title-row`} className="flex items-center gap-1-5">
                  <span id={`${effectiveId}-title-text`} className="base-container-header-title font-bold">
                    {title}
                  </span>
                  {badge && <span id={`${effectiveId}-badge`} className="base-container-header-badge">{badge}</span>}
                </div>
              )}
              {subtitle && (
                <div id={`${effectiveId}-subtitle`} className="base-container-header-subtitle text-xs text-muted">
                  {subtitle}
                </div>
              )}
            </div>
          </div>
        )}
        {children}
        {actions && <div id={`${effectiveId}-actions`} className="base-container-header-actions flex items-center gap-1-5">{actions}</div>}
      </Component>
    );
  }
);
ContainerHeader.displayName = "BaseContainerHeader";

/**
 * ── 3. CONTAINER BODY ──
 */
export interface ContainerBodyProps extends React.HTMLAttributes<HTMLElement> {
  as?: ElementType;
  variant?: ContainerVariant;
  scrollable?: boolean | "x" | "y" | "both";
  padding?: ContainerPadding;
  fillHeight?: boolean;
}

export const ContainerBody = forwardRef<HTMLElement, ContainerBodyProps>(
  ({ as: Component = "div", variant, scrollable = true, padding = "md", fillHeight = true, className = "", style, children, ...rest }, ref) => {
    let scrollClass = "";
    if (scrollable === true || scrollable === "y") scrollClass = "base-container-scroll-y";
    else if (scrollable === "x") scrollClass = "base-container-scroll-x";
    else if (scrollable === "both") scrollClass = "base-container-scroll-both";

    const variantClass = variant ? `base-container-${variant}` : "";

    const paddingClass =
      typeof padding === "string" && ["none", "xs", "sm", "md", "lg", "xl"].includes(padding)
        ? `base-container-p-${padding}`
        : "";

    const fillClass = fillHeight ? "base-container-fill-height" : "";

    const customStyle: React.CSSProperties & Record<string, any> = { ...style };
    if (typeof padding === "number" || (typeof padding === "string" && !["none", "xs", "sm", "md", "lg", "xl"].includes(padding))) {
      customStyle.padding = padding;
    }

    const autoId = React.useId ? React.useId() : "";
    const effectiveId = rest.id || (autoId ? `base-container-body-${autoId.replace(/[^a-zA-Z0-9_-]/g, "")}` : undefined);

    return (
      <Component
        ref={ref}
        id={effectiveId}
        className={`base-container-body ${variantClass} ${scrollClass} ${paddingClass} ${fillClass} ${className}`.replace(/\s+/g, " ").trim()}
        style={Object.keys(customStyle).length > 0 ? customStyle : undefined}
        {...rest}
      >
        {children}
      </Component>
    );
  }
);
ContainerBody.displayName = "BaseContainerBody";

/**
 * ── 4. CONTAINER FOOTER ──
 */
export interface ContainerFooterProps extends React.HTMLAttributes<HTMLElement> {
  as?: ElementType;
  borderTop?: boolean;
  justify?: ContainerJustify;
}

export const ContainerFooter = forwardRef<HTMLElement, ContainerFooterProps>(
  ({ as: Component = "footer", borderTop = true, justify = "end", className = "", children, ...rest }, ref) => {
    const justifyClass = justify ? `base-container-justify-${justify}` : "";
    const autoId = React.useId ? React.useId() : "";
    const effectiveId = rest.id || (autoId ? `base-container-footer-${autoId.replace(/[^a-zA-Z0-9_-]/g, "")}` : undefined);

    return (
      <Component
        ref={ref}
        id={effectiveId}
        className={`base-container-footer ${borderTop ? "with-border" : ""} ${justifyClass} ${className}`.trim()}
        {...rest}
      >
        {children}
      </Component>
    );
  }
);
ContainerFooter.displayName = "BaseContainerFooter";

/**
 * ── 5. CONTAINER SIDEBAR ──
 */
export interface ContainerSidebarProps extends React.HTMLAttributes<HTMLElement> {
  as?: ElementType;
  width?: number | string;
  collapsed?: boolean;
  side?: "left" | "right";
  border?: boolean;
  storageKey?: string;
  minWidth?: number;
  maxWidth?: number;
}

export const ContainerSidebar = forwardRef<HTMLElement, ContainerSidebarProps>(
  (
    {
      as: Component = "aside",
      width = 280,
      collapsed = false,
      side = "left",
      border = true,
      storageKey,
      minWidth,
      maxWidth,
      className = "",
      style,
      children,
      ...rest
    },
    ref
  ) => {
    const [persistedWidth, setPersistedWidth] = useState<number | string>(width);

    useEffect(() => {
      if (!storageKey || typeof window === "undefined" || !window.localStorage) return;
      try {
        const saved = window.localStorage.getItem(storageKey);
        if (saved) {
          const parsed = parseInt(saved, 10);
          if (!isNaN(parsed)) {
            let clamped = parsed;
            if (typeof minWidth === "number" && clamped < minWidth) clamped = minWidth;
            if (typeof maxWidth === "number" && clamped > maxWidth) clamped = maxWidth;
            setPersistedWidth(clamped);
          }
        }
      } catch {}
    }, [storageKey, minWidth, maxWidth]);

    const activeWidth = storageKey ? persistedWidth : width;

    const customStyle: React.CSSProperties & Record<string, any> = { ...style };
    if (activeWidth !== undefined && !collapsed) {
      customStyle.width = typeof activeWidth === "number" ? `${activeWidth}px` : activeWidth;
    } else if (collapsed) {
      customStyle.width = "48px";
    }

    const sideBorderClass = border ? (side === "left" ? "border-right" : "border-left") : "";

    const autoId = React.useId ? React.useId() : "";
    const effectiveId = rest.id || (autoId ? `base-container-sidebar-${autoId.replace(/[^a-zA-Z0-9_-]/g, "")}` : undefined);

    return (
      <Component
        ref={ref}
        id={effectiveId}
        className={`base-container-sidebar ${sideBorderClass} ${collapsed ? "collapsed" : ""} ${className}`.trim()}
        style={customStyle}
        {...rest}
      >
        {children}
      </Component>
    );
  }
);
ContainerSidebar.displayName = "BaseContainerSidebar";

/**
 * ── 6. CONTAINER TOOLBAR ──
 */
export interface ContainerToolbarProps extends React.HTMLAttributes<HTMLElement> {
  as?: ElementType;
  justify?: ContainerJustify;
  align?: ContainerAlign;
  gap?: ContainerGap;
}

export const ContainerToolbar = forwardRef<HTMLElement, ContainerToolbarProps>(
  ({ as: Component = "div", justify = "between", align = "center", gap = "sm", className = "", children, ...rest }, ref) => {
    const justifyClass = justify ? `base-container-justify-${justify}` : "";
    const alignClass = align ? `base-container-align-${align}` : "";
    const gapClass = typeof gap === "string" && ["none", "xs", "sm", "md", "lg", "xl"].includes(gap) ? `base-container-gap-${gap}` : "";

    const autoId = React.useId ? React.useId() : "";
    const effectiveId = rest.id || (autoId ? `base-container-toolbar-${autoId.replace(/[^a-zA-Z0-9_-]/g, "")}` : undefined);

    return (
      <Component
        ref={ref}
        id={effectiveId}
        className={`base-container-toolbar ${justifyClass} ${alignClass} ${gapClass} ${className}`.trim()}
        {...rest}
      >
        {children}
      </Component>
    );
  }
);
ContainerToolbar.displayName = "BaseContainerToolbar";

/**
 * ── 7. CONTAINER GRID ──
 */
export interface ContainerGridProps extends React.HTMLAttributes<HTMLElement> {
  as?: ElementType;
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12 | "auto-fit" | "auto-fill" | string;
  columns?: 1 | 2 | 3 | 4 | 5 | 6 | 12 | "auto-fit" | "auto-fill" | string;
  minChildWidth?: string | number;
  gap?: ContainerGap;
  padding?: ContainerPadding;
}

export const ContainerGrid = forwardRef<HTMLElement, ContainerGridProps>(
  (
    {
      as: Component = "div",
      cols,
      columns = "auto-fill",
      minChildWidth = "280px",
      gap = "md",
      padding = "none",
      className = "",
      style,
      children,
      ...rest
    },
    ref
  ) => {
    const effectiveCols = cols !== undefined ? cols : columns;
    const customStyle: React.CSSProperties & Record<string, any> = { ...style };
    let colsClass = "";

    if (typeof effectiveCols === "number") {
      customStyle.gridTemplateColumns = `repeat(${effectiveCols}, minmax(0, 1fr))`;
      colsClass = `base-container-grid-cols-${effectiveCols}`;
    } else if (effectiveCols === "auto-fit" || effectiveCols === "auto-fill") {
      const minW = typeof minChildWidth === "number" ? `${minChildWidth}px` : minChildWidth;
      customStyle.gridTemplateColumns = `repeat(${effectiveCols}, minmax(${minW}, 1fr))`;
    } else if (typeof effectiveCols === "string") {
      customStyle.gridTemplateColumns = effectiveCols;
    }

    if (typeof gap === "number") customStyle.gap = gap;
    if (typeof padding === "number") customStyle.padding = padding;

    const gapClass = typeof gap === "string" && ["none", "xs", "sm", "md", "lg", "xl"].includes(gap) ? `base-container-gap-${gap}` : "";
    const paddingClass = typeof padding === "string" && ["none", "xs", "sm", "md", "lg", "xl"].includes(padding) ? `base-container-p-${padding}` : "";

    const autoId = React.useId ? React.useId() : "";
    const effectiveId = rest.id || (autoId ? `base-container-grid-${autoId.replace(/[^a-zA-Z0-9_-]/g, "")}` : undefined);

    return (
      <Component
        ref={ref}
        id={effectiveId}
        className={`base-container-grid ${colsClass} ${gapClass} ${paddingClass} ${className}`.trim()}
        style={customStyle}
        {...rest}
      >
        {children}
      </Component>
    );
  }
);
ContainerGrid.displayName = "BaseContainerGrid";

/**
 * ── 8. CONTAINER ROW / FLEX ──
 */
export interface ContainerRowProps extends React.HTMLAttributes<HTMLElement> {
  as?: ElementType;
  align?: ContainerAlign;
  justify?: ContainerJustify;
  gap?: ContainerGap;
  padding?: ContainerPadding;
  wrap?: boolean | "wrap" | "nowrap" | "wrap-reverse";
  scrollable?: boolean | "x" | "y" | "both";
}

export const ContainerRow = forwardRef<HTMLElement, ContainerRowProps>(
  ({ as: Component = "div", align = "center", justify = "start", gap = "sm", padding, wrap = false, scrollable, className = "", style, children, ...rest }, ref) => {
    const alignClass = align ? `base-container-align-${align}` : "";
    const justifyClass = justify ? `base-container-justify-${justify}` : "";
    const gapClass = typeof gap === "string" && ["none", "xs", "sm", "md", "lg", "xl"].includes(gap) ? `base-container-gap-${gap}` : "";
    const paddingClass = typeof padding === "string" && ["none", "xs", "sm", "md", "lg", "xl"].includes(padding) ? `base-container-p-${padding}` : "";

    let scrollClass = "";
    if (scrollable === true || scrollable === "x") scrollClass = "base-container-scroll-x";
    else if (scrollable === "y") scrollClass = "base-container-scroll-y";
    else if (scrollable === "both") scrollClass = "base-container-scroll-both";

    const customStyle: React.CSSProperties & Record<string, any> = { ...style };
    if (wrap === true || wrap === "wrap") customStyle.flexWrap = "wrap";
    else if (wrap === "wrap-reverse") customStyle.flexWrap = "wrap-reverse";
    else if (wrap === "nowrap") customStyle.flexWrap = "nowrap";

    if (typeof gap === "number") customStyle.gap = gap;
    if (typeof padding === "number" || (typeof padding === "string" && !["none", "xs", "sm", "md", "lg", "xl"].includes(padding))) {
      customStyle.padding = padding;
    }

    const autoId = React.useId ? React.useId() : "";
    const effectiveId = rest.id || (autoId ? `base-container-row-${autoId.replace(/[^a-zA-Z0-9_-]/g, "")}` : undefined);

    return (
      <Component
        ref={ref}
        id={effectiveId}
        className={`base-container-row base-container-direction-row ${alignClass} ${justifyClass} ${gapClass} ${paddingClass} ${scrollClass} ${className}`.replace(/\s+/g, " ").trim()}
        style={customStyle}
        {...rest}
      >
        {children}
      </Component>
    );
  }
);
ContainerRow.displayName = "BaseContainerRow";
export const ContainerFlex = ContainerRow;

/**
 * ── 9. CONTAINER COL / STACK ──
 */
export interface ContainerColProps extends React.HTMLAttributes<HTMLElement> {
  as?: ElementType;
  align?: ContainerAlign;
  justify?: ContainerJustify;
  gap?: ContainerGap;
  padding?: ContainerPadding;
  fillHeight?: boolean;
  scrollable?: boolean | "x" | "y" | "both";
}

export const ContainerCol = forwardRef<HTMLElement, ContainerColProps>(
  ({ as: Component = "div", align = "stretch", justify = "start", gap = "sm", padding, fillHeight = false, scrollable, className = "", style, children, ...rest }, ref) => {
    const alignClass = align ? `base-container-align-${align}` : "";
    const justifyClass = justify ? `base-container-justify-${justify}` : "";
    const gapClass = typeof gap === "string" && ["none", "xs", "sm", "md", "lg", "xl"].includes(gap) ? `base-container-gap-${gap}` : "";
    const paddingClass = typeof padding === "string" && ["none", "xs", "sm", "md", "lg", "xl"].includes(padding) ? `base-container-p-${padding}` : "";
    const fillClass = fillHeight ? "base-container-fill-height" : "";

    let scrollClass = "";
    if (scrollable === true || scrollable === "y") scrollClass = "base-container-scroll-y";
    else if (scrollable === "x") scrollClass = "base-container-scroll-x";
    else if (scrollable === "both") scrollClass = "base-container-scroll-both";

    const customStyle: React.CSSProperties & Record<string, any> = { ...style };
    if (typeof gap === "number") customStyle.gap = gap;
    if (typeof padding === "number" || (typeof padding === "string" && !["none", "xs", "sm", "md", "lg", "xl"].includes(padding))) {
      customStyle.padding = padding;
    }

    const autoId = React.useId ? React.useId() : "";
    const effectiveId = rest.id || (autoId ? `base-container-col-${autoId.replace(/[^a-zA-Z0-9_-]/g, "")}` : undefined);

    return (
      <Component
        ref={ref}
        id={effectiveId}
        className={`base-container-col base-container-direction-col ${alignClass} ${justifyClass} ${gapClass} ${paddingClass} ${scrollClass} ${fillClass} ${className}`.replace(/\s+/g, " ").trim()}
        style={customStyle}
        {...rest}
      >
        {children}
      </Component>
    );
  }
);
ContainerCol.displayName = "BaseContainerCol";
export const ContainerStack = ContainerCol;

/**
 * ── 10. CONTAINER CARD ──
 */
export interface ContainerCardProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  as?: ElementType;
  title?: ReactNode;
  subtitle?: ReactNode;
  icon?: ReactNode;
  badge?: ReactNode;
  headerActions?: ReactNode;
  footer?: ReactNode;
  hoverable?: boolean;
  interactive?: boolean;
  elevated?: boolean;
  padding?: ContainerPadding;
}

export const ContainerCard = forwardRef<HTMLElement, ContainerCardProps>(
  (
    {
      as: Component = "div",
      title,
      subtitle,
      icon,
      badge,
      headerActions,
      footer,
      hoverable = false,
      interactive = false,
      elevated = false,
      padding = "md",
      className = "",
      style,
      children,
      ...rest
    },
    ref
  ) => {
    const hasHeader = Boolean(title || subtitle || icon || badge || headerActions);
    const isInteractive = interactive || hoverable;
    const hoverClass = isInteractive ? "base-container-card-hoverable base-container-card-interactive" : "";
    const shadowClass = elevated ? "base-container-shadow-md" : "base-container-shadow-sm";
    const customStyle: React.CSSProperties = {
      ...(isInteractive ? { cursor: "pointer" } : {}),
      ...style,
    };

    const autoId = React.useId ? React.useId() : "";
    const effectiveId = rest.id || (autoId ? `base-container-card-${autoId.replace(/[^a-zA-Z0-9_-]/g, "")}` : undefined);

    return (
      <Component
        ref={ref}
        id={effectiveId}
        className={`base-container-card ${hoverClass} ${shadowClass} ${className}`.trim()}
        style={Object.keys(customStyle).length > 0 ? customStyle : undefined}
        {...rest}
      >
        {hasHeader && (
          <ContainerHeader
            title={title}
            subtitle={subtitle}
            icon={icon}
            badge={badge}
            actions={headerActions}
          />
        )}
        <ContainerBody padding={padding}>{children}</ContainerBody>
        {footer && <ContainerFooter>{footer}</ContainerFooter>}
      </Component>
    );
  }
);
ContainerCard.displayName = "BaseContainerCard";

/**
 * ── 11. CONTAINER SPLIT PANE ──
 */
export interface ContainerSplitProps extends React.HTMLAttributes<HTMLElement> {
  left: ReactNode;
  right: ReactNode;
  leftWidth?: string | number;
  direction?: "horizontal" | "vertical";
}

export const ContainerSplit = forwardRef<HTMLElement, ContainerSplitProps>(
  ({ left, right, leftWidth = "300px", direction = "horizontal", className = "", style, ...rest }, ref) => {
    const isHorizontal = direction === "horizontal";
    const customStyle: React.CSSProperties = {
      display: "flex",
      flexDirection: isHorizontal ? "row" : "column",
      width: "100%",
      height: "100%",
      minHeight: 0,
      overflow: "hidden",
      ...style,
    };

    const leftStyle: React.CSSProperties = {
      width: isHorizontal ? (typeof leftWidth === "number" ? `${leftWidth}px` : leftWidth) : "100%",
      height: !isHorizontal ? (typeof leftWidth === "number" ? `${leftWidth}px` : leftWidth) : "100%",
      flexShrink: 0,
      overflowY: "auto",
    };

    return (
      <div ref={ref as any} id="base-container-split-root" className={`base-container-split ${className}`.trim()} style={customStyle} {...rest}>
        <div id="base-container-split-left" className="base-container-split-left" style={leftStyle}>
          {left}
        </div>
        <div id="base-container-split-right" className="base-container-split-right flex-1 min-w-0 min-h-0 overflow-y-auto">
          {right}
        </div>
      </div>
    );
  }
);
ContainerSplit.displayName = "BaseContainerSplit";

/**
 * ── 12. CONTAINER EMPTY STATE ──
 */
export interface ContainerEmptyStateProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  actionText?: ReactNode;
  onAction?: () => void;
  compact?: boolean;
}

export const ContainerEmptyState = forwardRef<HTMLElement, ContainerEmptyStateProps>(
  (
    {
      id = "base-container-empty-state",
      icon = "📦",
      title,
      description,
      action,
      actionText,
      onAction,
      compact = false,
      className = "",
      ...rest
    },
    ref
  ) => {
    return (
      <Container
        ref={ref}
        id={id}
        centered
        direction="col"
        gap="sm"
        padding={compact ? "sm" : "md"}
        className={`base-container-empty-state ${className}`.trim()}
        {...rest}
      >
        <div id={`${id}-icon`} className={compact ? "text-3xl mb-1" : "text-4xl mb-1"}>{icon}</div>
        <div id={`${id}-title`} className={compact ? "text-xs font-bold text-center theme-text" : "text-sm font-bold text-center theme-text"}>
          {title}
        </div>
        {description && (
          <div id={`${id}-desc`} className="text-xs text-muted text-center max-w-xs">
            {description}
          </div>
        )}
        {action ? (
          <div id={`${id}-action-slot`} className="mt-2">{action}</div>
        ) : actionText ? (
          <div id={`${id}-action-btn-wrapper`} className="mt-2">
            <button
              id={`${id}-action-btn`}
              type="button"
              onClick={onAction}
              className="base-btn base-btn-primary"
            >
              {actionText}
            </button>
          </div>
        ) : null}
      </Container>
    );
  }
);
ContainerEmptyState.displayName = "BaseContainerEmptyState";

/**
 * ── 13. CONTAINER STAT CARD ──
 */
export interface ContainerStatCardProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  title: ReactNode;
  value: ReactNode;
  subvalue?: ReactNode;
  icon?: ReactNode;
  badge?: ReactNode;
  trend?: "up" | "down" | "neutral";
  trendValue?: ReactNode;
}

export const ContainerStatCard = forwardRef<HTMLElement, ContainerStatCardProps>(
  ({ id = "base-container-stat-card", title, value, subvalue, icon, badge, trend, trendValue, className = "", ...rest }, ref) => {
    const trendColor = trend === "up" ? "#16a34a" : trend === "down" ? "#dc2626" : "var(--text-muted, #64748b)";
    const trendIcon = trend === "up" ? "↑" : trend === "down" ? "↓" : "";

    return (
      <ContainerCard ref={ref} id={id} className={`base-container-stat-card ${className}`.trim()} padding="md" {...rest}>
        <div id={`${id}-header`} className="flex items-center justify-between mb-1-5">
          <span id={`${id}-title`} className="text-xs font-semibold text-muted">{title}</span>
          {icon && <span id={`${id}-icon`} className="text-base">{icon}</span>}
        </div>
        <div id={`${id}-value`} className="text-xl font-extrabold theme-text">{value}</div>
        {(subvalue || badge || trendValue) && (
          <div id={`${id}-footer`} className="flex items-center gap-1-5 mt-1 text-xs">
            {badge}
            {trendValue && (
              <span id={`${id}-trend`} style={{ color: trendColor }} className="font-bold inline-flex items-center gap-0-5">
                {trendIcon} {trendValue}
              </span>
            )}
            {subvalue && <span id={`${id}-subvalue`} className="text-muted">{subvalue}</span>}
          </div>
        )}
      </ContainerCard>
    );
  }
);
ContainerStatCard.displayName = "BaseContainerStatCard";

/**
 * ── 14. CONTAINER SECTION ──
 */
export interface ContainerSectionProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  title?: ReactNode;
  subtitle?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  padding?: ContainerPadding;
}

export const ContainerSection = forwardRef<HTMLElement, ContainerSectionProps>(
  ({ id, title, subtitle, description, action, padding, className = "", children, ...rest }, ref) => {
    const generatedId = React.useId();
    const sectionId = id || `container-section-${generatedId.replace(/:/g, "")}`;
    const effectiveDesc = subtitle || description;
    const paddingClass =
      typeof padding === "string" && ["none", "xs", "sm", "md", "lg", "xl"].includes(padding)
        ? `base-container-p-${padding}`
        : "";

    return (
      <section
        ref={ref}
        id={sectionId}
        className={`base-container-section ${paddingClass} ${className}`.trim()}
        {...rest}
      >
        {(title || effectiveDesc || action) && (
          <div id={`${sectionId}-header`} className="base-container-section-header">
            <div id={`${sectionId}-heading-group`}>
              {title && <h2 className="base-container-section-title">{title}</h2>}
              {effectiveDesc && <p className="base-container-section-desc">{effectiveDesc}</p>}
            </div>
            {action && <div id={`${sectionId}-action`}>{action}</div>}
          </div>
        )}
        {children}
      </section>
    );
  }
);
ContainerSection.displayName = "BaseContainerSection";

/**
 * ── EXPORTS & ALIASES ──
 */
export {
    Container as BaseContainer, ContainerBody as BaseContainerBody, ContainerCard as BaseContainerCard, ContainerCol as BaseContainerCol, ContainerEmptyState as BaseContainerEmptyState, ContainerFooter as BaseContainerFooter, ContainerGrid as BaseContainerGrid, ContainerHeader as BaseContainerHeader, ContainerRow as BaseContainerRow, ContainerSection as BaseContainerSection, ContainerSidebar as BaseContainerSidebar, ContainerSplit as BaseContainerSplit, ContainerStatCard as BaseContainerStatCard, ContainerToolbar as BaseContainerToolbar, BaseDiv, Div, DivBetween, DivCard, DivCenter, DivCol, DivDivider, DivGlass, DivGrid, DivPanel, DivRow, DivSpacer, DivStack
};
