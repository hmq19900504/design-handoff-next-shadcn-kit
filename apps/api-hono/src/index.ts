import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import fs from "node:fs";
import path from "node:path";
import { dispositionSchema } from "./schema.js";
import { riskItems } from "./data.js";

const app = new Hono();
app.use("*", cors());

function readBundle() {
  const bundlePath = path.resolve(process.cwd(), "../../handoff/.handoff/build/handoff.bundle.json");
  if (!fs.existsSync(bundlePath)) return { error: "bundle not found, run npm run dhp:build first" };
  return JSON.parse(fs.readFileSync(bundlePath, "utf8"));
}

app.get("/health", (c) => c.json({ ok: true, service: "dhp-api-hono" }));
app.get("/api/handoff", (c) => c.json(readBundle()));
app.get("/api/risk-items", (c) => {
  const keyword = c.req.query("keyword") || "";
  const riskLevel = c.req.query("riskLevel") || "all";
  const source = c.req.query("source") || "all";
  const filtered = riskItems.filter((item) => {
    const keywordMatched = !keyword || item.id.includes(keyword) || item.merchantName.includes(keyword);
    const levelMatched = riskLevel === "all" || item.riskLevel === riskLevel;
    const sourceMatched = source === "all" || item.source === source;
    return keywordMatched && levelMatched && sourceMatched;
  });
  return c.json(filtered);
});
app.post("/api/dispositions", async (c) => {
  const body = await c.req.json().catch(() => null);
  const parsed = dispositionSchema.safeParse(body);
  if (!parsed.success) return c.json({ ok: false, message: "invalid disposition request", errors: parsed.error.flatten() }, 400);
  return c.json({ ok: true, message: `已提交处置：${parsed.data.action}` });
});

export type AppType = typeof app;

const port = Number(process.env.PORT || 8787);
serve({ fetch: app.fetch, port });
console.log(`DHP Hono API running on http://localhost:${port}`);
