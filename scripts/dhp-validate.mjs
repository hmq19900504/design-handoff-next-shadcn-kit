#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { ensureFile, extractDhpBlocks, flattenTokens, readJson } from "./lib.mjs";

const root = path.resolve(process.argv[2] || "./handoff");
const handoffPath = path.join(root, "handoff.json");
ensureFile(handoffPath, "handoff.json");
const handoff = readJson(handoffPath);

const required = ["dhpVersion", "module", "targetStack", "tokens", "componentMap", "pages"];
for (const key of required) {
  if (!(key in handoff)) throw new Error(`handoff.json 缺少字段：${key}`);
}

ensureFile(path.join(root, handoff.tokens), handoff.tokens);
ensureFile(path.join(root, handoff.componentMap), handoff.componentMap);
if (handoff.apiContract) ensureFile(path.join(root, handoff.apiContract), handoff.apiContract);

const tokens = readJson(path.join(root, handoff.tokens));
const flatTokens = flattenTokens(tokens).filter(t => !t.name.startsWith("meta."));
if (flatTokens.length < 8) throw new Error("tokens 数量过少：至少需要 8 个设计 token");
for (const t of flatTokens) {
  if (t.value === undefined || t.value === null || t.value === "") throw new Error(`token 为空：${t.name}`);
}

const componentMap = readJson(path.join(root, handoff.componentMap));
if (!componentMap.uiLibrary) throw new Error("component-map 缺少 uiLibrary");
if (!componentMap.components || Object.keys(componentMap.components).length === 0) throw new Error("component-map 缺少 components");

for (const rel of handoff.pages || []) {
  const file = path.join(root, rel);
  ensureFile(file, rel);
  const md = fs.readFileSync(file, "utf8");
  const blocks = extractDhpBlocks(md);
  if (!blocks.some(b => b.type === "dhp-layout")) throw new Error(`${rel} 缺少 dhp-layout`);
  if (!blocks.some(b => b.type === "dhp-state-matrix")) throw new Error(`${rel} 缺少 dhp-state-matrix`);
}

for (const rel of handoff.components || []) {
  const file = path.join(root, rel);
  ensureFile(file, rel);
  const md = fs.readFileSync(file, "utf8");
  const blocks = extractDhpBlocks(md);
  if (!blocks.some(b => b.type === "dhp-component")) throw new Error(`${rel} 缺少 dhp-component`);
}

console.log(`DHP validate passed: ${path.relative(process.cwd(), root)}`);
console.log(`- module: ${handoff.module}`);
console.log(`- pages: ${(handoff.pages || []).length}`);
console.log(`- components: ${(handoff.components || []).length}`);
console.log(`- tokens: ${flatTokens.length}`);
