"use client";
/**
 * components/bases/terminal/types.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Data contracts and prop definitions for Single Canonical Base Terminal
 * Conforms to:
 * - RULE[always-use-ide-icon.md]
 * - RULE[default-id-for-div-container.md]
 * - RULE[standard-for-project.md] (IDE Theme #6938ef, 8-pt grid)
 * - Section 178 in .lowcode/.standards/MCP/standard-specification.md
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type TerminalStatus = "idle" | "running" | "success" | "error";
export type TerminalLogType = "stdout" | "stderr" | "info" | "error" | "warn" | "system";

export interface TerminalLogLine {
  id: string;
  text: string;
  type?: TerminalLogType;
  level?: string;
  timestamp?: number | string;
}

export interface IdeTerminalThemeTokens {
  background: string;
  foreground: string;
  cursor: string;
  selection: string;
  border: string;
}
import React from "react";

export type IdeTerminalMode = "vscode" | "interactive" | "stream" | "window";

export interface TerminalTabItem {
  id: string;
  label: string;
  badge?: string | number;
  testId?: string;
}

export interface TerminalSessionOption {
  id: string;
  name: string;
  active?: boolean;
}

export interface IdeTerminalProps {
  id?: string;
  mode?: IdeTerminalMode;
  title?: string | React.ReactNode;
  status?: TerminalStatus;
  prompt?: string | React.ReactNode;
  logs?: (string | TerminalLogLine | { id?: string; text?: string; message?: string; level?: string; type?: string; timestamp?: number | string })[];
  isLight?: boolean;
  maxHeight?: string | number;
  height?: string | number;
  emptyMessage?: string;
  autoScroll?: boolean;

  // Interactive Prompt Handlers
  onCommand?: (cmd: string) => void;
  onExecuteCommand?: (cmd: string) => void;
  inputPlaceholder?: string;
  placeholder?: string;
  inputTestId?: string;
  bufferTestId?: string;
  containerTestId?: string;

  // Actions & Controls
  showCopy?: boolean;
  showClear?: boolean;
  onCopy?: () => void;
  onClear?: () => void;
  copyButtonTestId?: string;
  clearButtonTestId?: string;
  sendButtonTestId?: string;

  // VSCode Top Tabs
  tabs?: TerminalTabItem[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;

  // VSCode Action Toolbar Buttons
  sessionOptions?: TerminalSessionOption[];
  activeSessionId?: string;
  onSelectSession?: (sessionId: string) => void;
  onNewSession?: () => void;
  onSplitTerminal?: () => void;
  onKillTerminal?: () => void;
  onToggleMaximize?: () => void;
  isMaximized?: boolean;
  isSplit?: boolean;

  // Split Secondary Pane
  secondaryTitle?: string;
  secondaryLogs?: (string | TerminalLogLine | { id?: string; text?: string; message?: string; level?: string; type?: string; timestamp?: number | string })[];
  secondaryPrompt?: string | React.ReactNode;
  secondaryInputPlaceholder?: string;
  secondaryInputTestId?: string;
  secondaryBufferTestId?: string;
  onSecondaryCommand?: (cmd: string) => void;
  onCloseSplit?: () => void;

  // Window Controls (mode="window")
  onMinimize?: () => void;
  onClose?: () => void;

  // Layout & Downsized Container Padding
  compactPadding?: boolean;
  contentPadding?: string | number;

  // Custom Theme Tokens Override
  themeTokens?: Partial<IdeTerminalThemeTokens>;

  // Additional elements / children
  sidebar?: React.ReactNode;
  rightSidebar?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export interface TerminalSubComponentProps {
  terminalId: string;
  props: IdeTerminalProps;
  theme: IdeTerminalThemeTokens;
  activePadding: string;
  activePromptPadding: string;
  activeHeaderPadding: string;
  cmdInput: string;
  setCmdInput: (val: string) => void;
  secondaryCmdInput: string;
  setSecondaryCmdInput: (val: string) => void;
  isCopied: boolean;
  handleCopyLogs: () => void;
  handleSubmit: (e?: React.FormEvent) => void;
  handleSecondarySubmit: (e?: React.FormEvent) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  getLineColor: (type: string) => string;
  normalizedLogs: TerminalLogLine[];
  normalizedSecondaryLogs: TerminalLogLine[];
  primaryBottomRef: React.RefObject<HTMLDivElement | null>;
  secondaryBottomRef: React.RefObject<HTMLDivElement | null>;
  inputRef: React.RefObject<HTMLInputElement | null>;
}
