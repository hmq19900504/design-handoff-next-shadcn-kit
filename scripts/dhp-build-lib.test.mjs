import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { buildBundleData } from "./dhp-build-lib.mjs";

function makeHandoffFixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "dhp-build-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));

  fs.mkdirSync(path.join(root, "pages"), { recursive: true });
  fs.mkdirSync(path.join(root, "components"), { recursive: true });
  fs.mkdirSync(path.join(root, "flows"), { recursive: true });
  fs.mkdirSync(path.join(root, "tokens"), { recursive: true });
  fs.mkdirSync(path.join(root, "mapping"), { recursive: true });
  fs.mkdirSync(path.join(root, "api"), { recursive: true });
  fs.mkdirSync(path.join(root, "acceptance"), { recursive: true });
  fs.mkdirSync(path.join(root, ".handoff", "build"), { recursive: true });

  fs.writeFileSync(
    path.join(root, "handoff.json"),
    JSON.stringify({
      dhpVersion: "0.2.0",
      module: "test-module",
      language: "zh-CN",
      targetStack: { frontend: "Next.js" },
      tokens: "tokens/design-tokens.json",
      componentMap: "mapping/component-map.shadcn.json",
      apiContract: "api/api-contract.json",
      pages: ["pages/page.md"],
      components: ["components/card.md"],
      flows: ["flows/flow.md"],
      acceptance: "acceptance/checklist.md"
    }, null, 2) + "\n",
    "utf8"
  );

  fs.writeFileSync(
    path.join(root, "tokens", "design-tokens.json"),
    JSON.stringify({
      color: {
        background: { $value: "#fff", $type: "color" },
        foreground: { $value: "#111", $type: "color" },
        primary: { $value: "#1677ff", $type: "color" }
      },
      spacing: {
        xs: { $value: "4px", $type: "dimension" },
        sm: { $value: "8px", $type: "dimension" },
        md: { $value: "12px", $type: "dimension" },
        lg: { $value: "16px", $type: "dimension" },
        xl: { $value: "24px", $type: "dimension" }
      }
    }, null, 2) + "\n",
    "utf8"
  );

  fs.writeFileSync(
    path.join(root, "mapping", "component-map.shadcn.json"),
    JSON.stringify({
      uiLibrary: "shadcn",
      components: {
        DemoCard: { implementedBy: ["Card"] }
      }
    }, null, 2) + "\n",
    "utf8"
  );

  fs.writeFileSync(
    path.join(root, "api", "api-contract.json"),
    JSON.stringify({ endpoints: [] }, null, 2) + "\n",
    "utf8"
  );

  fs.writeFileSync(
    path.join(root, "pages", "page.md"),
    [
      "# Demo Page",
      "",
      "```dhp-layout",
      JSON.stringify({ pageId: "demo", route: "/", layout: { type: "PageShell", children: [] } }, null, 2),
      "```",
      "",
      "```dhp-state-matrix",
      JSON.stringify({ states: [{ name: "success" }] }, null, 2),
      "```"
    ].join("\n"),
    "utf8"
  );

  fs.writeFileSync(
    path.join(root, "components", "card.md"),
    [
      "# Demo Card",
      "",
      "```dhp-component",
      JSON.stringify({ name: "DemoCard", implementedBy: ["Card"] }, null, 2),
      "```"
    ].join("\n"),
    "utf8"
  );

  fs.writeFileSync(
    path.join(root, "flows", "flow.md"),
    "# Demo Flow\n",
    "utf8"
  );

  fs.writeFileSync(
    path.join(root, "acceptance", "checklist.md"),
    "- [ ] demo\n",
    "utf8"
  );

  return root;
}

test("首次构建应该使用当前时间写入 builtAt", (t) => {
  const root = makeHandoffFixture(t);
  const bundle = buildBundleData({ root, now: new Date("2026-04-21T15:00:00.000Z") });

  assert.equal(bundle.builtAt, "2026-04-21T15:00:00.000Z");
});

test("重复构建且内容未变化时应该复用旧的 builtAt", (t) => {
  const root = makeHandoffFixture(t);
  const oldBuiltAt = "2026-04-20T06:57:53.438Z";
  const out = path.join(root, ".handoff", "build", "handoff.bundle.json");
  const initialBundle = buildBundleData({ root, now: new Date(oldBuiltAt) });
  fs.writeFileSync(out, JSON.stringify(initialBundle, null, 2) + "\n", "utf8");

  const rebuilt = buildBundleData({ root, now: new Date("2026-04-21T15:00:00.000Z") });

  assert.equal(rebuilt.builtAt, oldBuiltAt);
});

test("协议内容变化时应该刷新 builtAt", (t) => {
  const root = makeHandoffFixture(t);
  const oldBuiltAt = "2026-04-20T06:57:53.438Z";
  const out = path.join(root, ".handoff", "build", "handoff.bundle.json");
  const initialBundle = buildBundleData({ root, now: new Date(oldBuiltAt) });
  fs.writeFileSync(out, JSON.stringify(initialBundle, null, 2) + "\n", "utf8");

  fs.writeFileSync(
    path.join(root, "acceptance", "checklist.md"),
    "- [ ] demo\n- [ ] changed\n",
    "utf8"
  );

  const rebuilt = buildBundleData({ root, now: new Date("2026-04-21T15:00:00.000Z") });

  assert.equal(rebuilt.builtAt, "2026-04-21T15:00:00.000Z");
});

test("builtAt 应该保持在 bundleVersion 之后，避免无意义字段重排", (t) => {
  const root = makeHandoffFixture(t);
  const bundle = buildBundleData({ root, now: new Date("2026-04-21T15:00:00.000Z") });

  assert.deepEqual(Object.keys(bundle).slice(0, 3), ["bundleVersion", "builtAt", "source"]);
});
