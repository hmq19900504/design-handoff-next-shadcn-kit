#!/usr/bin/env node
import { syncVersionFiles } from "./version-sync-lib.mjs";
import { formatVersionLabel, getVersionInfo } from "./version-info-lib.mjs";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const positionalArgs = args.filter((arg) => arg !== "--dry-run");
const nextVersion = positionalArgs[0];

const result = syncVersionFiles({ nextVersion, dryRun });
const info = { ...getVersionInfo(), packageVersion: result.version };

console.log(dryRun ? "version sync dry-run" : "version sync completed");
console.log(`version: ${formatVersionLabel(info)}`);
console.log(`- package: ${result.paths.packagePath}`);
console.log(`- plugin: ${result.paths.pluginPath}`);
console.log(`- skill: ${result.paths.skillPath}`);
