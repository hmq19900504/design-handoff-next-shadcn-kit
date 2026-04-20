import type { RiskItem } from "./schema.js";

export const riskItems: RiskItem[] = [
  { id: "RISK-1001", merchantName: "青禾生活馆", riskLevel: "critical", riskTags: ["超时履约", "投诉升高"], fulfillmentScore: 62, source: "model", owner: "运营一组", updatedAt: "2026-04-20 09:12", status: "pending" },
  { id: "RISK-1002", merchantName: "星桥数码专营店", riskLevel: "high", riskTags: ["虚假发货", "退款异常"], fulfillmentScore: 71, source: "complaint", owner: "风控组", updatedAt: "2026-04-19 17:40", status: "processing" },
  { id: "RISK-1003", merchantName: "南山鲜食供应链", riskLevel: "medium", riskTags: ["时效波动"], fulfillmentScore: 84, source: "audit", owner: "运营二组", updatedAt: "2026-04-18 14:22", status: "resolved" },
  { id: "RISK-1004", merchantName: "北辰百货旗舰店", riskLevel: "low", riskTags: ["资料缺失"], fulfillmentScore: 91, source: "manual", owner: "客服治理", updatedAt: "2026-04-18 10:01", status: "rejected" }
];
