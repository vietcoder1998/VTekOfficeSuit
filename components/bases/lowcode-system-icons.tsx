"use client";

import React from "react";
import {
  Server,
  Box,
  Package,
  User,
  Truck,
  CreditCard,
  Building2,
  Database,
  Cpu,
  Boxes,
  Shield,
  Zap,
  Activity,
  FileCode,
  Terminal,
  Bell,
  BarChart3,
  Bot,
  Sparkles,
  Layers,
  Cloud,
  Globe,
  Radio,
  Sliders,
  Workflow,
  Lock,
  Flame,
  CheckCircle2,
} from "lucide-react";

export interface LowcodeSystemIconPreset {
  id: string;
  label: string;
  category: "core" | "business" | "infra" | "data";
  icon: React.ComponentType<{ size?: number; className?: string; color?: string; style?: React.CSSProperties; id?: string }>;
}

export const LOWCODE_PRESET_SYSTEM_ICONS: LowcodeSystemIconPreset[] = [
  { id: "server", label: "Server / Backend", category: "core", icon: Server },
  { id: "box", label: "Package / Module", category: "core", icon: Package },
  { id: "cpu", label: "WASM / Compute", category: "core", icon: Cpu },
  { id: "workflow", label: "Workflow / Pipeline", category: "core", icon: Workflow },

  { id: "user", label: "User & Identity", category: "business", icon: User },
  { id: "truck", label: "Logistics & Transport", category: "business", icon: Truck },
  { id: "credit-card", label: "Payment & Billing", category: "business", icon: CreditCard },
  { id: "building", label: "Warehouse & Inventory", category: "business", icon: Building2 },
  { id: "bar-chart", label: "Analytics & Reports", category: "business", icon: BarChart3 },

  { id: "database", label: "Database / Relational", category: "data", icon: Database },
  { id: "layers", label: "Document / MongoDB", category: "data", icon: Layers },
  { id: "zap", label: "Cache / Redis", category: "data", icon: Zap },
  { id: "activity", label: "Telemetry & Logs", category: "data", icon: Activity },

  { id: "cloud", label: "Cloud Services", category: "infra", icon: Cloud },
  { id: "shield", label: "Security & Auth", category: "infra", icon: Shield },
  { id: "bell", label: "Notification / Webhook", category: "infra", icon: Bell },
  { id: "bot", label: "AI & Automation", category: "infra", icon: Bot },
];

/**
 * Maps any string icon identifier (or legacy emoji) to a crisp Lucide System Icon SVG component.
 */
export function renderLowcodeSystemIcon(
  iconKey?: string,
  options: {
    id?: string;
    size?: number;
    className?: string;
    color?: string;
    style?: React.CSSProperties;
    defaultIcon?: React.ReactNode;
  } = {}
): React.ReactNode {
  const { id, size = 12, className = "", color, style = {} } = options;
  const key = (iconKey || "").toLowerCase().trim();

  // 1. Exact key / keyword matches & legacy emoji conversions
  if (key === "user" || key === "identity" || key === "customer" || key === "profile" || key === "👤") {
    return <User id={id} size={size} className={className} color={color} style={style} />;
  }
  if (key === "truck" || key === "transport" || key === "logistics" || key === "delivery" || key === "🚚") {
    return <Truck id={id} size={size} className={className} color={color} style={style} />;
  }
  if (key === "credit-card" || key === "card" || key === "payment" || key === "billing" || key === "stripe" || key === "💳") {
    return <CreditCard id={id} size={size} className={className} color={color} style={style} />;
  }
  if (key === "building" || key === "warehouse" || key === "inventory" || key === "store" || key === "🏬") {
    return <Building2 id={id} size={size} className={className} color={color} style={style} />;
  }
  if (key === "database" || key === "postgres" || key === "postgresql" || key === "mysql" || key === "sql" || key === "🐘" || key === "🐬") {
    return <Database id={id} size={size} className={className} color={color} style={style} />;
  }
  if (key === "layers" || key === "mongo" || key === "mongodb" || key === "document" || key === "leaf" || key === "🍃") {
    return <Layers id={id} size={size} className={className} color={color} style={style} />;
  }
  if (key === "zap" || key === "redis" || key === "cache" || key === "in-memory" || key === "event" || key === "⚡") {
    return <Zap id={id} size={size} className={className} color={color} style={style} />;
  }
  if (key === "cpu" || key === "wasm" || key === "processor" || key === "runtime" || key === "engine") {
    return <Cpu id={id} size={size} className={className} color={color} style={style} />;
  }
  if (key === "boxes" || key === "microservices" || key === "cluster") {
    return <Boxes id={id} size={size} className={className} color={color} style={style} />;
  }
  if (key === "shield" || key === "security" || key === "auth" || key === "oauth" || key === "🛡️") {
    return <Shield id={id} size={size} className={className} color={color} style={style} />;
  }
  if (key === "activity" || key === "telemetry" || key === "analytics" || key === "clickhouse" || key === "📊") {
    return <Activity id={id} size={size} className={className} color={color} style={style} />;
  }
  if (key === "bell" || key === "notification" || key === "alert" || key === "webhook" || key === "🔔") {
    return <Bell id={id} size={size} className={className} color={color} style={style} />;
  }
  if (key === "bot" || key === "ai" || key === "assistant" || key === "agent" || key === "🤖") {
    return <Bot id={id} size={size} className={className} color={color} style={style} />;
  }
  if (key === "file-code" || key === "code" || key === "sqlite" || key === "types" || key === "models" || key === "🗄️") {
    return <FileCode id={id} size={size} className={className} color={color} style={style} />;
  }
  if (key === "cloud" || key === "supabase" || key === "aws") {
    return <Cloud id={id} size={size} className={className} color={color} style={style} />;
  }
  if (key === "box" || key === "package" || key === "order" || key === "product" || key === "sku" || key === "📦") {
    return <Package id={id} size={size} className={className} color={color} style={style} />;
  }

  // 2. Default System Icon: Server
  if (options.defaultIcon) return options.defaultIcon;
  return <Server id={id} size={size} className={className} color={color} style={style} />;
}
