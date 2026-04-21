import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const skillPath = path.join(repoRoot, "plugins", "dhp-next-shadcn", "skills", "design-handoff-next-shadcn", "SKILL.md");
const pluginPath = path.join(repoRoot, "plugins", "dhp-next-shadcn", ".codex-plugin", "plugin.json");
const usageDocPath = path.join(repoRoot, "docs", "Skill使用说明.md");
const readmePath = path.join(repoRoot, "README.md");
const installDocPath = path.join(repoRoot, "docs", "安装说明.md");
const e2eReferencePath = path.join(
  repoRoot,
  "plugins",
  "dhp-next-shadcn",
  "skills",
  "design-handoff-next-shadcn",
  "references",
  "e2e-delivery-loop.md"
);

function readUtf8(file) {
  return fs.readFileSync(file, "utf8");
}

test("design-handoff skill 应该声明产品到后端的一体化研发链路", () => {
  const skill = readUtf8(skillPath);

  assert.match(skill, /产品边界/);
  assert.match(skill, /对象模型/);
  assert.match(skill, /页面职责/);
  assert.match(skill, /交互流程/);
  assert.match(skill, /前端/);
  assert.match(skill, /后端/);
  assert.match(skill, /V1 \/ V2/);
  assert.match(skill, /验收标准/);
});

test("design-handoff skill 应该引用 e2e 前置规则参考文件", () => {
  const skill = readUtf8(skillPath);

  assert.equal(fs.existsSync(e2eReferencePath), true);
  assert.match(skill, /references\/e2e-delivery-loop\.md/);
  assert.match(skill, /先判断当前层级/);
});

test("plugin 元数据应该体现全链路研发能力", () => {
  const plugin = JSON.parse(readUtf8(pluginPath));
  const promptText = plugin.interface.defaultPrompt.join("\n");

  assert.match(plugin.description, /产品|full-stack|frontend|backend/i);
  assert.match(plugin.interface.shortDescription, /产品|研发|全链路/);
  assert.match(plugin.interface.longDescription, /产品边界/);
  assert.match(plugin.interface.longDescription, /对象模型/);
  assert.match(promptText, /产品边界/);
  assert.match(promptText, /后端/);
});

test("skill 使用说明应该说明先补前置规格再落地代码", () => {
  const usageDoc = readUtf8(usageDocPath);

  assert.match(usageDoc, /产品边界/);
  assert.match(usageDoc, /对象模型/);
  assert.match(usageDoc, /Mermaid/);
  assert.match(usageDoc, /前端/);
  assert.match(usageDoc, /后端/);
});

test("README 和安装说明的示例提示词应该使用单 skill 全链路口径", () => {
  const readme = readUtf8(readmePath);
  const installDoc = readUtf8(installDocPath);

  assert.match(readme, /产品边界/);
  assert.match(readme, /对象模型/);
  assert.match(readme, /后端/);
  assert.match(readme, /skill:publish-local/);
  assert.doesNotMatch(readme, /读取 \.\/handoff\/handoff\.json，构建 bundle，并按协议生成或修改 Next\.js\/shadcn 页面/);

  assert.match(installDoc, /产品边界/);
  assert.match(installDoc, /对象模型/);
  assert.match(installDoc, /后端/);
  assert.match(installDoc, /skill:publish-local/);
  assert.doesNotMatch(installDoc, /读取 \.\/handoff\/handoff\.json，按协议生成或修复 Next\.js\/shadcn 页面/);
});
