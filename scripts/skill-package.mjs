#!/usr/bin/env node
import { buildInstallableSkillPackage } from "./skill-package-lib.mjs";
import { formatVersionLabel, getVersionInfo } from "./version-info-lib.mjs";

const dryRun = process.argv.includes("--dry-run");
const versionInfo = getVersionInfo();
const result = buildInstallableSkillPackage({ dryRun });

console.log(dryRun ? "DHP skill package dry-run" : "DHP skill packaged");
console.log(`version: ${formatVersionLabel(versionInfo)}`);
console.log(`- status: ${result.status}`);
console.log(`- source: ${result.sourceDir}`);
console.log(`- output: ${result.outputDir}`);
console.log(`- compatibility: ${result.manifest.compatibility.join(", ")}`);
if (dryRun) {
  console.log("dry-run completed; no filesystem changes were applied.");
}
