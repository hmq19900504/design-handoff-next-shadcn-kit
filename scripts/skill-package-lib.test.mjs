import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { buildInstallableSkillPackage, getDefaultSkillPackagePaths } from "./skill-package-lib.mjs";

function makeTempRepo(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "dhp-skill-pack-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));

  const sourceDir = path.join(root, "plugins", "dhp-next-shadcn", "skills", "design-handoff-next-shadcn");
  fs.mkdirSync(path.join(sourceDir, "references"), { recursive: true });
  fs.writeFileSync(path.join(sourceDir, "SKILL.md"), "# demo skill\n", "utf8");
  fs.writeFileSync(path.join(sourceDir, "references", "protocol.md"), "protocol\n", "utf8");
  fs.writeFileSync(
    path.join(root, "package.json"),
    JSON.stringify({ version: "0.2.0" }, null, 2) + "\n",
    "utf8"
  );

  return root;
}

test("默认技能打包路径应该输出到 dist/skills", () => {
  const paths = getDefaultSkillPackagePaths({ repoRoot: "/repo/design-handoff-kit" });

  assert.equal(paths.sourceDir, "/repo/design-handoff-kit/plugins/dhp-next-shadcn/skills/design-handoff-next-shadcn");
  assert.equal(paths.outputDir, "/repo/design-handoff-kit/dist/skills/design-handoff-next-shadcn");
});

test("打包 installable skill 时应该复制 skill 并写入元数据", (t) => {
  const repoRoot = makeTempRepo(t);
  const result = buildInstallableSkillPackage({ repoRoot });

  assert.equal(result.status, "packaged");
  assert.equal(fs.existsSync(path.join(result.outputDir, "SKILL.md")), true);
  assert.equal(fs.readFileSync(path.join(result.outputDir, "SKILL.md"), "utf8"), "# demo skill\n");
  assert.equal(fs.readFileSync(path.join(result.outputDir, "references", "protocol.md"), "utf8"), "protocol\n");

  const manifest = JSON.parse(fs.readFileSync(path.join(result.outputDir, "skill.json"), "utf8"));
  assert.equal(manifest.name, "design-handoff-next-shadcn");
  assert.equal(manifest.version, "0.2.0");
  assert.deepEqual(manifest.compatibility, ["codex", "claude"]);
});

test("dry-run 打包不应写入文件系统", (t) => {
  const repoRoot = makeTempRepo(t);
  const result = buildInstallableSkillPackage({ repoRoot, dryRun: true });

  assert.equal(result.status, "dry-run");
  assert.equal(fs.existsSync(result.outputDir), false);
});
