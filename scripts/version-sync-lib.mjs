import fs from "node:fs";
import path from "node:path";
import { getRepoRoot } from "./version-info-lib.mjs";

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeJson(file, data, dryRun) {
  const content = JSON.stringify(data, null, 2) + "\n";
  if (!dryRun) fs.writeFileSync(file, content, "utf8");
  return content;
}

export function normalizeVersion(version) {
  if (!version) return version;
  const normalized = version.trim().replace(/^v/, "");
  if (!/^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/.test(normalized)) {
    throw new Error(`非法版本号：${version}`);
  }
  return normalized;
}

export function replaceSkillVersionMarker(skillMarkdown, version) {
  const markerPattern = /^> 当前版本：v(.+)$/m;
  if (!markerPattern.test(skillMarkdown)) {
    throw new Error("SKILL.md 缺少当前版本标识");
  }
  return skillMarkdown.replace(markerPattern, `> 当前版本：v${version}`);
}

export function syncVersionFiles({ repoRoot = getRepoRoot(import.meta.url), nextVersion, dryRun = false } = {}) {
  const packagePath = path.join(repoRoot, "package.json");
  const pluginPath = path.join(repoRoot, "plugins", "dhp-next-shadcn", ".codex-plugin", "plugin.json");
  const skillPath = path.join(repoRoot, "plugins", "dhp-next-shadcn", "skills", "design-handoff-next-shadcn", "SKILL.md");

  const packageJson = readJson(packagePath);
  const pluginJson = readJson(pluginPath);
  const skillMarkdown = fs.readFileSync(skillPath, "utf8");

  const version = normalizeVersion(nextVersion || packageJson.version);

  packageJson.version = version;
  pluginJson.version = version;
  const nextSkillMarkdown = replaceSkillVersionMarker(skillMarkdown, version);

  writeJson(packagePath, packageJson, dryRun);
  writeJson(pluginPath, pluginJson, dryRun);
  if (!dryRun) fs.writeFileSync(skillPath, nextSkillMarkdown, "utf8");

  return {
    version,
    dryRun,
    paths: {
      packagePath,
      pluginPath,
      skillPath
    }
  };
}
