import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { syncVersionFiles } from "./version-sync-lib.mjs";

function makeRepoFixture(t, { packageVersion = "0.2.0", pluginVersion = "0.1.0", skillVersion = "0.1.0" } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "dhp-version-sync-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));

  fs.mkdirSync(path.join(root, "plugins", "dhp-next-shadcn", ".codex-plugin"), { recursive: true });
  fs.mkdirSync(path.join(root, "plugins", "dhp-next-shadcn", "skills", "design-handoff-next-shadcn"), { recursive: true });

  fs.writeFileSync(
    path.join(root, "package.json"),
    JSON.stringify({ name: "design-handoff-next-shadcn-kit", version: packageVersion }, null, 2) + "\n",
    "utf8"
  );
  fs.writeFileSync(
    path.join(root, "plugins", "dhp-next-shadcn", ".codex-plugin", "plugin.json"),
    JSON.stringify({ name: "dhp-next-shadcn", version: pluginVersion }, null, 2) + "\n",
    "utf8"
  );
  fs.writeFileSync(
    path.join(root, "plugins", "dhp-next-shadcn", "skills", "design-handoff-next-shadcn", "SKILL.md"),
    [
      "---",
      "name: design-handoff-next-shadcn",
      "---",
      "",
      "# design-handoff-next-shadcn",
      "",
      `> 当前版本：v${skillVersion}`,
      "> 版本真源：仓库根目录 `package.json`，并要求与 `plugins/dhp-next-shadcn/.codex-plugin/plugin.json` 保持一致。",
      ""
    ].join("\n"),
    "utf8"
  );

  return root;
}

test("传入目标版本时应该同时同步 package plugin skill", (t) => {
  const repoRoot = makeRepoFixture(t);

  const result = syncVersionFiles({ repoRoot, nextVersion: "0.3.0" });

  assert.equal(result.version, "0.3.0");
  assert.equal(JSON.parse(fs.readFileSync(path.join(repoRoot, "package.json"), "utf8")).version, "0.3.0");
  assert.equal(JSON.parse(fs.readFileSync(path.join(repoRoot, "plugins", "dhp-next-shadcn", ".codex-plugin", "plugin.json"), "utf8")).version, "0.3.0");
  assert.match(fs.readFileSync(path.join(repoRoot, "plugins", "dhp-next-shadcn", "skills", "design-handoff-next-shadcn", "SKILL.md"), "utf8"), /> 当前版本：v0\.3\.0/);
});

test("不传版本号时应该使用 package.json 当前版本修正 plugin 和 skill", (t) => {
  const repoRoot = makeRepoFixture(t, {
    packageVersion: "1.0.1",
    pluginVersion: "0.2.0",
    skillVersion: "0.2.0"
  });

  const result = syncVersionFiles({ repoRoot });

  assert.equal(result.version, "1.0.1");
  assert.equal(JSON.parse(fs.readFileSync(path.join(repoRoot, "plugins", "dhp-next-shadcn", ".codex-plugin", "plugin.json"), "utf8")).version, "1.0.1");
  assert.match(fs.readFileSync(path.join(repoRoot, "plugins", "dhp-next-shadcn", "skills", "design-handoff-next-shadcn", "SKILL.md"), "utf8"), /> 当前版本：v1\.0\.1/);
});

test("dry-run 不应该改动文件", (t) => {
  const repoRoot = makeRepoFixture(t);
  const packagePath = path.join(repoRoot, "package.json");
  const before = fs.readFileSync(packagePath, "utf8");

  const result = syncVersionFiles({ repoRoot, nextVersion: "0.4.0", dryRun: true });

  assert.equal(result.version, "0.4.0");
  assert.equal(fs.readFileSync(packagePath, "utf8"), before);
});

test("skill 缺少版本标识时应该显式报错", (t) => {
  const repoRoot = makeRepoFixture(t);
  const skillPath = path.join(repoRoot, "plugins", "dhp-next-shadcn", "skills", "design-handoff-next-shadcn", "SKILL.md");
  fs.writeFileSync(skillPath, "# missing marker\n", "utf8");

  assert.throws(() => syncVersionFiles({ repoRoot, nextVersion: "0.5.0" }), /SKILL\.md 缺少当前版本标识/);
});
