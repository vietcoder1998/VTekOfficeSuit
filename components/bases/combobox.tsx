"use client";

import React, { forwardRef, useCallback, useId } from "react";
import { lc_combobox_engine } from "./combobox-engine";
import { IdeIcon } from "./ide-icon";

export type ComboboxVariant = "split" | "navbar" | "default" | "outline" | "ghost" | "single";

export interface ComboboxItem {
  id: string;
  label: string;
  icon?: string;
  badge?: string;
  disabled?: boolean;
  group?: string;
  description?: string;
}


export interface ComboboxProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Variant of combobox: split (action + separator + chevron toggle) or single navbar/default trigger */
  variant?: ComboboxVariant;

  /** Whether the combobox trigger button is currently selected/active (Rule 18 / Highlight on select) */
  isSelected?: boolean;

  /** Alias for isSelected */
  isActive?: boolean;

  /** Label text for the main action button */
  actionLabel?: React.ReactNode;

  /** Icon name or element for the action button */
  actionIcon?: string | React.ReactNode;

  /** Whether the combobox options/flyout is open */
  isOpen?: boolean;

  /** Callback when open state toggles or changes */
  onOpenChange?: (open: boolean) => void;

  /** Primary action callback (e.g. run last build) */
  onActionClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;

  /** Options toggle button callback */
  onToggleOptions?: (e: React.MouseEvent<HTMLButtonElement>) => void;

  /** Whether the action is currently executing / building (shows spinner) */
  isBuilding?: boolean;

  /** Whether the control is disabled */
  disabled?: boolean;

  /** Whether to show ChevronDown icon on single button variant (defaults to true) */
  showChevron?: boolean;

  /** Accessible label for the main action button */
  actionAriaLabel?: string;

  /** Tooltip/title for the main action button */
  actionTitle?: string;

  /** Accessible label for options toggle button */
  optionsAriaLabel?: string;

  /** Tooltip/title for options toggle button */
  optionsTitle?: string;

  /** Predefined items list for standard select dropdown */
  items?: ComboboxItem[];

  /** Selected item ID */
  selectedItemId?: string;

  /** Callback when an item is selected from items */
  onSelectItem?: (item: ComboboxItem) => void;

  /** Custom test id for the container */
  "data-testid"?: string;

  /** Custom test id for the action button */
  actionTestId?: string;

  /** Custom test id for the options toggle button */
  optionsTestId?: string;

  /** Custom test id for the label span */
  labelTestId?: string;

  /** Custom ID for the action button (Rule 13) */
  actionId?: string;

  /** Custom ID for the options toggle button (Rule 13) */
  optionsId?: string;

  /** Custom ID for the separator element (Rule 13) */
  separatorId?: string;

  /** Custom ID for the label text element (Rule 13) */
  labelId?: string;

  /** Optional ref attached to the inner trigger button */
  buttonRef?: React.Ref<HTMLButtonElement>;

  /** Custom styles for sub-elements (e.g. splitStyles from engine) */
  splitStyles?: {
    container?: React.CSSProperties;
    runButton?: React.CSSProperties;
    separator?: React.CSSProperties;
    optionsButton?: React.CSSProperties;
  };

  /** Content of dropdown panel (e.g. rich multi-level flyout or custom list) */
  children?: React.ReactNode;
}

/**
 * Base Combobox & Split Button Component (Rule 13, 14, 18 compliant)
 * Extracted from the canonical Header Build Button
 */
export const Combobox = forwardRef<HTMLDivElement, ComboboxProps>(
  (
    {
      id,
      variant = "split",
      isSelected,
      isActive,
      actionLabel = "Build",
      actionIcon = "Play",
      isOpen = false,
      onOpenChange,
      onActionClick,
      onToggleOptions,
      isBuilding = false,
      disabled = false,
      showChevron = true,
      actionAriaLabel,
      actionTitle,
      optionsAriaLabel = "Tùy chọn",
      optionsTitle = "Tùy chọn",
      items,
      selectedItemId,
      onSelectItem,
      className = "",
      style,
      splitStyles,
      buttonRef,
      actionId,
      optionsId,
      separatorId,
      labelId,
      "data-testid": testId,
      actionTestId,
      optionsTestId,
      labelTestId,
      children,
      ...rest
    },
    ref
  ) => {
    const autoId = useId();
    const rootId = id || `base-combobox-${autoId.replace(/:/g, "")}`;
    const resolvedActionId = actionId || `${rootId}-action-btn`;
    const resolvedOptionsId = optionsId || `${rootId}-options-btn`;
    const resolvedSeparatorId = separatorId || `${rootId}-separator`;
    const resolvedLabelId = labelId || `${rootId}-label-text`;

    const handleAction = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        if (disabled || isBuilding) return;
        onActionClick?.(e);
      },
      [disabled, isBuilding, onActionClick]
    );

    const handleToggle = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        if (disabled) return;
        if (onToggleOptions) {
          onToggleOptions(e);
        } else if (onOpenChange) {
          onOpenChange(!isOpen);
        } else if (onActionClick) {
          onActionClick(e);
        }
      },
      [disabled, isOpen, onActionClick, onOpenChange, onToggleOptions]
    );

    // Only use splitStyles if explicitly provided by caller; otherwise rely on Theme CSS classes
    const effectiveSplitStyles = splitStyles || {};

    // Render Action Icon (IDE Icon or ReactNode)
    const renderIcon = () => {
      if (isBuilding) {
        return <IdeIcon name="Loader2" size={13} className="animate-spin" />;
      }
      if (typeof actionIcon === "string") {
        return <IdeIcon name={actionIcon} size={13} />;
      }
      return actionIcon;
    };

    if (variant === "split") {
      const containerClasses = lc_combobox_engine.getSplitContainerClasses(isOpen, disabled, className);
      const actionClasses = lc_combobox_engine.getActionButtonClasses(disabled, isBuilding);
      const optionsClasses = lc_combobox_engine.getOptionsButtonClasses(isOpen, disabled);

      return (
        <div
          ref={ref}
          id={rootId}
          data-testid={testId || "base-combobox-root"}
          className={containerClasses}
          style={{
            ...effectiveSplitStyles.container,
            ...style,
          }}
          {...rest}
        >
          {/* Main Action Button */}
          <button
            ref={buttonRef}
            id={resolvedActionId}
            type="button"
            data-testid={actionTestId || "base-combobox-action-btn"}
            className={actionClasses}
            onClick={handleAction}
            title={actionTitle || String(actionLabel)}
            aria-label={actionAriaLabel || String(actionLabel)}
            disabled={disabled || isBuilding}
            style={
              effectiveSplitStyles.runButton || isBuilding
                ? {
                    ...effectiveSplitStyles.runButton,
                    ...(isBuilding ? { opacity: 0.7 } : {}),
                  }
                : undefined
            }
          >
            {renderIcon()}
            {actionLabel && (
              <span
                id={resolvedLabelId}
                data-testid={labelTestId || "base-combobox-label-text"}
                className="base-combobox-label-text"
              >
                {actionLabel}
              </span>
            )}
          </button>

          {/* Vertical Divider Separator */}
          <div
            id={resolvedSeparatorId}
            data-testid="base-combobox-separator"
            className="base-combobox-separator"
            style={effectiveSplitStyles.separator || undefined}
          />

          {/* Options Dropdown Trigger Button */}
          <button
            id={resolvedOptionsId}
            type="button"
            data-testid={optionsTestId || "base-combobox-options-btn"}
            className={optionsClasses}
            onClick={handleToggle}
            title={optionsTitle}
            aria-label={optionsAriaLabel}
            disabled={disabled}
            style={effectiveSplitStyles.optionsButton || undefined}
          >
            <IdeIcon
              name="ChevronDown"
              size={11}
              className={`transition-transform duration-150 ${isOpen ? "rotate-180 opacity-100" : "opacity-80"}`}
            />
          </button>

          {/* Optional items dropdown list or custom children flyout */}
          {isOpen && items && items.length > 0 && !children && (
            <div
              id={`${rootId}-dropdown-list`}
              data-testid="base-combobox-dropdown-list"
              className="base-combobox-dropdown-list theme-surface theme-border"
            >
              {items.map((item) => (
                <button
                  key={item.id}
                  id={`${rootId}-item-${item.id}`}
                  type="button"
                  disabled={item.disabled}
                  onClick={() => {
                    onSelectItem?.(item);
                    onOpenChange?.(false);
                  }}
                  className={`base-combobox-item dropdown-item ${item.id === selectedItemId ? "active" : ""}`}
                >
                  {item.icon && <IdeIcon name={item.icon} size={12} />}
                  <span id={`${rootId}-item-${item.id}-label`} className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span
                      id={`${rootId}-item-${item.id}-badge`}
                      className="base-combobox-badge"
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Custom Children Dropdown / Flyout */}
          {isOpen && children}
        </div>
      );
    }

    // Single Button Dropdown / Navbar Variant
    const isEffectivelySelected = Boolean(isSelected || isActive);

    return (
      <div
        ref={ref}
        id={rootId}
        data-testid={testId || "base-combobox-single-container"}
        className="base-combobox-single-container"
        style={style}
        {...rest}
      >
        <button
          ref={buttonRef}
          id={resolvedActionId}
          type="button"
          data-testid={actionTestId || "base-combobox-single-btn"}
          role="button"
          aria-selected={isEffectivelySelected}
          data-active={isEffectivelySelected ? "true" : "false"}
          data-selected={isEffectivelySelected ? "true" : "false"}
          className={`base-combobox-single-btn navbar-button navbar-action-btn btn-navbar ${isEffectivelySelected ? "active selected is-active theme-active btn-highlight" : ""} ${isOpen ? "is-open" : ""} ${className}`}
          onClick={handleToggle}
          title={actionTitle || String(actionLabel)}
          aria-label={actionAriaLabel || String(actionLabel)}
          disabled={disabled || isBuilding}
        >
          {renderIcon()}
          {actionLabel && (
            <span id={resolvedLabelId} data-testid={labelTestId || "base-combobox-single-label"}>
              {actionLabel}
            </span>
          )}
          {showChevron && (
            <IdeIcon
              name="ChevronDown"
              size={11}
              className={`transition-transform duration-150 ${isOpen ? "rotate-180" : ""}`}
            />
          )}
        </button>

        {isOpen && children}
      </div>
    );
  }
);

Combobox.displayName = "Combobox";

/**
 * Sub-component alias: ComboboxSplit
 */
export const ComboboxSplit = forwardRef<HTMLDivElement, ComboboxProps>((props, ref) => (
  <Combobox ref={ref} variant="split" {...props} />
));
ComboboxSplit.displayName = "ComboboxSplit";
