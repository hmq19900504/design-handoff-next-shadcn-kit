#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import fs from "node:fs";

function run(label, command, args) {
  console.log(`\n> ${label}`);
  const res = spawnSync(command, args, { stdio: "inherit", shell: false });
  if (res.status !== 0) process.exit(res.status ?? 1);
}

run("validate handoff", "node", ["scripts/dhp-validate.mjs", "./handoff"]);
run("build bundle", "node", ["scripts/dhp-build.mjs", "./handoff"]);
run("sync web generated files", "node", ["scripts/sync-web.mjs", "./handoff", "./apps/web/src/generated"]);

const required = [
  "handoff/.handoff/build/handoff.bundle.json",
  "apps/web/src/generated/handoff.bundle.json",
  "apps/web/src/generated/dhp-tokens.css",
  "plugins/dhp-next-shadcn/.codex-plugin/plugin.json",
  "plugins/dhp-next-shadcn/skills/design-handoff-next-shadcn/SKILL.md"
];
for (const f of required) {
  if (!fs.existsSync(f)) throw new Error(`verify failed, missing ${f}`);
}
console.log("\nOffline verification passed.");
