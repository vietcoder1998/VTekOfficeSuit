/**
 * LcComboboxEngine - Core Engine for Base Combobox & Split Button Components
 * Path: .lowcode/lc-combobox-engine.ts
 *
 * Implements MCP Action: bases_component_combobox (Section 227)
 * Standards: Rule 12, Rule 13, Rule 14, Rule 18
 */

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

export interface ComboboxState {
  isOpen: boolean;
  searchQuery: string;
  highlightedIndex: number;
  selectedItemId: string | null;
}

export interface ComboboxTriggerStyles {
  container: Record<string, string | number>;
  runButton: Record<string, string | number>;
  separator: Record<string, string | number>;
  optionsButton: Record<string, string | number>;
}

export class LcComboboxEngine {
  private static instance: LcComboboxEngine;

  public static getInstance(): LcComboboxEngine {
    if (!LcComboboxEngine.instance) {
      LcComboboxEngine.instance = new LcComboboxEngine();
    }
    return LcComboboxEngine.instance;
  }

  /**
   * Filter combobox items by search term
   */
  public filterItems(items: ComboboxItem[], query: string): ComboboxItem[] {
    if (!query || !query.trim()) return items;
    const cleanQuery = query.toLowerCase().trim();
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(cleanQuery) ||
        (item.description && item.description.toLowerCase().includes(cleanQuery)) ||
        (item.badge && item.badge.toLowerCase().includes(cleanQuery))
    );
  }

  /**
   * Handle keyboard navigation for combobox options
   */
  public handleKeyNavigation(
    key: string,
    items: ComboboxItem[],
    currentIndex: number,
    isOpen: boolean
  ): {
    nextIndex: number;
    shouldOpen: boolean;
    shouldClose: boolean;
    selectedItem: ComboboxItem | null;
  } {
    if (!isOpen) {
      if (key === "ArrowDown" || key === "Enter" || key === " ") {
        return { nextIndex: 0, shouldOpen: true, shouldClose: false, selectedItem: null };
      }
      return { nextIndex: currentIndex, shouldOpen: false, shouldClose: false, selectedItem: null };
    }

    const maxIndex = items.length - 1;

    switch (key) {
      case "ArrowDown": {
        const next = currentIndex < maxIndex ? currentIndex + 1 : 0;
        return { nextIndex: next, shouldOpen: true, shouldClose: false, selectedItem: null };
      }
      case "ArrowUp": {
        const next = currentIndex > 0 ? currentIndex - 1 : maxIndex;
        return { nextIndex: next, shouldOpen: true, shouldClose: false, selectedItem: null };
      }
      case "Home":
        return { nextIndex: 0, shouldOpen: true, shouldClose: false, selectedItem: null };
      case "End":
        return { nextIndex: Math.max(0, maxIndex), shouldOpen: true, shouldClose: false, selectedItem: null };
      case "Enter":
      case " ":
        if (currentIndex >= 0 && currentIndex < items.length && !items[currentIndex].disabled) {
          return { nextIndex: currentIndex, shouldOpen: false, shouldClose: true, selectedItem: items[currentIndex] };
        }
        return { nextIndex: currentIndex, shouldOpen: false, shouldClose: true, selectedItem: null };
      case "Escape":
        return { nextIndex: currentIndex, shouldOpen: false, shouldClose: true, selectedItem: null };
      default:
        return { nextIndex: currentIndex, shouldOpen: isOpen, shouldClose: false, selectedItem: null };
    }
  }

  /**
   * Compute CSS classes for split container
   */
  public getSplitContainerClasses(
    isOpen: boolean,
    disabled: boolean = false,
    className: string = ""
  ): string {
    return [
      "navbar-button",
      "build-modal-btn",
      "navbar-build-btn",
      "navbar-build-split-container",
      "base-combobox-split-container",
      isOpen ? "active" : "",
      disabled ? "disabled opacity-50 pointer-events-none" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");
  }

  /**
   * Compute CSS classes for action/run button
   */
  public getActionButtonClasses(
    disabled: boolean = false,
    isBuilding: boolean = false,
    className: string = ""
  ): string {
    return [
      "navbar-build-run-btn",
      "base-combobox-action-btn",
      isBuilding ? "is-building is-loading" : "",
      disabled ? "disabled cursor-not-allowed" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");
  }

  /**
   * Compute CSS classes for options toggle button
   */
  public getOptionsButtonClasses(isOpen: boolean, disabled: boolean = false, className: string = ""): string {
    return [
      "navbar-build-options-btn",
      "base-combobox-options-btn",
      isOpen ? "active" : "",
      disabled ? "disabled cursor-not-allowed" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");
  }

  /**
   * Compute styles for Split Trigger Button (Action + Separator + Options Toggle)
   * Adheres to Rule 18 and matches IDE navbar standards
   */
  public getSplitTriggerButtonStyles(isOpen: boolean, isDark: boolean = false): ComboboxTriggerStyles {
    const activeBg = isDark ? "rgba(255, 255, 255, 0.08)" : "var(--surface-muted, #f1f5f9)";
    const restingBg = "transparent";
    const textColor = isOpen ? (isDark ? "#f8fafc" : "#0f172a") : "inherit";

    return {
      container: {
        display: "inline-flex",
        alignItems: "center",
        borderRadius: "5px",
        border: isOpen ? "1px solid var(--border, #cbd5e1)" : "1px solid transparent",
        backgroundColor: isOpen ? activeBg : restingBg,
        color: textColor,
        transition: "all 0.15s ease",
      },
      runButton: {
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        padding: "4px 8px",
        border: "none",
        backgroundColor: "transparent",
        color: "inherit",
        fontSize: "12px",
        fontWeight: 500,
        cursor: "pointer",
        borderRadius: "4px 0 0 4px",
        transition: "background-color 0.15s ease",
      },
      separator: {
        width: "1px",
        height: "14px",
        backgroundColor: isDark ? "rgba(255, 255, 255, 0.15)" : "var(--border, #cbd5e1)",
        alignSelf: "center",
        flexShrink: 0,
        opacity: isOpen ? 0.8 : 0.4,
      },
      optionsButton: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "4px 6px",
        border: "none",
        backgroundColor: "transparent",
        color: "inherit",
        cursor: "pointer",
        borderRadius: "0 4px 4px 0",
        transition: "background-color 0.15s ease",
      },
    };
  }

  /**
   * Generate default semantic ID for combobox element according to Rule 13
   */
  public generateSemanticId(customId?: string, suffix: string = "root"): string {
    if (customId && customId.trim()) return customId.trim();
    return `base-combobox-${suffix}`;
  }

  /**
   * Check if breaking switch to header buttons mode is enabled
   */
  public isBreakSwitchToHeaderButtonsEnabled(): boolean {
    return true;
  }

  /**
   * Compute CSS classes for workspace mode button (Header button mode)
   */
  public getHeaderModeButtonClasses(
    mode: "ui" | "services" | "documents",
    isActive: boolean,
    isOpen: boolean
  ): string {
    return [
      "navbar-button",
      "navbar-action-btn",
      "mode-btn",
      "workspace-combobox-btn",
      "header-mode-button",
      `workspace-mode-${mode}`,
      `navbar-mode-btn-${mode}`,
      isActive ? "active selected is-active theme-active btn-highlight" : "",
      isOpen ? "is-open" : "",
    ]
      .filter(Boolean)
      .join(" ");
  }

  /**
   * Compute CSS classes for workspace mode button
   */
  public getWorkspaceModeTriggerClasses(
    mode: "ui" | "services" | "documents",
    isActive: boolean,
    isOpen: boolean
  ): string {
    return [
      "navbar-button",
      "mode-btn",
      "workspace-combobox-btn",
      "header-mode-button",
      `workspace-mode-${mode}`,
      isActive ? "active selected is-active theme-active btn-highlight" : "",
      isOpen ? "is-open" : "",
    ]
      .filter(Boolean)
      .join(" ");
  }

  /**
   * Return canonical button ID for querying in the DOM
   */
  public getWorkspaceModeButtonId(mode: WorkspaceEditorMode): string {
    return `navbar-mode-${mode}`;
  }

  /**
   * Return selection attributes for workspace mode button (ARIA and data attributes)
   */
  public getWorkspaceModeButtonSelectionAttrs(isActive: boolean): {
    "data-active": string;
    "data-selected": string;
    "aria-selected": boolean;
  } {
    return {
      "data-active": isActive ? "true" : "false",
      "data-selected": isActive ? "true" : "false",
      "aria-selected": isActive,
    };
  }

  /**
   * Compute CSS classes for workspace mode badge
   */
  public getWorkspaceModeBadgeClasses(isActive: boolean): string {
    return [
      "workspace-combobox-badge",
      isActive ? "theme-badge-active" : "theme-badge-inactive",
    ]
      .filter(Boolean)
      .join(" ");
  }

  /**
   * Resolve UI version items to standardized ComboboxItem list
   */
  public resolveUiComboboxItems(
    uis: Array<{ id?: string; name?: string; path?: string }> = []
  ): ComboboxItem[] {
    const list = uis.length > 0 ? uis : [{ id: "main-ui", name: "Main UI (Default)" }];
    return list.map((ui) => ({
      id: ui.id || "main-ui",
      label: ui.name || ui.id || "Main UI",
      icon: "Layers",
      description: ui.path ? `Path: ${ui.path}` : undefined,
    }));
  }

  /**
   * Resolve microservice items to standardized ComboboxItem list
   */
  public resolveServiceComboboxItems(
    services: Array<{ id?: string; name?: string; domain?: string }> = []
  ): ComboboxItem[] {
    const list = services.length > 0 ? services : [{ id: "order-engine", name: "OrderEngine" }];
    return list.map((svc) => ({
      id: svc.id || "service",
      label: svc.name || svc.id || "Service",
      icon: "Server",
      description: svc.domain ? `Domain: ${svc.domain}` : undefined,
    }));
  }

  /**
   * Resolve document snapshot items to standardized ComboboxItem list
   */
  public resolveDocumentComboboxItems(
    docs: Array<{ id?: string; label?: string; version?: string }> = []
  ): ComboboxItem[] {
    const list = docs.length > 0 ? docs : [{ id: "doc-v1.0.0", label: "Initial Snapshot", version: "v1.0.0" }];
    return list.map((doc) => ({
      id: doc.id || doc.version || "doc",
      label: doc.label || doc.version || "Document Snapshot",
      icon: "FileText",
      badge: doc.version,
    }));
  }

  /**
   * Compute CSS classes for workspace mode switcher container (#navbar-editor-mode-switch)
   * Supporting light-theme combobox list standards, breaking switch to buttons in header, and Rule 12 & Rule 18
   */
  public getWorkspaceModeSwitcherContainerClasses(
    theme: string = "light",
    isOpen: boolean = false,
    additionalClasses: string = ""
  ): string {
    const normalizedTheme = theme ? `${theme}-theme` : "light-theme";
    return [
      "navbar-editor-mode-switch",
      "workspace-mode-switcher-group",
      "workspace-mode-combobox-list",
      "combobox-list-group",
      "header-buttons-mode",
      "break-switch-to-buttons",
      "navbar-buttons-group",
      normalizedTheme,
      isOpen ? "z-dropdown-open" : "z-dropdown-closed",
      additionalClasses,
    ]
      .filter(Boolean)
      .join(" ");
  }

  /**
   * Compute CSS classes for workspace combobox wrapper
   */
  public getWorkspaceComboboxWrapperClasses(
    isOpen: boolean = false,
    additionalClasses: string = ""
  ): string {
    return [
      "workspace-combobox-wrapper",
      isOpen ? "workspace-combobox-open" : "workspace-combobox-closed",
      additionalClasses,
    ]
      .filter(Boolean)
      .join(" ");
  }

  /**
   * Compute CSS classes for workspace combobox list
   */
  public getWorkspaceComboboxListThemeClasses(
    theme: string = "light",
    additionalClasses: string = ""
  ): string {
    return [
      "workspace-combobox-list",
      theme ? `${theme}-theme-combobox-list` : "light-theme-combobox-list",
      additionalClasses,
    ]
      .filter(Boolean)
      .join(" ");
  }

  /**
   * Compute CSS classes for workspace combobox item
   */
  public getWorkspaceComboboxItemThemeClasses(
    isActive: boolean = false,
    theme: string = "light",
    additionalClasses: string = ""
  ): string {
    return [
      "dropdown-item",
      "workspace-combobox-item",
      theme ? `${theme}-combobox-item` : "light-combobox-item",
      isActive ? "active selected theme-active" : "",
      additionalClasses,
    ]
      .filter(Boolean)
      .join(" ");
  }

  /**
   * Return predefined workspace mode combobox configurations for the list
   */
  public getWorkspaceModeComboboxConfigs(): WorkspaceModeComboboxConfig[] {
    return [
      {
        id: "ui",
        label: "UI",
        icon: "Layers",
        testId: "navbar-mode-ui",
        actionId: "navbar-mode-ui",
        legacyActionId: "ws-mode-ui-btn",
        wrapperId: "ws-mode-ui-combobox-wrapper",
        itemContainerId: "navbar-mode-item-ui",
        badgeTestId: "navbar-active-ui-version-badge",
      },
      {
        id: "services",
        label: "Services",
        icon: "Server",
        testId: "navbar-mode-services",
        actionId: "navbar-mode-services",
        legacyActionId: "ws-mode-services-btn",
        wrapperId: "ws-mode-services-combobox-wrapper",
        itemContainerId: "navbar-mode-item-services",
        badgeTestId: "navbar-active-services-version-badge",
      },
      {
        id: "documents",
        label: "Documents",
        icon: "FileText",
        testId: "navbar-mode-documents",
        actionId: "navbar-mode-documents",
        legacyActionId: "ws-mode-documents-btn",
        wrapperId: "ws-mode-documents-combobox-wrapper",
        itemContainerId: "navbar-mode-item-documents",
        badgeTestId: "navbar-active-documents-version-badge",
      },
    ];
  }

  /**
   * Compute CSS classes for each item in the workspace mode combobox list
   */
  public getComboboxListItemClasses(
    mode: WorkspaceEditorMode,
    isActive: boolean = false,
    additionalClasses: string = ""
  ): string {
    return [
      "combobox-list-item",
      `combobox-list-item-${mode}`,
      isActive ? "is-active active" : "",
      additionalClasses,
    ]
      .filter(Boolean)
      .join(" ");
  }

  /**
   * Return ARIA accessibility attributes for navbar-editor-mode-switch as a list of Combobox
   */
  public getWorkspaceModeListA11yProps(): {
    role: "list";
    "aria-label": string;
  } {
    return {
      role: "list",
      "aria-label": "Workspace Modes Combobox List",
    };
  }

  /**
   * Return ARIA accessibility attributes for individual item in the combobox list
   */
  public getWorkspaceModeListItemA11yProps(mode: WorkspaceEditorMode): {
    role: "listitem";
    "aria-label": string;
  } {
    return {
      role: "listitem",
      "aria-label": `${mode.toUpperCase()} Mode Combobox Item`,
    };
  }

  /**
   * Return whether opening dropdown on header mode button click is disabled
   * Standards: Section 263 (navbar_remove_dropdown_on_header_mode_click)
   */
  public isHeaderModeDropdownDisabled(enableDropdown: boolean = false): boolean {
    return !enableDropdown;
  }

  /**
   * Resolve action execution when clicking a header mode button
   * Standards: Section 263
   */
  public resolveHeaderModeClickAction(
    mode: WorkspaceEditorMode,
    enableDropdown: boolean = false
  ): {
    mode: WorkspaceEditorMode;
    shouldOpenDropdown: boolean;
  } {
    return {
      mode,
      shouldOpenDropdown: enableDropdown,
    };
  }

  /**
   * Determine whether to render ChevronDown icon on header mode buttons
   * Standards: Section 263
   */
  public getHeaderModeComboboxShowChevron(enableDropdown: boolean = false): boolean {
    return enableDropdown;
  }
}

export type WorkspaceEditorMode = "ui" | "services" | "documents";

export interface WorkspaceModeComboboxConfig {
  id: WorkspaceEditorMode;
  label: string;
  icon: string;
  testId: string;
  actionId: string;
  legacyActionId?: string;
  wrapperId: string;
  itemContainerId: string;
  badgeTestId?: string;
}

export const lc_combobox_engine = LcComboboxEngine.getInstance();
