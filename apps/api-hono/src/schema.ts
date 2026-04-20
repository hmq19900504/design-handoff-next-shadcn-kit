import { z } from "zod";

export const riskItemSchema = z.object({
  id: z.string(),
  merchantName: z.string(),
  riskLevel: z.enum(["low", "medium", "high", "critical"]),
  riskTags: z.array(z.string()),
  fulfillmentScore: z.number(),
  source: z.enum(["manual", "model", "complaint", "audit"]),
  owner: z.string(),
  updatedAt: z.string(),
  status: z.enum(["pending", "processing", "resolved", "rejected"])
});

export const dispositionSchema = z.object({
  riskId: z.string(),
  action: z.enum(["mark-safe", "restrict", "escalate"]),
  reason: z.string().min(1)
});

export type RiskItem = z.infer<typeof riskItemSchema>;
export type DispositionRequest = z.infer<typeof dispositionSchema>;
