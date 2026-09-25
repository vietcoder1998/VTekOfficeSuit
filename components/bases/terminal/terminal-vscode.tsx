"use client";
/**
 * components/bases/terminal/terminal-vscode.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * VSCode Full Panel Mode for Single Canonical Base Terminal
 * Conforms to:
 * - RULE[always-use-ide-icon.md]: Uses <IdeIcon> (no raw emoji).
 * - RULE[default-id-for-div-container.md]: Default semantic ID on all divs.
 * - RULE[standard-for-project.md]: IDE Theme tokens (#6938ef, 8-pt grid).
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React from "react";
import { IdeIcon } from "../ide-icon";
import { Button } from "../button";
import { Select } from "../select";
import { useSafeTranslations } from "../use-safe-translations";
import { type TerminalSubComponentProps } from "./types";

export function TerminalVscode({
  terminalId,
  props,
  theme,
  activePadding,
  activePromptPadding,
  cmdInput,
  setCmdInput,
  secondaryCmdInput,
  setSecondaryCmdInput,
  handleSubmit,
  handleSecondarySubmit,
  handleKeyDown,
  getLineColor,
  normalizedLogs,
  normalizedSecondaryLogs,
  primaryBottomRef,
  secondaryBottomRef,
  inputRef,
}: TerminalSubComponentProps) {
  const t = useSafeTranslations("components.bases.terminal", {
    closeSplit: "Đóng cửa sổ chia đôi",
  });
  const {
    isLight = false,
    className = "",
    style = {},
    containerTestId = "ide-terminal-container",
    tabs,
    activeTab,
    onTabChange,
    sessionOptions = [],
    activeSessionId,
    onSelectSession,
    onNewSession,
    onSplitTerminal,
    onClear,
    onKillTerminal,
    onToggleMaximize,
    isMaximized = false,
    isSplit = false,
    secondaryTitle = "Split Terminal",
    secondaryPrompt = "$ ",
    secondaryInputPlaceholder = "Type command in split pane...",
    onCloseSplit,
    sidebar,
    rightSidebar,
    children,
    compactPadding = true,
    bufferTestId = "terminal-output-buffer",
    status = "connected",
    prompt = "$ ",
    inputPlaceholder = "Type command...",
    inputTestId = "terminal-command-input",
  } = props;

  return (
    <div
      id={`${terminalId}-vscode-root`}
      data-testid={containerTestId}
      className={`vscode-terminal-container theme-surface theme-border flex flex-col flex-1 h-full overflow-hidden rounded-md ${className}`}
      style={style}
    >
      {/* Top Panel Tabs Header */}
      {tabs && tabs.length > 0 && (
        <div
          id={`${terminalId}-vscode-tabs-header`}
          className="terminal-window-titlebar theme-surface-muted theme-border px-2 flex items-center justify-between h-8 select-none"
        >
          <div
            id={`${terminalId}-vscode-tabs-list`}
            className="flex items-center gap-0-5 overflow-x-auto"
          >
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <Button
                  key={tab.id}
                  id={`${terminalId}-tab-${tab.id}`}
                  variant="unstyled"
                  type="button"
                  onClick={() => onTabChange?.(tab.id)}
                  data-testid={tab.testId || `tab-btn-${tab.id.toLowerCase()}`}
                  className={`h-8 px-2.5 text-xs inline-flex items-center gap-1-5 uppercase cursor-pointer border-none bg-transparent ${
                    isActive ? "font-semibold theme-text border-b-2 border-primary" : "font-normal text-muted"
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && (
                    <span
                      id={`${terminalId}-tab-badge-${tab.id}`}
                      className="bg-surface-muted text-muted text-xs rounded-full px-1.5 py-0.5"
                    >
                      {tab.badge}
                    </span>
                  )}
                </Button>
              );
            })}
          </div>

          {/* Action Toolbar */}
          <div
            id={`${terminalId}-vscode-actions-toolbar`}
            className="vscode-terminal-actions flex items-center gap-1"
          >
            {sessionOptions.length > 0 && (
              <Select
                id={`${terminalId}-session-select`}
                data-testid="vscode-terminal-select"
                value={activeSessionId || sessionOptions[0]?.id}
                onChange={(e) => onSelectSession?.(e.target.value)}
                className="theme-surface theme-text theme-border rounded text-xs px-1.5 h-6 cursor-pointer outline-none"
              >
                {sessionOptions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </Select>
            )}

            {onNewSession && (
              <Button
                id={`${terminalId}-new-terminal-btn`}
                variant="unstyled"
                type="button"
                onClick={onNewSession}
                data-testid="vscode-new-terminal-btn"
                className="terminal-window-control-btn text-muted"
                title="New Terminal"
              >
                <IdeIcon name="Plus" size={13} />
              </Button>
            )}

            {onSplitTerminal && (
              <Button
                id={`${terminalId}-split-terminal-btn`}
                variant="unstyled"
                type="button"
                onClick={onSplitTerminal}
                data-testid="vscode-split-terminal-btn"
                className={`terminal-window-control-btn ${isSplit ? "text-primary" : "text-muted"}`}
                title="Split Terminal"
              >
                <IdeIcon name="Columns" size={13} color={isSplit ? "var(--primary, #6938ef)" : undefined} />
              </Button>
            )}

            {onClear && (
              <Button
                id={`${terminalId}-clear-terminal-btn`}
                variant="unstyled"
                type="button"
                onClick={onClear}
                data-testid="vscode-clear-terminal-btn"
                className="terminal-window-control-btn text-muted"
                title="Clear Terminal"
              >
                <IdeIcon name="Trash2" size={13} />
              </Button>
            )}

            {onKillTerminal && (
              <Button
                id={`${terminalId}-kill-terminal-btn`}
                variant="unstyled"
                type="button"
                onClick={onKillTerminal}
                data-testid="vscode-kill-terminal-btn"
                className="terminal-window-control-btn text-muted"
                title="Kill Terminal"
              >
                <IdeIcon name="X" size={13} />
              </Button>
            )}

            {onToggleMaximize && (
              <Button
                id={`${terminalId}-maximize-terminal-btn`}
                variant="unstyled"
                type="button"
                onClick={onToggleMaximize}
                data-testid="vscode-maximize-terminal-btn"
                className="terminal-window-control-btn text-muted"
                title={isMaximized ? "Restore Size" : "Maximize Panel Size"}
              >
                <IdeIcon name={isMaximized ? "Minimize2" : "Maximize2"} size={13} />
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Content Body (Optional Sidebar + Terminal Panes) */}
      <div id={`${terminalId}-vscode-body`} className="flex flex-1 min-h-0 overflow-hidden">
        {sidebar}

        {/* Primary Terminal Pane */}
        <div
          id={`${terminalId}-vscode-primary-pane`}
          className={`vscode-terminal-screen flex-1 flex flex-col min-w-0 ${isSplit ? "border-r theme-border" : ""}`}
        >
          {/* Primary Buffer */}
          <div
            id={`${terminalId}-primary-buffer`}
            className="vscode-terminal-buffer flex-1 overflow-y-auto p-2"
            data-testid={bufferTestId}
          >
            {normalizedLogs.map((log) => (
              <div key={log.id} id={`${terminalId}-vscode-log-${log.id}`} style={{ color: getLineColor(log.type) }} className="mb-0-5">
                {log.text}
              </div>
            ))}
            <div ref={primaryBottomRef} />
          </div>

          {/* Primary Command Prompt Line */}
          {status === "connected" && (
            <form
              onSubmit={handleSubmit}
              id={`${terminalId}-primary-prompt-form`}
              className="vscode-terminal-prompt-line flex items-center theme-border px-2 py-1 gap-1.5"
            >
              <span
                id={`${terminalId}-primary-prompt-label`}
                className="text-primary font-bold text-xs whitespace-nowrap"
              >
                {prompt}
              </span>
              <input
                ref={inputRef}
                id={`${terminalId}-primary-command-input`}
                type="text"
                value={cmdInput}
                onChange={(e) => setCmdInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={inputPlaceholder}
                data-testid={inputTestId}
                className="vscode-terminal-input flex-1 bg-transparent border-none outline-none text-xs theme-text p-0"
              />
            </form>
          )}
        </div>

        {/* Secondary Split Terminal Pane */}
        {isSplit && (
          <div
            id={`${terminalId}-vscode-secondary-pane`}
            className="vscode-terminal-screen flex-1 flex flex-col min-w-0"
          >
            {/* Secondary Header */}
            <div
              id={`${terminalId}-vscode-secondary-header`}
              className="terminal-window-titlebar theme-surface-muted theme-border px-2 flex items-center justify-between text-xs text-muted"
            >
              <div id={`${terminalId}-secondary-title-box`} className="flex items-center gap-1.5">
                <IdeIcon name="Terminal" size={11} color="var(--primary, #6938ef)" />
                <span className="font-semibold theme-text">
                  {secondaryTitle}
                </span>
              </div>
              {onCloseSplit && (
                <Button
                  id={`${terminalId}-close-split-btn`}
                  variant="unstyled"
                  type="button"
                  onClick={onCloseSplit}
                  className="terminal-window-control-btn text-muted"
                  title={t("closeSplit", "Đóng cửa sổ chia đôi")}
                >
                  <IdeIcon name="X" size={12} />
                </Button>
              )}
            </div>

            {/* Secondary Buffer */}
            <div
              id={`${terminalId}-secondary-buffer`}
              className="vscode-terminal-buffer flex-1 overflow-y-auto p-2"
              data-testid={props.secondaryBufferTestId || "secondary-terminal-output-buffer"}
            >
              {normalizedSecondaryLogs.map((log) => (
                <div key={log.id} id={`${terminalId}-secondary-log-${log.id}`} style={{ color: getLineColor(log.type) }} className="mb-0-5">
                  {log.text}
                </div>
              ))}
              <div ref={secondaryBottomRef} />
            </div>

            {/* Secondary Prompt Line */}
            <form
              onSubmit={handleSecondarySubmit}
              id={`${terminalId}-secondary-prompt-form`}
              className="vscode-terminal-prompt-line flex items-center theme-border px-2 py-1 gap-1.5"
            >
              <span id={`${terminalId}-secondary-prompt-label`} className="text-primary font-bold text-xs whitespace-nowrap">
                {secondaryPrompt}
              </span>
              <input
                id={`${terminalId}-secondary-command-input`}
                type="text"
                value={secondaryCmdInput}
                onChange={(e) => setSecondaryCmdInput(e.target.value)}
                placeholder={secondaryInputPlaceholder}
                data-testid={props.secondaryInputTestId || "secondary-terminal-command-input"}
                className="vscode-terminal-input flex-1 bg-transparent border-none outline-none text-xs theme-text p-0"
              />
            </form>
          </div>
        )}

        {rightSidebar}
      </div>

      {children}
    </div>
  );
}
