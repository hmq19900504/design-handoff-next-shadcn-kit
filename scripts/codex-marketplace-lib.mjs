import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { formatTimestamp, getDefaultMappings, getRepoRoot } from "./install-live-links-lib.mjs";

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function renderMarketplaceBlock({ marketplaceName, source }) {
  return [
    `[marketplaces.${marketplaceName}]`,
    'source_type = "local"',
    `source = "${source}"`,
    ""
  ].join("\n");
}

export function getDefaultToolingTargets({ repoRoot = getRepoRoot(import.meta.url), homeDir = os.homedir() } = {}) {
  return {
    skillLinks: getDefaultMappings({ repoRoot, homeDir }),
    marketplace: {
      name: "dhp-local-marketplace",
      source: repoRoot,
      configPath: path.join(homeDir, ".codex", "config.toml")
    }
  };
}

export function upsertMarketplaceConfig(content, { marketplaceName, source }) {
  const normalized = content.replace(/\r\n/g, "\n");
  const block = renderMarketplaceBlock({ marketplaceName, source });
  const sectionPattern = new RegExp(
    `^\\[marketplaces\\.${escapeRegExp(marketplaceName)}\\]\\n(?:^(?!\\[).*(?:\\n|$))*`,
    "m"
  );
  const existing = normalized.match(sectionPattern)?.[0];

  if (!existing) {
    const trimmed = normalized.trimEnd();
    return {
      status: "added",
      content: trimmed ? `${trimmed}\n\n${block}` : block
    };
  }

  if (existing.trimEnd() === block.trimEnd()) {
    return {
      status: "unchanged",
      content: normalized
    };
  }

  return {
    status: "updated",
    content: normalized.replace(sectionPattern, block)
  };
}

export function getMarketplaceRegistrationStatus({ configPath, marketplaceName, source }) {
  if (!fs.existsSync(configPath)) {
    return { status: "missing-config", configPath, source };
  }

  const content = fs.readFileSync(configPath, "utf8");
  const next = upsertMarketplaceConfig(content, { marketplaceName, source });

  return {
    status: next.status === "unchanged" ? "registered" : "missing",
    configPath,
    source
  };
}

export function ensureMarketplaceRegistration({ configPath, marketplaceName, source, dryRun = false, now = new Date() }) {
  const parentDir = path.dirname(configPath);
  const actions = [];
  if (!fs.existsSync(parentDir)) {
    actions.push({ type: "mkdir", path: parentDir });
    if (!dryRun) fs.mkdirSync(parentDir, { recursive: true });
  }

  const current = fs.existsSync(configPath) ? fs.readFileSync(configPath, "utf8") : "";
  const next = upsertMarketplaceConfig(current, { marketplaceName, source });

  if (next.status === "unchanged") {
    return {
      name: marketplaceName,
      destination: configPath,
      source,
      status: "already-registered",
      actions
    };
  }

  let backupPath = null;
  if (fs.existsSync(configPath)) {
    backupPath = `${configPath}.backup-${formatTimestamp(now)}`;
    actions.push({ type: "backup", path: configPath, backupPath });
    if (!dryRun) fs.copyFileSync(configPath, backupPath);
  }

  actions.push({ type: "write-config", path: configPath });
  if (!dryRun) fs.writeFileSync(configPath, next.content, "utf8");

  return {
    name: marketplaceName,
    destination: configPath,
    source,
    backupPath,
    status: next.status,
    actions
  };
}
