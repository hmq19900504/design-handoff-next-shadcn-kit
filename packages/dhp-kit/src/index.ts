export type RiskLevel = "low" | "medium" | "high" | "critical";
export type RiskStatus = "pending" | "processing" | "resolved" | "rejected";
export type RiskSource = "manual" | "model" | "complaint" | "audit";

export interface RiskItem {
  id: string;
  merchantName: string;
  riskLevel: RiskLevel;
  riskTags: string[];
  fulfillmentScore: number;
  source: RiskSource;
  owner: string;
  updatedAt: string;
  status: RiskStatus;
}

export interface RiskQuery {
  keyword: string;
  riskLevel: string;
  source: string;
  dateRange: string;
}

export interface Metric {
  label: string;
  value: number | string;
  delta: string;
  tone: "info" | "success" | "warning" | "danger";
}

export interface DispositionRequest {
  riskId: string;
  action: "mark-safe" | "restrict" | "escalate";
  reason: string;
}

export interface DhpBlock {
  type: string;
  json: unknown;
}

export interface DhpDocument {
  path: string;
  title: string;
  markdown: string;
  blocks: DhpBlock[];
}

export interface DhpBundle {
  bundleVersion: string;
  builtAt: string;
  dhpVersion: string;
  module: string;
  language: string;
  targetStack: Record<string, unknown>;
  tokens: Record<string, unknown>;
  componentMap: Record<string, unknown>;
  apiContract: Record<string, unknown> | null;
  pages: DhpDocument[];
  components: DhpDocument[];
  flows: DhpDocument[];
  acceptance: string;
  assumptions: string;
}
