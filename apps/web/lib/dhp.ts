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

export interface Metric {
  label: string;
  value: string | number;
  delta: string;
  tone: "info" | "success" | "warning" | "danger";
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

export const sampleRiskItems: RiskItem[] = [
  {
    id: "RISK-1001",
    merchantName: "青禾生活馆",
    riskLevel: "critical",
    riskTags: ["超时履约", "投诉升高"],
    fulfillmentScore: 62,
    source: "model",
    owner: "运营一组",
    updatedAt: "2026-04-20 09:12",
    status: "pending"
  },
  {
    id: "RISK-1002",
    merchantName: "星桥数码专营店",
    riskLevel: "high",
    riskTags: ["虚假发货", "退款异常"],
    fulfillmentScore: 71,
    source: "complaint",
    owner: "风控组",
    updatedAt: "2026-04-19 17:40",
    status: "processing"
  },
  {
    id: "RISK-1003",
    merchantName: "南山鲜食供应链",
    riskLevel: "medium",
    riskTags: ["时效波动"],
    fulfillmentScore: 84,
    source: "audit",
    owner: "运营二组",
    updatedAt: "2026-04-18 14:22",
    status: "resolved"
  },
  {
    id: "RISK-1004",
    merchantName: "北辰百货旗舰店",
    riskLevel: "low",
    riskTags: ["资料缺失"],
    fulfillmentScore: 91,
    source: "manual",
    owner: "客服治理",
    updatedAt: "2026-04-18 10:01",
    status: "rejected"
  }
];

export function deriveMetrics(items: RiskItem[]): Metric[] {
  const highRisk = items.filter((item) => item.riskLevel === "high" || item.riskLevel === "critical").length;
  const avgScore = Math.round(items.reduce((sum, item) => sum + item.fulfillmentScore, 0) / Math.max(items.length, 1));
  return [
    { label: "待处理风险", value: items.filter((item) => item.status === "pending").length, delta: "+12%", tone: "danger" },
    { label: "高危商户", value: highRisk, delta: "+4", tone: "warning" },
    { label: "平均履约分", value: avgScore, delta: "-3.2", tone: "info" },
    { label: "本周已处置", value: items.filter((item) => item.status === "resolved").length, delta: "+18%", tone: "success" }
  ];
}
