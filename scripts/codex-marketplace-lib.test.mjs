import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { getDefaultToolingTargets, getMarketplaceRegistrationStatus, renderMarketplaceBlock, upsertMarketplaceConfig } from "./codex-marketplace-lib.mjs";

test("缺少 marketplace 配置时应该追加本地市场块", () => {
  const initial = 'model = "gpt-5.4"\n';
  const result = upsertMarketplaceConfig(initial, {
    marketplaceName: "dhp-local-marketplace",
    source: "/repo/design-handoff-kit"
  });

  assert.match(result.content, /\[marketplaces\.dhp-local-marketplace\]/);
  assert.match(result.content, /source_type = "local"/);
  assert.match(result.content, /source = "\/repo\/design-handoff-kit"/);
  assert.equal(result.status, "added");
});

test("已存在相同 marketplace 配置时不应重复写入", () => {
  const initial = [
    'model = "gpt-5.4"',
    "",
    "[marketplaces.dhp-local-marketplace]",
    'source_type = "local"',
    'source = "/repo/design-handoff-kit"',
    ""
  ].join("\n");

  const result = upsertMarketplaceConfig(initial, {
    marketplaceName: "dhp-local-marketplace",
    source: "/repo/design-handoff-kit"
  });

  assert.equal(result.status, "unchanged");
  assert.equal((result.content.match(/\[marketplaces\.dhp-local-marketplace\]/g) || []).length, 1);
});

test("已存在同名 marketplace 但 source 不同时应该更新", () => {
  const initial = [
    'model = "gpt-5.4"',
    "",
    "[marketplaces.dhp-local-marketplace]",
    'source_type = "local"',
    'source = "/old/path"',
    "",
    "[marketplaces.openai-bundled]",
    'source_type = "local"',
    'source = "/tmp/openai"',
    ""
  ].join("\n");

  const result = upsertMarketplaceConfig(initial, {
    marketplaceName: "dhp-local-marketplace",
    source: "/repo/design-handoff-kit"
  });

  assert.equal(result.status, "updated");
  assert.match(result.content, /source = "\/repo\/design-handoff-kit"/);
  assert.match(result.content, /\[marketplaces\.openai-bundled\]/);
});

test("统一工具目标默认应该只覆盖 codex、claude skill", () => {
  const targets = getDefaultToolingTargets({
    repoRoot: "/repo/design-handoff-kit",
    homeDir: "/Users/tester"
  });

  assert.equal(targets.skillLinks.length, 2);
  assert.equal(targets.skillLinks[0].destination, "/Users/tester/.codex/skills/design-handoff-next-shadcn");
  assert.equal(targets.skillLinks[1].destination, "/Users/tester/.agents/skills/design-handoff-next-shadcn");
  assert.equal(targets.marketplace, null);
});

test("显式启用时才应该返回 codex marketplace 目标", () => {
  const targets = getDefaultToolingTargets({
    repoRoot: "/repo/design-handoff-kit",
    homeDir: "/Users/tester",
    includeMarketplace: true
  });

  assert.equal(targets.skillLinks.length, 2);
  assert.equal(targets.marketplace.name, "dhp-local-marketplace");
  assert.equal(targets.marketplace.source, "/repo/design-handoff-kit");
});

test("marketplace 块渲染应该稳定可读", () => {
  const block = renderMarketplaceBlock({
    marketplaceName: "dhp-local-marketplace",
    source: "/repo/design-handoff-kit"
  });

  assert.equal(block, [
    "[marketplaces.dhp-local-marketplace]",
    'source_type = "local"',
    'source = "/repo/design-handoff-kit"',
    ""
  ].join("\n"));
});

test("状态检查遇到已注册 marketplace 时应该返回 registered", (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "dhp-marketplace-status-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const configPath = path.join(root, "config.toml");

  fs.writeFileSync(
    configPath,
    [
      'model = "gpt-5.4"',
      "",
      "[marketplaces.dhp-local-marketplace]",
      'source_type = "local"',
      'source = "/repo/design-handoff-kit"'
    ].join("\n"),
    "utf8"
  );

  const result = getMarketplaceRegistrationStatus({
    configPath,
    marketplaceName: "dhp-local-marketplace",
    source: "/repo/design-handoff-kit"
  });

  assert.equal(result.status, "registered");
});
