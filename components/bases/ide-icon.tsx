"use client";

import * as AllLucideIcons from "lucide-react";
import React, { useId } from "react";

export type LucideIcon = React.ComponentType<{
  size?: number | string;
  color?: string;
  strokeWidth?: number;
  className?: string;
  style?: React.CSSProperties;
  fill?: string;
  id?: string;
  [key: string]: unknown;
}>;

const {
  Activity,
  AlertCircle,
  AlertTriangle,
  AlignLeft,
  AppWindow,
  AreaChart,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Award,
  BadgeCheck,
  Ban,
  BarChart3,
  Baseline,
  Bell,
  Bold,
  BookOpen,
  Bot,
  Box,
  Building2,
  Calendar,
  Camera,
  Check,
  CheckCircle,
  CheckCircle2,
  CheckSquare,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  CircleDot,
  CircleStop,
  ClipboardPaste,
  Clock,
  Cloud,
  CloudDownload,
  Code,
  Code2,
  Columns,
  Compass,
  Copy,
  Cpu,
  CreditCard,
  Database,
  Download,
  Edit,
  ExternalLink,
  Eye,
  EyeOff,
  File,
  FileArchive,
  FileAudio,
  FileCode,
  FileCode2,
  FileEdit,
  FileJson,
  FileSpreadsheet,
  FileText,
  FileType,
  FileVideo,
  Filter,
  Flame,
  FlaskConical,
  Folder,
  FolderOpen,
  FormInput,
  Globe,
  Grid3X3,
  Heading,
  Heart,
  HelpCircle,
  Home,
  Image: ImageIcon,
  Info,
  Italic,
  Key,
  Layers,
  LayoutGrid,
  LayoutList,
  LayoutTemplate,
  LineChart,
  Link,
  Link2,
  List,
  ListMinus,
  ListOrdered,
  ListPlus,
  Loader2,
  Lock,
  LogIn,
  LogOut,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  MessageSquare,
  Minus,
  MinusCircle,
  Monitor,
  MousePointer,
  MoveHorizontal,
  MoveVertical,
  Paintbrush,
  PaintBucket,
  Palette,
  PanelBottom,
  PanelLeftClose,
  PanelLeftOpen,
  PanelTop,
  PauseCircle,
  PenTool,
  Phone,
  PieChart,
  Pilcrow,
  Play,
  PlayCircle,
  Plus,
  PlusCircle,
  PlusSquare,
  Presentation,
  RectangleHorizontal,
  RefreshCw,
  RotateCcw,
  Rows3,
  Save,
  Scan,
  Scissors,
  Search,
  Send,
  SeparatorHorizontal,
  Server,
  Settings,
  Settings2,
  Share2,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Sliders,
  SlidersHorizontal,
  Sparkles,
  Square,
  SquareStack,
  Star,
  Table2,
  TableColumnsSplit,
  TableRowsSplit,
  Tag,
  Target,
  Terminal,
  ToggleRight,
  Trash,
  Trash2,
  TrendingUp,
  Truck,
  Type,
  Underline,
  Unlock,
  Upload,
  User,
  UserPlus,
  Users,
  Video,
  Volume2,
  Workflow,
  Wrench,
  X,
  XCircle,
  Zap,
  ZoomIn,
  ZoomOut,
} = (AllLucideIcons as unknown as Record<string, LucideIcon>);

export type IdeIconSize = "xs" | "sm" | "md" | "lg" | "xl" | number | string;

export type IdeIconVariant =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "muted"
  | "accent"
  | "outline"
  | "filled"
  | "solid";

export interface IdeIconProps {
  /** Icon name (PascalCase, kebab-case, node-type, legacy emoji, or *Outlined/*Filled variant) OR Lucide component */
  name?: string | LucideIcon | React.ReactNode;
  /** Ant Design / legacy alias for icon name */
  type?: string;
  /** Visual theme or style variant */
  variant?: IdeIconVariant;
  /** Size preset: xs (12px), sm (14px), md (16px), lg (20px), xl (24px) or custom integer px */
  size?: IdeIconSize;
  /** Stroke color (default: inherit / currentColor or var(--primary)) */
  color?: string;
  /** Fill color for vector SVG icons (default: "none" / transparent empty color) */
  fill?: string;
  /** Vector stroke width (default: 1.75) */
  strokeWidth?: number;
  /** Extra CSS classes */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Accessible label (if provided, role="img" and aria-label are set; otherwise aria-hidden="true") */
  "aria-label"?: string;
  ariaHidden?: boolean;
  /** Test identifier for automated testing */
  "data-testid"?: string;
  testId?: string;
  /** Tooltip or title text */
  title?: string;
  /** Element ID for A11y & E2E Testing */
  id?: string;
  /** Click handler */
  onClick?: (event: React.MouseEvent<SVGSVGElement | HTMLSpanElement>) => void;
  /** Custom fallback component if icon is unresolved */
  fallback?: React.ReactNode;
}

const SIZE_MAP: Record<string, number> = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
};

const VARIANT_COLOR_MAP: Record<string, string> = {
  primary: "var(--primary, #6938ef)",
  secondary: "var(--secondary, #875bf7)",
  success: "var(--success, #10b981)",
  warning: "var(--warning, #f59e0b)",
  danger: "var(--danger, #ef4444)",
  info: "var(--info, #3b82f6)",
  muted: "var(--text-muted, #64748b)",
  accent: "var(--accent, #6938ef)",
};

const VARIANT_CLASS_MAP: Record<string, string> = {
  primary: "ide-icon-primary text-primary",
  secondary: "ide-icon-secondary text-secondary",
  success: "ide-icon-success text-success",
  warning: "ide-icon-warning text-warning",
  danger: "ide-icon-danger text-danger",
  info: "ide-icon-info text-info",
  muted: "ide-icon-muted text-muted",
  accent: "ide-icon-accent text-accent",
  outline: "ide-icon-outline",
  filled: "ide-icon-filled",
  solid: "ide-icon-solid",
};

const ANT_DESIGN_ALIAS_MAP: Record<string, string> = {
  CloseCircle: "XCircle",
  CheckCircle: "CheckCircle2",
  ClockCircle: "Clock",
  ExclamationCircle: "AlertCircle",
  MinusCircle: "MinusCircle",
  PlusCircle: "PlusCircle",
  QuestionCircle: "HelpCircle",
  PauseCircle: "PauseCircle",
  PlayCircle: "PlayCircle",
  Stop: "Square",
  Reload: "RefreshCw",
  Sync: "RefreshCw",
  Delete: "Trash2",
  Setting: "Settings",
  Tool: "Settings",
  Desktop: "Monitor",
  Team: "Users",
  Group: "Users",
  UserAdd: "UserPlus",
  Thunderbolt: "Zap",
  Global: "Globe",
  Safety: "Shield",
  SafetyCertificate: "ShieldCheck",
  SecurityScan: "ShieldAlert",
  MenuFold: "PanelLeftClose",
  MenuUnfold: "PanelLeftOpen",
  Appstore: "Grid3X3",
  Robot: "Bot",
  Logout: "LogOut",
  Login: "LogIn",
  Up: "ChevronUp",
  Down: "ChevronDown",
  Left: "ChevronLeft",
  Right: "ChevronRight",
  BgColors: "Palette",
  FontColors: "Type",
  PlusSquare: "PlusSquare",
  BorderInner: "Square",
  BorderOuter: "Square",
  Loading: "Loader2",
  Warning: "AlertTriangle",
  Message: "MessageSquare",
  Input: "FormInput",
  FormInput: "FormInput",
  Type: "Type",
};

const RowsPlus: LucideIcon = ({ size = 24, color = "currentColor", strokeWidth = 2, fill = "none", className, style, id, "aria-hidden": ariaHidden, "aria-label": ariaLabel, role, onClick, "data-testid": dataTestId }: Record<string, unknown>) => (
  <svg
    id={id as string | undefined}
    data-testid={dataTestId as string | undefined}
    xmlns="http://www.w3.org/2000/svg"
    width={size as number | string}
    height={size as number | string}
    viewBox="0 0 24 24"
    fill={fill as string}
    stroke={color as string}
    strokeWidth={strokeWidth as number}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className as string | undefined}
    style={style as React.CSSProperties | undefined}
    aria-hidden={ariaHidden as boolean | "true" | "false" | undefined}
    aria-label={ariaLabel as string | undefined}
    role={role as string | undefined}
    onClick={onClick as React.MouseEventHandler<SVGSVGElement> | undefined}
  >
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="M3 9h18" />
    <path d="M3 15h18" />
    <path d="M12 10.5v3" />
    <path d="M10.5 12h3" />
  </svg>
);

const RowsMinus: LucideIcon = ({ size = 24, color = "currentColor", strokeWidth = 2, fill = "none", className, style, id, "aria-hidden": ariaHidden, "aria-label": ariaLabel, role, onClick, "data-testid": dataTestId }: Record<string, unknown>) => (
  <svg
    id={id as string | undefined}
    data-testid={dataTestId as string | undefined}
    xmlns="http://www.w3.org/2000/svg"
    width={size as number | string}
    height={size as number | string}
    viewBox="0 0 24 24"
    fill={fill as string}
    stroke={color as string}
    strokeWidth={strokeWidth as number}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className as string | undefined}
    style={style as React.CSSProperties | undefined}
    aria-hidden={ariaHidden as boolean | "true" | "false" | undefined}
    aria-label={ariaLabel as string | undefined}
    role={role as string | undefined}
    onClick={onClick as React.MouseEventHandler<SVGSVGElement> | undefined}
  >
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="M3 9h18" />
    <path d="M3 15h18" />
    <path d="M10.5 12h3" />
  </svg>
);

const ColumnsPlus: LucideIcon = ({ size = 24, color = "currentColor", strokeWidth = 2, fill = "none", className, style, id, "aria-hidden": ariaHidden, "aria-label": ariaLabel, role, onClick, "data-testid": dataTestId }: Record<string, unknown>) => (
  <svg
    id={id as string | undefined}
    data-testid={dataTestId as string | undefined}
    xmlns="http://www.w3.org/2000/svg"
    width={size as number | string}
    height={size as number | string}
    viewBox="0 0 24 24"
    fill={fill as string}
    stroke={color as string}
    strokeWidth={strokeWidth as number}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className as string | undefined}
    style={style as React.CSSProperties | undefined}
    aria-hidden={ariaHidden as boolean | "true" | "false" | undefined}
    aria-label={ariaLabel as string | undefined}
    role={role as string | undefined}
    onClick={onClick as React.MouseEventHandler<SVGSVGElement> | undefined}
  >
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="M9 3v18" />
    <path d="M15 3v18" />
    <path d="M12 10.5v3" />
    <path d="M10.5 12h3" />
  </svg>
);

const ColumnsMinus: LucideIcon = ({ size = 24, color = "currentColor", strokeWidth = 2, fill = "none", className, style, id, "aria-hidden": ariaHidden, "aria-label": ariaLabel, role, onClick, "data-testid": dataTestId }: Record<string, unknown>) => (
  <svg
    id={id as string | undefined}
    data-testid={dataTestId as string | undefined}
    xmlns="http://www.w3.org/2000/svg"
    width={size as number | string}
    height={size as number | string}
    viewBox="0 0 24 24"
    fill={fill as string}
    stroke={color as string}
    strokeWidth={strokeWidth as number}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className as string | undefined}
    style={style as React.CSSProperties | undefined}
    aria-hidden={ariaHidden as boolean | "true" | "false" | undefined}
    aria-label={ariaLabel as string | undefined}
    role={role as string | undefined}
    onClick={onClick as React.MouseEventHandler<SVGSVGElement> | undefined}
  >
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="M9 3v18" />
    <path d="M15 3v18" />
    <path d="M10.5 12h3" />
  </svg>
);

// Fast primary icon dictionary
const COMMON_LUCIDE_MAP: Record<string, LucideIcon> = {
  RowsPlus,
  RowsMinus,
  ColumnsPlus,
  ColumnsMinus,
  Activity,
  AlertCircle,
  AlertTriangle,
  AlignLeft,
  AppWindow,
  AreaChart,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Award,
  BadgeCheck,
  Ban,
  BarChart3,
  Baseline,
  Bell,
  Bold,
  BookOpen,
  Bot,
  Box,
  Building2,
  Calendar,
  Camera,
  Check,
  CheckCircle,
  CheckCircle2,
  CheckSquare,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  CircleDot,
  CircleStop,
  ClipboardPaste,
  Clock,
  Cloud,
  CloudDownload,
  Code,
  Code2,
  Columns,
  Compass,
  Copy,
  Cpu,
  CreditCard,
  Database,
  Download,
  Edit,
  ExternalLink,
  Eye,
  EyeOff,
  File,
  FileArchive,
  FileAudio,
  FileCode,
  FileCode2,
  FileEdit,
  FileJson,
  FileSpreadsheet,
  FileText,
  FileType,
  FileVideo,
  Filter,
  Flame,
  FlaskConical,
  Folder,
  FolderOpen,
  FormInput,
  Globe,
  Grid3X3,
  Heading,
  Heart,
  HelpCircle,
  Home,
  Image: ImageIcon,
  ImageIcon,
  Info,
  Italic,
  Key,
  Layers,
  LayoutGrid,
  LayoutList,
  LayoutTemplate,
  LineChart,
  Link,
  Link2,
  List,
  ListMinus,
  ListOrdered,
  ListPlus,
  Loader2,
  Lock,
  LogIn,
  LogOut,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  MessageSquare,
  Minus,
  MinusCircle,
  Monitor,
  MousePointer,
  MoveHorizontal,
  MoveVertical,
  Paintbrush,
  PaintBucket,
  Palette,
  PanelBottom,
  PanelLeftClose,
  PanelLeftOpen,
  PanelTop,
  PauseCircle,
  PenTool,
  Phone,
  PieChart,
  Pilcrow,
  Play,
  PlayCircle,
  Plus,
  PlusCircle,
  PlusSquare,
  Presentation,
  RectangleHorizontal,
  RefreshCw,
  RotateCcw,
  Rows3,
  Save,
  Scan,
  Scissors,
  Search,
  Send,
  SeparatorHorizontal,
  Server,
  Settings,
  Settings2,
  Share2,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Sliders,
  SlidersHorizontal,
  Sparkles,
  Square,
  SquareStack,
  Star,
  Table2,
  TableColumnsSplit,
  TableRowsSplit,
  Tag,
  Target,
  Terminal,
  ToggleRight,
  Trash,
  Trash2,
  TrendingUp,
  Truck,
  Type,
  Underline,
  Unlock,
  Upload,
  User,
  UserPlus,
  Users,
  Video,
  Volume2,
  Workflow,
  Wrench,
  X,
  XCircle,
  Zap,
  ZoomIn,
  ZoomOut,
};

const EMOJI_MAP: Record<string, string> = {
  "📊": "BarChart3",
  "📈": "TrendingUp",
  "📉": "AreaChart",
  "🥧": "PieChart",
  "🔔": "Bell",
  "✨": "Sparkles",
  "⚡": "Zap",
  "🔴": "AlertCircle",
  "✅": "CheckCircle2",
  "❌": "XCircle",
  "✓": "Check",
  "✕": "X",
  "⚠️": "AlertTriangle",
  "ℹ️": "Info",
  "➡️": "ArrowRight",
  "⬅️": "ArrowLeft",
  "⬆️": "ArrowUp",
  "⬇️": "ArrowDown",
  "🔍": "Search",
  "⚙️": "Settings",
  "⚙": "Settings",
  "🛠": "Wrench",
  "🛠️": "Wrench",
  "🔄": "RefreshCw",
  "🚫": "Ban",
  "🎨": "Palette",
  "✏️": "PenTool",
  "🖱️": "MousePointer",
  "🔒": "Lock",
  "🔓": "Unlock",
  "🔑": "Key",
  "🌐": "Globe",
  "✉️": "Mail",
  "📦": "Box",
  "🎯": "Target",
  "🌟": "Star",
  "❤️": "Heart",
  "💬": "MessageSquare",
  "👥": "Users",
  "👤": "User",
  "🚚": "Truck",
  "💳": "CreditCard",
  "🏬": "Building2",
  "🤖": "Bot",
  "☁️": "Cloud",
  "🛡️": "Shield",
  "📁": "Folder",
  "📂": "FolderOpen",
  "💾": "Save",
  "🖥️": "Monitor",
};

/**
 * Resolves an icon name string, stripping Outlined/Filled suffixes and mapping Ant Design aliases.
 */
function resolveParsedIconName(nameString: string): {
  resolvedName: string;
  isFilled: boolean;
  isOutlined: boolean;
} {
  const trimmed: string = nameString.trim();

  // 1. Emoji check
  if (EMOJI_MAP[trimmed]) {
    return { resolvedName: EMOJI_MAP[trimmed], isFilled: false, isOutlined: false };
  }

  let effectiveName: string = trimmed;
  let isFilled: boolean = false;
  let isOutlined: boolean = false;

  // 2. Suffix parsing (Filled / Outlined / TwoTone)
  if (trimmed.endsWith("Filled") && trimmed.length > 6) {
    isFilled = true;
    effectiveName = trimmed.slice(0, -6);
  } else if (trimmed.endsWith("Outlined") && trimmed.length > 8) {
    isOutlined = true;
    effectiveName = trimmed.slice(0, -8);
  } else if (trimmed.endsWith("TwoTone") && trimmed.length > 7) {
    effectiveName = trimmed.slice(0, -7);
  }

  // 3. Ant Design aliases
  if (ANT_DESIGN_ALIAS_MAP[effectiveName]) {
    effectiveName = ANT_DESIGN_ALIAS_MAP[effectiveName];
  }

  // 4. Kebab-case normalization
  if (effectiveName.includes("-") || effectiveName.includes("_")) {
    effectiveName = effectiveName
      .split(/[-_]/)
      .map((part: string) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join("");
  }

  return { resolvedName: effectiveName, isFilled, isOutlined };
}

/**
 * Standard IDE Icon Base Component
 * Ensures 100% crisp vector SVG icons adhering to IDE standard & theme tokens.
 * Supports full `variant` styling, `*Outlined` and `*Filled` variants.
 */
export function IdeIcon({
  name,
  type,
  variant,
  size = "sm",
  color,
  fill,
  strokeWidth = 1.75,
  className = "",
  style,
  "aria-label": ariaLabel,
  ariaHidden,
  "data-testid": dataTestId,
  testId,
  title,
  id,
  onClick,
  fallback,
}: IdeIconProps) {
  const effectiveTestId: string | undefined = dataTestId || testId;
  const autoId: string = useId();
  const effectiveId: string = id || `ide-icon-${autoId.replace(/[:]/g, "")}`;

  // Resolve pixel size
  const numericSize: number =
    typeof size === "number"
      ? size
      : SIZE_MAP[size] || (typeof size === "string" && !isNaN(Number(size)) ? Number(size) : 14);

  // Resolve variant color
  const effectiveColor: string | undefined = color || (variant ? VARIANT_COLOR_MAP[variant] : undefined);

  // 1. If name is already a valid React Element (e.g. <Settings size={14}/>)
  if (React.isValidElement(name)) {
    return (
      <span
        id={effectiveId}
        data-testid={effectiveTestId}
        className={`ide-icon-wrapper ${className}`}
        style={style}
        onClick={onClick}
        title={title}
        aria-hidden={ariaHidden ?? (ariaLabel ? false : true)}
        aria-label={ariaLabel}
        role={ariaLabel ? "img" : undefined}
      >
        {name}
      </span>
    );
  }

  // 2. If name is a Lucide component function (e.g. SlidersHorizontal)
  if (typeof name === "function") {
    const Component: LucideIcon = name as LucideIcon;
    const isComponentFilled: boolean = variant === "filled" || variant === "solid";
    const componentFill: string = fill || (isComponentFilled ? (effectiveColor || "currentColor") : "none");

    return (
      <Component
        id={effectiveId}
        data-testid={effectiveTestId}
        size={numericSize}
        color={effectiveColor}
        fill={componentFill}
        strokeWidth={strokeWidth}
        className={`ide-icon ${variant ? VARIANT_CLASS_MAP[variant] || `ide-icon-${variant}` : ""} ${className}`}
        style={style}
        aria-label={ariaLabel}
        aria-hidden={ariaHidden ?? (ariaLabel ? false : true)}
        role={ariaLabel ? "img" : undefined}
        onClick={onClick}
      />
    );
  }

  // 3. Resolve string name & variant suffixes
  const candidateName: unknown = name ?? type;
  const nameString: string = typeof candidateName === "string" ? candidateName : "Box";
  const { resolvedName, isFilled, isOutlined } = resolveParsedIconName(nameString);

  // Resolve fill
  const isFillRequested: boolean =
    variant === "filled" ||
    variant === "solid" ||
    isFilled;

  const effectiveFill: string =
    fill !== undefined
      ? fill
      : isFillRequested
      ? effectiveColor || "currentColor"
      : "none";

  const effectiveVariantClass: string = variant ? VARIANT_CLASS_MAP[variant] || `ide-icon-${variant}` : "";
  const combinedClass: string = [
    "ide-icon",
    effectiveVariantClass,
    isFilled ? "ide-icon-filled" : isOutlined ? "ide-icon-outlined" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // Lookup in COMMON map or ALL Lucide icons
  const IconComponent: LucideIcon =
    COMMON_LUCIDE_MAP[resolvedName] ||
    ((AllLucideIcons as unknown as Record<string, LucideIcon>)[resolvedName]) ||
    Box;

  if (!IconComponent) {
    if (fallback) return <>{fallback}</>;
    return (
      <Box
        id={effectiveId}
        data-testid={effectiveTestId}
        size={numericSize}
        color={effectiveColor}
        fill={effectiveFill}
        strokeWidth={strokeWidth}
        className={`ide-icon ide-icon-fallback ${combinedClass}`}
        style={style}
        aria-label={ariaLabel}
        aria-hidden={ariaHidden ?? (ariaLabel ? false : true)}
        role={ariaLabel ? "img" : undefined}
        onClick={onClick}
      />
    );
  }

  return (
    <IconComponent
      id={effectiveId}
      data-testid={effectiveTestId}
      size={numericSize}
      color={effectiveColor}
      fill={effectiveFill}
      strokeWidth={strokeWidth}
      className={`ide-icon-${resolvedName.toLowerCase()} ${combinedClass}`}
      style={style}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden ?? (ariaLabel ? false : true)}
      role={ariaLabel ? "img" : undefined}
      onClick={onClick}
    />
  );
}

export default IdeIcon;
