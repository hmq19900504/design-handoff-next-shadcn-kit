import { spawnSync } from "node:child_process";

export function getPublishLocalSteps({ withCodexMarketplace = false } = {}) {
  return [
    { script: "test:design-handoff-skill", label: "validate design-handoff skill contract" },
    { script: "test:skill-package", label: "validate skill packaging" },
    { script: "test:tooling", label: "validate tooling installation chain" },
    { script: "skill:pack", label: "package installable skill" },
    {
      script: withCodexMarketplace ? "tool:install:codex" : "tool:install",
      label: withCodexMarketplace ? "install skills and codex marketplace" : "install skills"
    }
  ];
}

export async function runPublishLocal({ withCodexMarketplace = false, runStep } = {}) {
  const steps = getPublishLocalSteps({ withCodexMarketplace });

  for (const step of steps) {
    await runStep(step);
  }

  return steps;
}

export function runNpmScript(step) {
  const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
  const result = spawnSync(npmCommand, ["run", step.script], {
    stdio: "inherit",
    shell: false
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
