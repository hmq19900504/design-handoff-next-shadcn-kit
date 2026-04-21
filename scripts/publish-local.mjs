#!/usr/bin/env node
import { runNpmScript, runPublishLocal } from "./publish-local-lib.mjs";

const withCodexMarketplace = process.argv.includes("--with-codex-marketplace");

await runPublishLocal({
  withCodexMarketplace,
  runStep: async (step) => {
    console.log(`\n> ${step.label}`);
    runNpmScript(step);
  }
});

console.log("\nLocal skill publish completed.");
