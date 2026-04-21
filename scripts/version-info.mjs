#!/usr/bin/env node
import { formatVersionLabel, getVersionInfo } from "./version-info-lib.mjs";

const info = getVersionInfo();

if (info.packageVersion !== info.pluginVersion) {
  console.error("版本不一致：package.json 与 plugin.json 不匹配");
  console.error(`- package.json: ${info.packageVersion}`);
  console.error(`- plugin.json: ${info.pluginVersion}`);
  process.exit(1);
}

console.log(formatVersionLabel(info));
console.log(`- package: ${info.packageName}@${info.packageVersion}`);
console.log(`- plugin: ${info.pluginName}@${info.pluginVersion}`);
console.log(`- skill: ${info.skillPath}`);
