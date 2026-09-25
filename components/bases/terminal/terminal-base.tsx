"use client";
/**
 * components/bases/terminal/terminal-base.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Canonical Single Terminal Base Component (`<IdeTerminal>`)
 *
 * Conforms to:
 * - RULE[always-use-ide-icon.md]: Uses <IdeIcon> from @/components/bases (no raw emoji).
 * - RULE[default-id-for-div-container.md]: Descriptive semantic kebab-case ID on all containers/divs.
 * - RULE[standard-for-project.md]: Theme variables, #6938ef, font JetBrains Mono / Inter, 8-pt grid.
 * - Section 178 in .lowcode/.standards/MCP/standard-specification.md
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { TerminalInteractive } from "./terminal-interactive";
import { TerminalStream } from "./terminal-stream";
import { TerminalVscode } from "./terminal-vscode";
import { TerminalWindow } from "./terminal-window";
import { type IdeTerminalProps, type TerminalSubComponentProps, type TerminalLogType, type IdeTerminalThemeTokens } from "./types";

export function IdeTerminal(props: IdeTerminalProps) {
  const {
    id: propId,
    mode = "interactive",
    logs = [],
    isLight = false,
    autoScroll = true,
    compactPadding = true,
    contentPadding,
    onCommand,
    onExecuteCommand,
    onCopy,
    themeTokens: customThemeTokens,
    secondaryLogs = [],
  } = props;

  const reactGeneratedId = useId().replace(/:/g, "_");
  const terminalId = propId || `terminal-${reactGeneratedId}`;

  // Resolve IDE theme tokens
  const theme: IdeTerminalThemeTokens = useMemo(() => {
    if (customThemeTokens) return customThemeTokens;
    return isLight
      ? {
          background: "var(--terminal-bg, #f6f8fa)",
          foreground: "var(--terminal-fg, #24292f)",
          cursor: "var(--terminal-cursor, #0969da)",
          selection: "var(--terminal-selection, rgba(9, 105, 218, 0.2))",
          border: "var(--border, #d0d7de)",
        }
      : {
          background: "var(--terminal-bg, #0d1117)",
          foreground: "var(--terminal-fg, #c9d1d9)",
          cursor: "var(--terminal-cursor, #58a6ff)",
          selection: "var(--terminal-selection, rgba(56, 139, 253, 0.4))",
          border: "var(--border, #30363d)",
        };
  }, [isLight, customThemeTokens]);

  // Resolved downsized container padding
  const activePadding = contentPadding !== undefined
    ? String(contentPadding)
    : (compactPadding ? "4px 8px" : "8px 12px");
  const activePromptPadding = compactPadding ? "4px 8px 6px 8px" : "6px 12px 10px 12px";
  const activeHeaderPadding = compactPadding ? "0 8px" : "0 10px";

  // Local command input state
  const [cmdInput, setCmdInput] = useState("");
  const [secondaryCmdInput, setSecondaryCmdInput] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  // Command history for ArrowUp / ArrowDown
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [tempInput, setTempInput] = useState("");
  const [localHistory, setLocalHistory] = useState<string[]>([]);

  // Refs for auto-scroll and input focus
  const primaryBottomRef = useRef<HTMLDivElement | null>(null);
  const secondaryBottomRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Normalized logs using engine
  const normalizedLogs = useMemo(() => {
    return lc_terminal_standard_engine.normalizeLogs(logs as unknown[]);
  }, [logs]);

  const normalizedSecondaryLogs = useMemo(() => {
    return lc_terminal_standard_engine.normalizeLogs(secondaryLogs as unknown[]);
  }, [secondaryLogs]);

  // Auto-scroll when logs change
  useEffect(() => {
    if (autoScroll && primaryBottomRef.current) {
      primaryBottomRef.current.scrollIntoView?.({ behavior: "smooth" });
    }
  }, [normalizedLogs, autoScroll]);

  useEffect(() => {
    if (autoScroll && secondaryBottomRef.current) {
      secondaryBottomRef.current.scrollIntoView?.({ behavior: "smooth" });
    }
  }, [normalizedSecondaryLogs, autoScroll]);

  // Copy handler
  const handleCopyLogs = () => {
    const text = lc_terminal_standard_engine.exportPlainText(normalizedLogs);
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
    }
    setIsCopied(true);
    onCopy?.();
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Submit command
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cmd = cmdInput.trim();
    if (!cmd) return;

    setLocalHistory((prev) => [...prev, cmd]);
    setHistoryIndex(-1);
    setTempInput("");

    const cmdHandler = onCommand || onExecuteCommand;
    if (cmdHandler) {
      cmdHandler(cmd);
    } else {
      lc_terminal_standard_engine.executeCommand(terminalId, cmd);
    }
    setCmdInput("");
  };

  // Submit secondary command
  const handleSecondarySubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cmd = secondaryCmdInput.trim();
    if (!cmd) return;

    if (props.onSecondaryCommand) {
      props.onSecondaryCommand(cmd);
    }
    setSecondaryCmdInput("");
  };

  // Handle keyboard navigation (ArrowUp, ArrowDown, Tab, Enter)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit(e);
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (localHistory.length === 0) return;
      if (historyIndex === -1) {
        setTempInput(cmdInput);
        setHistoryIndex(localHistory.length - 1);
        setCmdInput(localHistory[localHistory.length - 1] ?? "");
      } else if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setCmdInput(localHistory[nextIdx] ?? "");
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex === -1) return;
      if (historyIndex < localHistory.length - 1) {
        const nextIdx = historyIndex + 1;
        setHistoryIndex(nextIdx);
        setCmdInput(localHistory[nextIdx] ?? "");
      } else {
        setHistoryIndex(-1);
        setCmdInput(tempInput);
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const completions = lc_terminal_standard_engine.getCompletions(cmdInput);
      if (completions.length > 0) {
        setCmdInput(completions[0]);
      }
    }
  };

  // Color mapper for terminal line types
  const getLineColor = (type: TerminalLogType | string): string => {
    switch (type) {
      case "system":
        return theme.primary;
      case "success":
        return "#10b981";
      case "info":
        return isLight ? "#6b21a8" : "#a78bfa";
      case "warning":
        return "#f59e0b";
      case "error":
      case "stderr":
        return "#ef4444";
      case "input":
        return isLight ? "#0284c7" : "#38bdf8";
      default:
        return isLight ? "#24292f" : "#cccccc";
    }
  };

  const subProps: TerminalSubComponentProps = {
    terminalId,
    props,
    theme,
    activePadding,
    activePromptPadding,
    activeHeaderPadding,
    cmdInput,
    setCmdInput,
    secondaryCmdInput,
    setSecondaryCmdInput,
    isCopied,
    handleCopyLogs,
    handleSubmit,
    handleSecondarySubmit,
    handleKeyDown,
    getLineColor,
    normalizedLogs,
    normalizedSecondaryLogs,
    primaryBottomRef,
    secondaryBottomRef,
    inputRef,
  };

  if (mode === "vscode") {
    return <TerminalVscode {...subProps} />;
  }

  if (mode === "stream") {
    return <TerminalStream {...subProps} />;
  }

  if (mode === "window") {
    return <TerminalWindow {...subProps} />;
  }

  return <TerminalInteractive {...subProps} />;
}

export const Terminal = IdeTerminal;
export const TerminalView = IdeTerminal;
export const UnifiedTerminal = IdeTerminal;
export default IdeTerminal;
