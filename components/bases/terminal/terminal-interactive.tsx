"use client";
/**
 * components/bases/terminal/terminal-interactive.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Interactive Shell Mode for Single Canonical Base Terminal
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

export function TerminalInteractive({
  terminalId,
  props,
  theme,
  activePadding,
  activeHeaderPadding,
  cmdInput,
  setCmdInput,
  isCopied,
  handleCopyLogs,
  handleSubmit,
  handleKeyDown,
  getLineColor,
  normalizedLogs,
  primaryBottomRef,
  inputRef,
}: TerminalSubComponentProps) {
  const t = useSafeTranslations("components.bases.terminal", {
    clearLogs: "Xóa logs",
    clearShort: "Xóa",
    copyLogs: "Sao chép toàn bộ logs",
    copied: "Đã chép",
    copy: "Sao chép",
  });
  const {
    isLight = false,
    className = "",
    style = {},
    containerTestId = "ide-terminal-container",
    title = "Terminal Console",
    status = "connected",
    showClear = true,
    showCopy = true,
    onClear,
    maxHeight,
    height,
    compactPadding = true,
    bufferTestId = "terminal-output-buffer",
    prompt = "$ ",
    inputPlaceholder = "Type command...",
    inputTestId = "terminal-command-input",
    sendButtonTestId = "ssh-cmd-send-btn",
  } = props;

  return (
    <div
      id={`${terminalId}-interactive-container`}
      data-testid={containerTestId}
      className={`terminal-interactive-mode theme-surface theme-border flex flex-col rounded-md overflow-hidden ${className}`}
      style={{
        height: height || "auto",
        ...style,
      }}
    >
      {/* Header Bar */}
      <div
        id={`${terminalId}-header-bar`}
        className="terminal-window-titlebar theme-surface-muted theme-border px-2 flex items-center justify-between text-xs text-muted"
      >
        <div id={`${terminalId}-header-left`} className="flex items-center gap-2">
          <IdeIcon name="Terminal" size={12} color="var(--primary, #6938ef)" />
          <span className="font-semibold theme-text">{title}</span>
          <span
            id={`${terminalId}-status-badge`}
            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-semibold ${
              status === "connected" || status === "online"
                ? "bg-emerald-500/15 text-emerald-600"
                : "bg-rose-500/15 text-rose-600"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full inline-block ${
                status === "connected" || status === "online" ? "bg-emerald-500" : "bg-rose-500"
              }`}
            />
            <span>{status.toUpperCase()}</span>
          </span>
        </div>

        <div id={`${terminalId}-header-right`} className="flex items-center gap-1.5">
          {showClear && onClear && (
            <Button
              id={`${terminalId}-interactive-clear-btn`}
              variant="unstyled"
              type="button"
              onClick={onClear}
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs text-muted cursor-pointer bg-transparent border-none"
              title={t("clearLogs", "Xóa logs")}
            >
              <IdeIcon name="Trash2" size={11} />
              <span>{t("clearShort", "Xóa")}</span>
            </Button>
          )}

          {showCopy && (
            <Button
              id={`${terminalId}-interactive-copy-btn`}
              variant="unstyled"
              type="button"
              onClick={handleCopyLogs}
              className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs cursor-pointer border-none ${
                isCopied ? "bg-emerald-500/15 text-emerald-600" : "bg-transparent text-muted"
              }`}
              title={t("copyLogs", "Sao chép toàn bộ logs")}
            >
              <IdeIcon name={isCopied ? "Check" : "Copy"} size={11} />
              <span>{isCopied ? t("copied", "Đã chép") : t("copy", "Sao chép")}</span>
            </Button>
          )}
        </div>
      </div>

      {/* Output Buffer */}
      <div
        id={`${terminalId}-interactive-buffer`}
        className="vscode-terminal-buffer flex-1 overflow-y-auto p-2"
        data-testid={bufferTestId}
        style={{
          maxHeight: maxHeight || "360px",
        }}
      >
        {normalizedLogs.map((l) => (
          <div key={l.id} id={`${terminalId}-interactive-log-${l.id}`} style={{ color: getLineColor(l.type) }} className="mb-0-5">
            {l.text}
          </div>
        ))}
        <div ref={primaryBottomRef} />
      </div>

      {/* Command prompt line */}
      <form
        onSubmit={handleSubmit}
        id={`${terminalId}-interactive-prompt-form`}
        className="vscode-terminal-prompt-line flex items-center theme-border px-2 py-1 gap-1.5"
      >
        <span
          id={`${terminalId}-interactive-prompt-label`}
          className="text-primary font-bold text-xs whitespace-nowrap"
        >
          {prompt}
        </span>
        <input
          ref={inputRef}
          id={`${terminalId}-interactive-input`}
          type="text"
          value={cmdInput}
          onChange={(e) => setCmdInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={inputPlaceholder}
          data-testid={inputTestId}
          className="vscode-terminal-input flex-1 bg-transparent border-none outline-none text-xs theme-text p-0"
        />
        <button type="submit" data-testid={sendButtonTestId} className="hidden" aria-hidden="true" />
      </form>
    </div>
  );
}
