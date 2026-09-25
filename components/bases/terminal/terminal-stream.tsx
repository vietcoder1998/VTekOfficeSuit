"use client";
/**
 * components/bases/terminal/terminal-stream.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Read-only Stream Log Output Mode for Single Canonical Base Terminal
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

export function TerminalStream({
  terminalId,
  props,
  theme,
  activePadding,
  activeHeaderPadding,
  isCopied,
  handleCopyLogs,
  getLineColor,
  normalizedLogs,
  primaryBottomRef,
}: TerminalSubComponentProps) {
  const t = useSafeTranslations("components.bases.terminal", {
    emptyLogs: "# Chưa có dữ liệu terminal log",
    lineCount: "dòng",
    clearLogs: "Xóa logs",
    clearShort: "Xóa",
    copyLogs: "Sao chép toàn bộ logs",
    copied: "Đã chép",
    copy: "Sao chép",
  });
  const {
    className = "",
    style = {},
    containerTestId = "ide-terminal-container",
    title = "Terminal Console",
    showClear = true,
    showCopy = true,
    onClear,
    maxHeight,
    height,
    emptyMessage = t("emptyLogs", "# Chưa có dữ liệu terminal log"),
    bufferTestId = "terminal-output-buffer",
  } = props;

  return (
    <div
      id={`${terminalId}-stream-container`}
      data-testid={containerTestId}
      className={`terminal-stream-mode theme-surface theme-border flex flex-col rounded-md overflow-hidden ${className}`}
      style={{
        height: height || "auto",
        ...style,
      }}
    >
      {/* Title & Action Bar */}
      <div
        id={`${terminalId}-stream-header`}
        className="terminal-window-titlebar theme-surface-muted theme-border px-2 flex items-center justify-between text-xs text-muted"
      >
        <div id={`${terminalId}-stream-title`} className="flex items-center gap-1.5">
          <IdeIcon name="Terminal" size={12} color="var(--primary, #6938ef)" />
          <span className="font-semibold theme-text">{title}</span>
          <span className="text-muted">({normalizedLogs.length} {t("lineCount", "dòng")})</span>
        </div>

        <div id={`${terminalId}-stream-actions`} className="flex items-center gap-1.5">
          {showClear && onClear && (
            <Button
              id={`${terminalId}-stream-clear-btn`}
              variant="unstyled"
              type="button"
              onClick={onClear}
              data-testid={props.clearButtonTestId || `${containerTestId}-clear-btn`}
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs text-muted cursor-pointer bg-transparent border-none"
              title={t("clearLogs", "Xóa logs")}
            >
              <IdeIcon name="Trash2" size={11} />
              <span>{t("clearShort", "Xóa")}</span>
            </Button>
          )}

          {showCopy && (
            <Button
              id={`${terminalId}-stream-copy-btn`}
              variant="unstyled"
              type="button"
              onClick={handleCopyLogs}
              data-testid={props.copyButtonTestId || `${containerTestId}-copy-btn`}
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

      {/* Stream Buffer */}
      <div
        id={`${terminalId}-stream-buffer`}
        className="vscode-terminal-buffer overflow-y-auto p-2"
        data-testid={bufferTestId}
        style={{
          maxHeight: maxHeight || "260px",
        }}
      >
        {normalizedLogs.length === 0 ? (
          <div id={`${terminalId}-stream-empty`} className="text-muted italic text-xs">
            {emptyMessage}
          </div>
        ) : (
          normalizedLogs.map((l) => (
            <div key={l.id} id={`${terminalId}-stream-log-${l.id}`} style={{ color: getLineColor(l.type) }} className="mb-0-5 text-xs">
              {l.text}
            </div>
          ))
        )}
        <div ref={primaryBottomRef} />
      </div>
    </div>
  );
}
