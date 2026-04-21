#!/usr/bin/env node
import { ensureLiveLink } from "./install-live-links-lib.mjs";
import { ensureMarketplaceRegistration, getDefaultToolingTargets, getMarketplaceRegistrationStatus } from "./codex-marketplace-lib.mjs";
import { buildInstallableSkillPackage } from "./skill-package-lib.mjs";
import { formatVersionLabel, getVersionInfo } from "./version-info-lib.mjs";

const dryRun = process.argv.includes("--dry-run");
const showStatus = process.argv.includes("--status");
const withCodexMarketplace = process.argv.includes("--with-codex-marketplace");
const versionInfo = getVersionInfo();
const targets = getDefaultToolingTargets({ includeMarketplace: withCodexMarketplace });

function printHeader(title) {
  console.log(title);
  console.log(`version: ${formatVersionLabel(versionInfo)}`);
}

if (showStatus) {
  printHeader("DHP tooling status");
  const packageResult = buildInstallableSkillPackage({ dryRun: true });
  console.log(`- skill-package: ${packageResult.status}`);
  console.log(`  source: ${packageResult.sourceDir}`);
  console.log(`  destination: ${packageResult.outputDir}`);

  for (const target of targets.skillLinks) {
    const result = ensureLiveLink({
      source: target.source,
      destination: target.destination,
      dryRun: true
    });
    console.log(`- ${target.name}: ${result.status}`);
    console.log(`  source: ${result.source}`);
    console.log(`  destination: ${result.destination}`);
  }

  if (targets.marketplace) {
    const marketplaceStatus = getMarketplaceRegistrationStatus({
      configPath: targets.marketplace.configPath,
      marketplaceName: targets.marketplace.name,
      source: targets.marketplace.source
    });
    console.log(`- codex-marketplace: ${marketplaceStatus.status}`);
    console.log(`  source: ${marketplaceStatus.source}`);
    console.log(`  destination: ${marketplaceStatus.configPath}`);
  } else {
    console.log("- codex-marketplace: disabled");
    console.log("  source: optional; rerun with --with-codex-marketplace to manage Codex plugin registration.");
  }
  process.exit(0);
}

printHeader(dryRun ? "DHP tooling dry-run" : "DHP tooling install");

const packageResult = buildInstallableSkillPackage({ dryRun });
console.log(`- skill-package: ${packageResult.status}`);
console.log(`  source: ${packageResult.sourceDir}`);
console.log(`  destination: ${packageResult.outputDir}`);

for (const target of targets.skillLinks) {
  const result = ensureLiveLink({
    source: target.source,
    destination: target.destination,
    dryRun
  });
  console.log(`- ${target.name}: ${result.status}`);
  console.log(`  source: ${result.source}`);
  console.log(`  destination: ${result.destination}`);
  if (result.backupPath) {
    console.log(`  backup: ${result.backupPath}`);
  }
}

if (targets.marketplace) {
  const marketplaceResult = ensureMarketplaceRegistration({
    configPath: targets.marketplace.configPath,
    marketplaceName: targets.marketplace.name,
    source: targets.marketplace.source,
    dryRun
  });
  console.log(`- codex-marketplace: ${marketplaceResult.status}`);
  console.log(`  source: ${marketplaceResult.source}`);
  console.log(`  destination: ${marketplaceResult.destination}`);
  if (marketplaceResult.backupPath) {
    console.log(`  backup: ${marketplaceResult.backupPath}`);
  }
} else {
  console.log("- codex-marketplace: skipped");
  console.log("  source: optional; rerun with --with-codex-marketplace to register the local Codex marketplace.");
}

if (dryRun) {
  console.log("dry-run completed; no filesystem changes were applied.");
} else {
  console.log("tooling ready. New Codex/Claude sessions will share the same packaged skill version.");
}
