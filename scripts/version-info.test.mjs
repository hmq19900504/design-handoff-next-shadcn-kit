import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { getVersionInfo, formatVersionLabel } from "./version-info-lib.mjs";

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");

test("package 与 plugin 版本应该保持一致", () => {
  const info = getVersionInfo({ repoRoot });
  assert.equal(info.packageVersion, info.pluginVersion);
});

test("skill 必须包含当前版本标识", () => {
  const info = getVersionInfo({ repoRoot });
  const skillMarkdown = fs.readFileSync(info.skillPath, "utf8");
  assert.match(skillMarkdown, new RegExp(`当前版本：v${info.packageVersion.replaceAll(".", "\\.")}`));
});

test("版本标签应该包含 skill 名称和版本号", () => {
  const info = getVersionInfo({ repoRoot });
  assert.equal(formatVersionLabel(info), `design-handoff-next-shadcn v${info.packageVersion}`);
});
