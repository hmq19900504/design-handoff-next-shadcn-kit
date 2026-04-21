import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export function getRepoRoot(importMetaUrl = import.meta.url) {
  return path.resolve(path.dirname(fileURLToPath(importMetaUrl)), "..");
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

export function getVersionInfo({ repoRoot = getRepoRoot(import.meta.url) } = {}) {
  const packagePath = path.join(repoRoot, "package.json");
  const pluginPath = path.join(repoRoot, "plugins", "dhp-next-shadcn", ".codex-plugin", "plugin.json");
  const skillPath = path.join(repoRoot, "plugins", "dhp-next-shadcn", "skills", "design-handoff-next-shadcn", "SKILL.md");

  const packageJson = readJson(packagePath);
  const pluginJson = readJson(pluginPath);
  const skillMarkdown = fs.readFileSync(skillPath, "utf8");
  const skillName = (skillMarkdown.match(/^name:\s*(.+)$/m) || [null, pluginJson.name])[1];

  return {
    repoRoot,
    packagePath,
    pluginPath,
    skillPath,
    packageName: packageJson.name,
    packageVersion: packageJson.version,
    pluginName: pluginJson.name,
    pluginVersion: pluginJson.version,
    skillName
  };
}

export function formatVersionLabel(info) {
  return `${info.skillName} v${info.packageVersion}`;
}
