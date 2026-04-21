import test from "node:test";
import assert from "node:assert/strict";
import { getPublishLocalSteps, runPublishLocal } from "./publish-local-lib.mjs";

test("默认本地发布链路应该先验证再安装通用 skill", () => {
  const steps = getPublishLocalSteps();

  assert.deepEqual(
    steps.map((step) => step.script),
    [
      "test:design-handoff-skill",
      "test:skill-package",
      "test:tooling",
      "skill:pack",
      "tool:install"
    ]
  );
});

test("显式启用 codex marketplace 时应该切到 codex 安装入口", () => {
  const steps = getPublishLocalSteps({ withCodexMarketplace: true });

  assert.deepEqual(
    steps.map((step) => step.script),
    [
      "test:design-handoff-skill",
      "test:skill-package",
      "test:tooling",
      "skill:pack",
      "tool:install:codex"
    ]
  );
});

test("执行本地发布时应该按顺序运行所有步骤", async () => {
  const called = [];

  await runPublishLocal({
    runStep: async (step) => {
      called.push(step.script);
    }
  });

  assert.deepEqual(called, [
    "test:design-handoff-skill",
    "test:skill-package",
    "test:tooling",
    "skill:pack",
    "tool:install"
  ]);
});
