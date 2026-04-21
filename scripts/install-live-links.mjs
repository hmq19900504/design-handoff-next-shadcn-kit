#!/usr/bin/env node
import { ensureLiveLink, getDefaultMappings } from "./install-live-links-lib.mjs";
import { formatVersionLabel, getVersionInfo } from "./version-info-lib.mjs";

const dryRun = process.argv.includes("--dry-run");
const mappings = getDefaultMappings();
const versionInfo = getVersionInfo();

console.log(dryRun ? "DHP live link dry-run" : "DHP live link install");
console.log(`version: ${formatVersionLabel(versionInfo)}`);

for (const mapping of mappings) {
  const result = ensureLiveLink({
    source: mapping.source,
    destination: mapping.destination,
    dryRun
  });

  console.log(`- ${mapping.name}: ${result.status}`);
  console.log(`  source: ${result.source}`);
  console.log(`  destination: ${result.destination}`);
  if (result.backupPath) {
    console.log(`  backup: ${result.backupPath}`);
  }
}

if (dryRun) {
  console.log("dry-run completed; no filesystem changes were applied.");
} else {
  console.log("live links ready. New Codex/Claude sessions will read the repo latest version directly.");
  console.log("如果你还需要统一 Codex marketplace，请改用 npm run tool:install。");
}
