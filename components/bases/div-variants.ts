/**
 * .lowcode Base Div Variants Engine (lc_engines.divVariants)
 * Conforms to .lowcode/.standards/MCP/schemas/div-variants.schema.json
 * @copyright (c) 2026 V-TEK Corporation
 */

import React from "react";

export type DivVariant =
  | "default"
  | "row"
  | "col"
  | "stack"
  | "flex"
  | "center"
  | "between"
  | "around"
  | "grid"
  | "card"
  | "panel"
  | "surface"
  | "surface-muted"
  | "muted"
  | "subbar"
  | "toolbar"
  | "sidebar"
  | "stage"
  | "header"
  | "body"
  | "footer"
  | "section"
  | "scrollable"
  | "scroll-y"
  | "scroll-x"
  | "spacer"
  | "divider"
  | "divider-vertical"
  | "overlay"
  | "backdrop"
  | "glass"
  | "bordered"
  | "badge"
  | "pill"
  | "shell"
  | "unstyled"
  | "none";

export type DivLayout = "block" | "flex" | "row" | "col" | "grid";
export type DivAlign = "start" | "center" | "end" | "stretch" | "baseline";
export type DivJustify = "start" | "center" | "end" | "between" | "around" | "evenly";
export type DivGap = "none" | "xs" | "sm" | "md" | "lg" | "xl" | number | string;
export type DivPadding = "none" | "xs" | "sm" | "md" | "lg" | "xl" | number | string;
export type DivRounded = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "full" | boolean;
export type DivShadow = "none" | "sm" | "md" | "lg" | boolean;
export type DivSize = "tree-item" | "folder" | "xs" | "sm" | "md" | "lg" | "compact";

export interface ResolvedDivVariantSpecs {
  variant: DivVariant;
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
  className: string;
  defaultStyle: React.CSSProperties;
}

export interface ResolveDivProps {
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
  className?: string;
  style?: React.CSSProperties;
}

export class LcDivVariantsEngine {
  private static instance: LcDivVariantsEngine;

  public static getInstance(): LcDivVariantsEngine {
    if (!LcDivVariantsEngine.instance) {
      LcDivVariantsEngine.instance = new LcDivVariantsEngine();
    }
    return LcDivVariantsEngine.instance;
  }

  /**
   * Primary Switch-Case variant resolution for all div variants
   */
  public resolveVariantSpecs(variant: DivVariant = "default"): ResolvedDivVariantSpecs {
    switch (variant) {
      case "row":
        return {
          variant: "row",
          layout: "row",
          direction: "row",
          align: "center",
          className: "base-div-row base-container-row",
          defaultStyle: { display: "flex", flexDirection: "row", alignItems: "center" },
        };

      case "col":
      case "stack":
        return {
          variant,
          layout: "col",
          direction: "col",
          align: "stretch",
          className: "base-div-col base-container-col",
          defaultStyle: { display: "flex", flexDirection: "column", alignItems: "stretch" },
        };

      case "flex":
        return {
          variant: "flex",
          layout: "flex",
          className: "base-div-flex base-container-flex",
          defaultStyle: { display: "flex" },
        };

      case "center":
        return {
          variant: "center",
          layout: "flex",
          align: "center",
          justify: "center",
          className: "base-div-center base-container-centered",
          defaultStyle: { display: "flex", alignItems: "center", justifyContent: "center" },
        };

      case "between":
        return {
          variant: "between",
          layout: "row",
          direction: "row",
          align: "center",
          justify: "between",
          className: "base-div-between base-container-justify-between",
          defaultStyle: { display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
        };

      case "around":
        return {
          variant: "around",
          layout: "row",
          direction: "row",
          align: "center",
          justify: "around",
          className: "base-div-around base-container-justify-around",
          defaultStyle: { display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-around" },
        };

      case "grid":
        return {
          variant: "grid",
          layout: "grid",
          className: "base-div-grid base-container-grid",
          defaultStyle: { display: "grid" },
        };

      case "card":
        return {
          variant: "card",
          bordered: true,
          rounded: "md",
          shadow: "sm",
          padding: "md",
          className: "base-div-card base-container-card",
          defaultStyle: {
            backgroundColor: "var(--surface, #ffffff)",
            border: "1px solid var(--border, #e2e8f0)",
            borderRadius: "8px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
          },
        };

      case "panel":
        return {
          variant: "panel",
          bordered: true,
          rounded: "md",
          className: "base-div-panel base-container-panel",
          defaultStyle: {
            backgroundColor: "var(--panel-bg, var(--surface, #ffffff))",
            border: "1px solid var(--border, #e2e8f0)",
            borderRadius: "6px",
          },
        };

      case "surface":
        return {
          variant: "surface",
          className: "base-div-surface base-container-surface",
          defaultStyle: { backgroundColor: "var(--surface, #ffffff)" },
        };

      case "surface-muted":
      case "muted":
        return {
          variant,
          className: "base-div-muted base-container-muted",
          defaultStyle: { backgroundColor: "var(--surface-muted, #f8fafc)" },
        };

      case "stage":
        return {
          variant: "stage",
          className: "base-div-stage base-container-stage",
          defaultStyle: { backgroundColor: "var(--stage-bg, #090d16)" },
        };

      case "subbar":
        return {
          variant: "subbar",
          className: "base-div-subbar base-container-subbar",
          defaultStyle: {
            backgroundColor: "var(--surface, #ffffff)",
            borderBottom: "1px solid var(--border, #e2e8f0)",
          },
        };

      case "toolbar":
        return {
          variant: "toolbar",
          layout: "row",
          direction: "row",
          align: "center",
          justify: "between",
          gap: "sm",
          className: "base-div-toolbar base-container-toolbar",
          defaultStyle: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          },
        };

      case "sidebar":
        return {
          variant: "sidebar",
          className: "base-div-sidebar base-container-sidebar",
          defaultStyle: {
            backgroundColor: "var(--surface, #ffffff)",
            borderRight: "1px solid var(--border, #e2e8f0)",
          },
        };

      case "header":
        return {
          variant: "header",
          layout: "row",
          direction: "row",
          align: "center",
          justify: "between",
          className: "base-div-header base-container-header",
          defaultStyle: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid var(--border, #e2e8f0)",
          },
        };

      case "body":
        return {
          variant: "body",
          scrollable: "y",
          className: "base-div-body base-container-body",
          defaultStyle: { flex: 1, minHeight: 0, overflowY: "auto" },
        };

      case "footer":
        return {
          variant: "footer",
          layout: "row",
          direction: "row",
          align: "center",
          justify: "end",
          className: "base-div-footer base-container-footer",
          defaultStyle: {
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            borderTop: "1px solid var(--border, #e2e8f0)",
          },
        };

      case "section":
        return {
          variant: "section",
          className: "base-div-section base-container-section",
          defaultStyle: { marginBottom: "20px" },
        };

      case "scrollable":
      case "scroll-y":
        return {
          variant,
          scrollable: "y",
          className: "base-div-scroll-y base-container-scroll-y",
          defaultStyle: { overflowY: "auto" },
        };

      case "scroll-x":
        return {
          variant: "scroll-x",
          scrollable: "x",
          className: "base-div-scroll-x base-container-scroll-x",
          defaultStyle: { overflowX: "auto" },
        };

      case "spacer":
        return {
          variant: "spacer",
          className: "base-div-spacer",
          defaultStyle: { flex: 1 },
        };

      case "divider":
        return {
          variant: "divider",
          className: "base-div-divider",
          defaultStyle: {
            width: "100%",
            height: "1px",
            backgroundColor: "var(--border, #e2e8f0)",
            flexShrink: 0,
          },
        };

      case "divider-vertical":
        return {
          variant: "divider-vertical",
          className: "base-div-divider-vertical",
          defaultStyle: {
            width: "1px",
            height: "100%",
            minHeight: "16px",
            backgroundColor: "var(--border, #e2e8f0)",
            flexShrink: 0,
          },
        };

      case "overlay":
      case "backdrop":
        return {
          variant,
          className: "base-div-backdrop",
          defaultStyle: {
            position: "fixed",
            inset: 0,
            zIndex: 999,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(4px)",
          },
        };

      case "glass":
        return {
          variant: "glass",
          className: "base-div-glass",
          defaultStyle: {
            backdropFilter: "blur(12px)",
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            border: "1px solid var(--border, rgba(255, 255, 255, 0.12))",
          },
        };

      case "bordered":
        return {
          variant: "bordered",
          bordered: true,
          className: "base-div-bordered base-container-bordered",
          defaultStyle: { border: "1px solid var(--border, #e2e8f0)" },
        };

      case "badge":
      case "pill":
        return {
          variant,
          className: "base-div-pill",
          defaultStyle: {
            display: "inline-flex",
            alignItems: "center",
            borderRadius: "9999px",
            padding: "2px 8px",
          },
        };

      case "shell":
        return {
          variant: "shell",
          className: "base-div-shell",
          defaultStyle: {
            width: "100%",
            height: "100%",
            overflow: "hidden",
            boxSizing: "border-box",
          },
        };

      case "unstyled":
      case "none":
        return {
          variant,
          className: "",
          defaultStyle: {},
        };

      case "default":
      default:
        return {
          variant: "default",
          className: "base-div",
          defaultStyle: {},
        };
    }
  }

  /**
   * Switch-Case resolution for alignment classes
   */
  public resolveAlignClass(align?: DivAlign): string {
    switch (align) {
      case "start":
        return "base-container-align-start";
      case "center":
        return "base-container-align-center";
      case "end":
        return "base-container-align-end";
      case "stretch":
        return "base-container-align-stretch";
      case "baseline":
        return "base-container-align-baseline";
      default:
        return "";
    }
  }

  /**
   * Switch-Case resolution for justify classes
   */
  public resolveJustifyClass(justify?: DivJustify): string {
    switch (justify) {
      case "start":
        return "base-container-justify-start";
      case "center":
        return "base-container-justify-center";
      case "end":
        return "base-container-justify-end";
      case "between":
        return "base-container-justify-between";
      case "around":
        return "base-container-justify-around";
      case "evenly":
        return "base-container-justify-evenly";
      default:
        return "";
    }
  }

  /**
   * Switch-Case resolution for gap classes
   */
  public resolveGapClass(gap?: DivGap): string {
    switch (gap) {
      case "xs":
        return "base-container-gap-xs";
      case "sm":
        return "base-container-gap-sm";
      case "md":
        return "base-container-gap-md";
      case "lg":
        return "base-container-gap-lg";
      case "xl":
        return "base-container-gap-xl";
      case "none":
        return "base-container-gap-none";
      default:
        return "";
    }
  }

  /**
   * Switch-Case resolution for padding classes
   */
  public resolvePaddingClass(padding?: DivPadding): string {
    switch (padding) {
      case "xs":
        return "base-container-p-xs";
      case "sm":
        return "base-container-p-sm";
      case "md":
        return "base-container-p-md";
      case "lg":
        return "base-container-p-lg";
      case "xl":
        return "base-container-p-xl";
      case "none":
        return "base-container-p-none";
      default:
        return "";
    }
  }

  /**
   * Complete class and style builder for Div props
   */
  public resolveDivClassesAndStyles(props: ResolveDivProps): {
    className: string;
    style: React.CSSProperties;
    customStyle: React.CSSProperties;
  } {
    const specs = this.resolveVariantSpecs(props.variant);

    const layout = props.centered ? "flex" : props.layout || specs.layout;
    const direction = props.direction || specs.direction;
    const align = props.centered ? "center" : props.align || specs.align;
    const justify = props.centered ? "center" : props.justify || specs.justify;
    const gap = props.gap !== undefined ? props.gap : specs.gap;
    const padding = props.padding !== undefined ? props.padding : specs.padding;
    const bordered = props.bordered !== undefined ? props.bordered : specs.bordered;
    const rounded = props.rounded !== undefined ? props.rounded : specs.rounded;
    const shadow = props.shadow !== undefined ? props.shadow : specs.shadow;
    const scrollable = props.scrollable !== undefined ? props.scrollable : specs.scrollable;

    // Build layout classes
    let layoutClass = "";
    if (props.centered) {
      layoutClass = "base-container-centered";
    } else if (direction === "col" || direction === "col-reverse") {
      layoutClass = "base-container-col";
    } else if (direction === "row" || direction === "row-reverse") {
      layoutClass = "base-container-row";
    } else if (layout === "grid") {
      layoutClass = "base-container-grid";
    } else if (layout === "flex") {
      layoutClass = "base-container-flex";
    }

    const alignClass = this.resolveAlignClass(align);
    const justifyClass = this.resolveJustifyClass(justify);
    const gapClass = this.resolveGapClass(gap);
    const paddingClass = this.resolvePaddingClass(padding);

    // Bordered
    const borderClass = bordered ? "base-container-bordered" : "";

    // Rounded
    let roundedClass = "";
    if (rounded === true || rounded === "md") {
      roundedClass = "base-container-rounded-md";
    } else if (typeof rounded === "string" && rounded !== "none") {
      roundedClass = `base-container-rounded-${rounded}`;
    }

    // Shadow
    let shadowClass = "";
    if (shadow === true || shadow === "sm") {
      shadowClass = "base-container-shadow-sm";
    } else if (typeof shadow === "string" && shadow !== "none") {
      shadowClass = `base-container-shadow-${shadow}`;
    }

    // Scrollable
    let scrollClass = "";
    if (scrollable === true || scrollable === "y") {
      scrollClass = "base-container-scroll-y";
    } else if (scrollable === "x") {
      scrollClass = "base-container-scroll-x";
    } else if (scrollable === "both") {
      scrollClass = "base-container-scroll-both";
    }

    const fillHeightClass = props.fillHeight ? "base-container-fill-height" : "";

    const sizeClass = this.resolveDivSizeClasses({
      size: props.size,
      compact: props.compact,
      dense: props.dense,
    });

    const combinedClassName = [
      "base-div",
      specs.className,
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
      sizeClass,
      props.className,
    ]
      .filter(Boolean)
      .join(" ");

    // Compute styles
    const mergedStyle: React.CSSProperties = {
      ...specs.defaultStyle,
      ...props.style,
    };

    const customStyle: React.CSSProperties = {
      ...props.style,
    };

    if (typeof gap === "number" || (typeof gap === "string" && !["none", "xs", "sm", "md", "lg", "xl"].includes(gap))) {
      mergedStyle.gap = gap;
      customStyle.gap = gap;
    }
    if (typeof padding === "number" || (typeof padding === "string" && !["none", "xs", "sm", "md", "lg", "xl"].includes(padding))) {
      mergedStyle.padding = padding;
      customStyle.padding = padding;
    }

    // Process custom minHeight and height
    if (props.minHeight !== undefined) {
      const mh = typeof props.minHeight === "number" ? `${props.minHeight}px` : props.minHeight;
      mergedStyle.minHeight = mh;
      customStyle.minHeight = mh;
    } else if (this.isTreeItemSize(props.size, props.compact)) {
      mergedStyle.minHeight = mergedStyle.minHeight || "22px";
    }

    if (props.height !== undefined) {
      const h = typeof props.height === "number" ? `${props.height}px` : props.height;
      mergedStyle.height = h;
      customStyle.height = h;
    }

    return {
      className: combinedClassName,
      style: mergedStyle,
      customStyle,
    };
  }

  /**
   * Helper predicates & Size methods
   */
  public getTreeItemFolderStandardHeight(): number {
    return 22;
  }

  public getTreeItemFolderCssHeight(): string {
    return "22px";
  }

  public isTreeItemSize(size?: DivSize | string, compact?: boolean): boolean {
    if (compact === true) return true;
    if (!size) return false;
    return size === "tree-item" || size === "folder" || size === "compact";
  }

  public resolveDivSizeClasses(options?: {
    size?: DivSize;
    compact?: boolean;
    dense?: boolean;
  }): string {
    if (!options) return "";
    const classes: string[] = [];
    const { size, compact, dense } = options;

    if (size === "tree-item") {
      classes.push("base-div-tree-item", "base-div-size-tree-item", "base-div-compact");
    } else if (size === "folder") {
      classes.push("base-div-folder", "base-div-size-folder", "base-div-compact");
    } else if (size === "compact") {
      classes.push("base-div-compact", "base-div-tree-item");
    } else if (size === "xs") {
      classes.push("base-div-size-xs");
    } else if (size === "sm") {
      classes.push("base-div-size-sm", "base-div-compact");
    } else if (size === "md") {
      classes.push("base-div-size-md");
    } else if (size === "lg") {
      classes.push("base-div-size-lg");
    }

    if (compact && !classes.includes("base-div-compact")) {
      classes.push("base-div-compact", "base-div-tree-item");
    }

    if (dense && !classes.includes("base-div-dense")) {
      classes.push("base-div-dense");
    }

    return classes.join(" ");
  }

  public validateBaseDivSizeHeight(props: ResolveDivProps): {
    valid: boolean;
    height: number;
    isTreeItemHeight: boolean;
    classes: string[];
  } {
    const sizeClasses = this.resolveDivSizeClasses({
      size: props.size,
      compact: props.compact,
      dense: props.dense,
    })
      .split(" ")
      .filter(Boolean);

    const isTreeItem = this.isTreeItemSize(props.size, props.compact);
    let computedHeight = 22;

    if (props.size === "xs") {
      computedHeight = 20;
    } else if (props.size === "md") {
      computedHeight = 28;
    } else if (props.size === "lg") {
      computedHeight = 36;
    } else if (typeof props.height === "number") {
      computedHeight = props.height;
    }

    return {
      valid: true,
      height: computedHeight,
      isTreeItemHeight: isTreeItem || computedHeight === 22,
      classes: sizeClasses,
    };
  }
  public isFlexVariant(variant: DivVariant): boolean {
    return ["row", "col", "stack", "flex", "center", "between", "around", "toolbar", "header", "footer"].includes(variant);
  }

  public isGridVariant(variant: DivVariant): boolean {
    return variant === "grid";
  }

  public isSurfaceVariant(variant: DivVariant): boolean {
    return ["card", "panel", "surface", "surface-muted", "muted", "subbar", "stage"].includes(variant);
  }

  public getAvailableVariants(): DivVariant[] {
    return [
      "default",
      "row",
      "col",
      "stack",
      "flex",
      "center",
      "between",
      "around",
      "grid",
      "card",
      "panel",
      "surface",
      "surface-muted",
      "muted",
      "subbar",
      "toolbar",
      "sidebar",
      "stage",
      "header",
      "body",
      "footer",
      "section",
      "scrollable",
      "scroll-y",
      "scroll-x",
      "spacer",
      "divider",
      "divider-vertical",
      "overlay",
      "backdrop",
      "glass",
      "bordered",
      "badge",
      "pill",
      "shell",
      "unstyled",
      "none",
    ];
  }

  /**
   * Sinh tiền tố ID mặc định dựa theo loại component hoặc biến thể
   */
  public getDefaultIdPrefix(componentType: "div" | "container" | string = "div", variant?: string): string {
    if (componentType === "container") {
      return variant && variant !== "default" ? `base-container-${variant}-` : "base-container-";
    }
    return variant && variant !== "default" ? `base-div-${variant}-` : "base-div-";
  }

  /**
   * Đảm bảo luôn có một ID hợp lệ cho phần tử div/container
   */
  public resolveDefaultDivId(id?: string, prefix: string = "base-div-"): string {
    if (id && id.trim().length > 0) {
      return id.trim();
    }
    const cleanPrefix = prefix.endsWith("-") ? prefix : `${prefix}-`;
    const randomSuffix = Math.random().toString(36).slice(2, 10);
    return `${cleanPrefix}${randomSuffix}`;
  }

  /**
   * Đảm bảo ID phần tử thỏa mãn quy chuẩn Default ID for Div / Container
   */
  public ensureElementId(options: {
    id?: string;
    variant?: DivVariant;
    componentType?: "div" | "container";
    prefix?: string;
  }): string {
    if (options.id && options.id.trim().length > 0) {
      return options.id.trim();
    }
    const derivedPrefix = options.prefix || this.getDefaultIdPrefix(options.componentType || "div", options.variant);
    return this.resolveDefaultDivId(undefined, derivedPrefix);
  }
}

export const lc_div_variants_engine = LcDivVariantsEngine.getInstance();
