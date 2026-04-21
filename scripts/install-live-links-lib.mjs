import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

export function getRepoRoot(importMetaUrl = import.meta.url) {
  return path.resolve(path.dirname(fileURLToPath(importMetaUrl)), "..");
}

export function getDefaultMappings({ repoRoot = getRepoRoot(import.meta.url), homeDir = os.homedir() } = {}) {
  const skillSource = path.join(repoRoot, "plugins", "dhp-next-shadcn", "skills", "design-handoff-next-shadcn");
  return [
    {
      name: "codex-skill",
      source: skillSource,
      destination: path.join(homeDir, ".codex", "skills", "design-handoff-next-shadcn")
    },
    {
      name: "claude-skill",
      source: skillSource,
      destination: path.join(homeDir, ".agents", "skills", "design-handoff-next-shadcn")
    }
  ];
}

export function formatTimestamp(now = new Date()) {
  const pad = (value) => String(value).padStart(2, "0");
  return [
    now.getFullYear(),
    pad(now.getMonth() + 1),
    pad(now.getDate()),
    "-",
    pad(now.getHours()),
    pad(now.getMinutes()),
    pad(now.getSeconds())
  ].join("");
}

function sameLink(destination, source) {
  const stat = fs.lstatSync(destination);
  if (!stat.isSymbolicLink()) return false;
  const linkedTarget = fs.readlinkSync(destination);
  const resolvedTarget = path.resolve(path.dirname(destination), linkedTarget);
  return path.resolve(resolvedTarget) === path.resolve(source);
}

export function ensureLiveLink({ source, destination, dryRun = false, now = new Date() }) {
  const sourcePath = path.resolve(source);
  const destinationPath = path.resolve(destination);

  if (!fs.existsSync(sourcePath)) {
    throw new Error(`源路径不存在：${sourcePath}`);
  }

  const actions = [];
  const sourceStat = fs.lstatSync(sourcePath);
  const parentDir = path.dirname(destinationPath);

  if (!fs.existsSync(parentDir)) {
    actions.push({ type: "mkdir", path: parentDir });
    if (!dryRun) fs.mkdirSync(parentDir, { recursive: true });
  }

  let destinationStat = null;
  try {
    destinationStat = fs.lstatSync(destinationPath);
  } catch {
    destinationStat = null;
  }

  if (destinationStat && sameLink(destinationPath, sourcePath)) {
    return {
      name: path.basename(destinationPath),
      source: sourcePath,
      destination: destinationPath,
      status: "already-linked",
      actions
    };
  }

  let backupPath = null;
  if (destinationStat) {
    backupPath = `${destinationPath}.backup-${formatTimestamp(now)}`;
    actions.push({ type: "backup", path: destinationPath, backupPath });
    if (!dryRun) fs.renameSync(destinationPath, backupPath);
  }

  actions.push({ type: "link", source: sourcePath, destination: destinationPath });
  if (!dryRun) {
    fs.symlinkSync(sourcePath, destinationPath, sourceStat.isDirectory() ? "dir" : "file");
  }

  return {
    name: path.basename(destinationPath),
    source: sourcePath,
    destination: destinationPath,
    backupPath,
    status: backupPath ? "relinked" : "linked",
    actions
  };
}
