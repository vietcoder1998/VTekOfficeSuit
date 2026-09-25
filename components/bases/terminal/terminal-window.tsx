"use client";
/**
 * components/bases/terminal/terminal-window.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Window / Floating Console Mode for Single Canonical Base Terminal
 * Conforms to:
 * - RULE[always-use-ide-icon.md]: Uses <IdeIcon> (no raw emoji).
 * - RULE[default-id-for-div-container.md]: Default semantic ID on all divs.
 * - RULE[standard-for-project.md]: IDE Theme tokens (#6938ef, 8-pt grid).
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React from "react";
import { IdeIcon } from "../ide-icon";
import { Button } from "../button";
import { useSafeTranslations } from "../use-safe-translations";
import { type TerminalSubComponentProps } from "./types";

export function TerminalWindow({
  terminalId,
  props,
  theme,
  activePadding,
  activeHeaderPadding,
  cmdInput,
  setCmdInput,
  handleSubmit,
  handleKeyDown,
  getLineColor,
  normalizedLogs,
  primaryBottomRef,
  inputRef,
}: TerminalSubComponentProps) {
  const t = useSafeTranslations("components.bases.terminal", {
    minimize: "Thu nhỏ",
    maximize: "Phóng to",
    closeWindow: "Đóng cửa sổ",
  });
  const {
    className = "",
    style = {},
    containerTestId = "ide-terminal-container",
    title = "Terminal Window",
    onMinimize,
    onToggleMaximize,
    onClose,
    compactPadding = true,
    bufferTestId = "terminal-output-buffer",
    prompt = "$ ",
    inputPlaceholder = "Type command...",
    inputTestId = "terminal-command-input",
  } = props;

  return (
    <div
      id={`${terminalId}-window-container`}
      data-testid={containerTestId}
      className={`terminal-window-mode theme-surface theme-border flex flex-col flex-1 h-full rounded-md overflow-hidden ${className}`}
      style={style}
    >
      {/* Window Title Bar */}
      <div
        id={`${terminalId}-window-titlebar`}
        className="terminal-window-titlebar theme-surface-muted theme-border px-2"
      >
        <div
          id={`${terminalId}-window-title`}
          className="terminal-window-title theme-text"
        >
          <IdeIcon name="Terminal" size={12} color="var(--primary, #6938ef)" />
          <span>{title}</span>
        </div>

        <div id={`${terminalId}-window-controls`} className="terminal-window-controls">
          {onMinimize && (
            <Button
              id={`${terminalId}-window-min-btn`}
              variant="unstyled"
              onClick={onMinimize}
              className="terminal-window-control-btn text-muted"
              title={t("minimize", "Thu nhỏ")}
            >
              <IdeIcon name="Minus" size={11} />
            </Button>
          )}
          {onToggleMaximize && (
            <Button
              id={`${terminalId}-window-max-btn`}
              variant="unstyled"
              onClick={onToggleMaximize}
              className="terminal-window-control-btn text-muted"
              title={t("maximize", "Phóng to")}
            >
              <IdeIcon name="Square" size={10} />
            </Button>
          )}
          {onClose && (
            <Button
              id={`${terminalId}-window-close-btn`}
              variant="unstyled"
              onClick={onClose}
              className="terminal-window-control-btn text-danger"
              title={t("closeWindow", "Đóng cửa sổ")}
            >
              <IdeIcon name="X" size={12} />
            </Button>
          )}
        </div>
      </div>

      {/* Window Monospace Buffer */}
      <div
        id={`${terminalId}-window-body`}
        className="vscode-terminal-buffer flex-1 overflow-y-auto p-2"
        data-testid={bufferTestId}
      >
        {normalizedLogs.map((l) => (
          <div key={l.id} id={`${terminalId}-log-line-${l.id}`} style={{ color: getLineColor(l.type) }} className="mb-0-5">
            {l.text}
          </div>
        ))}
        <div ref={primaryBottomRef} />
      </div>

      {/* Window Prompt Form */}
      <form
        onSubmit={handleSubmit}
        id={`${terminalId}-window-prompt-form`}
        className="vscode-terminal-prompt-line flex items-center theme-border px-2 py-1"
      >
        <span id={`${terminalId}-prompt-symbol`} className="text-xs font-bold mr-1.5 whitespace-nowrap text-primary">
          {prompt}
        </span>
        <input
          ref={inputRef}
          id={`${terminalId}-window-command-input`}
          type="text"
          value={cmdInput}
          onChange={(e) => setCmdInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={inputPlaceholder}
          data-testid={inputTestId}
          className="vscode-terminal-input flex-1 bg-transparent border-none outline-none text-xs theme-text"
        />
      </form>
    </div>
  );
}
