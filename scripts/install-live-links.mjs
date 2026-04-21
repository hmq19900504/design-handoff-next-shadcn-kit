#!/usr/bin/env node
import { ensureLiveLink, getDefaultMappings } from "./install-live-links-lib.mjs";
import { buildInstallableSkillPackage } from "./skill-package-lib.mjs";
import { formatVersionLabel, getVersionInfo } from "./version-info-lib.mjs";

const dryRun = process.argv.includes("--dry-run");
const mappings = getDefaultMappings();
const versionInfo = getVersionInfo();

console.log(dryRun ? "DHP live link dry-run" : "DHP live link install");
console.log(`version: ${formatVersionLabel(versionInfo)}`);

const packageResult = buildInstallableSkillPackage({ dryRun });
console.log(`- skill-package: ${packageResult.status}`);
console.log(`  source: ${packageResult.sourceDir}`);
console.log(`  destination: ${packageResult.outputDir}`);

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
  console.log("installable skill ready. New Codex/Claude sessions will read the packaged skill version.");
  console.log("如果你还需要 Codex plugin/marketplace，再使用 npm run tool:install:codex。");
}
