#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { readJson, writeJson, readMarkdownWithBlocks, flattenTokens } from "./lib.mjs";

const root = path.resolve(process.argv[2] || "./handoff");
const handoff = readJson(path.join(root, "handoff.json"));
const tokens = readJson(path.join(root, handoff.tokens));
const componentMap = readJson(path.join(root, handoff.componentMap));
const apiContract = handoff.apiContract ? readJson(path.join(root, handoff.apiContract)) : null;

const pages = (handoff.pages || []).map(rel => readMarkdownWithBlocks(root, rel));
const components = (handoff.components || []).map(rel => readMarkdownWithBlocks(root, rel));
const flows = (handoff.flows || []).map(rel => readMarkdownWithBlocks(root, rel));
const acceptance = handoff.acceptance ? fs.readFileSync(path.join(root, handoff.acceptance), "utf8") : "";
const assumptionsPath = path.join(root, "assumptions.md");
const assumptions = fs.existsSync(assumptionsPath) ? fs.readFileSync(assumptionsPath, "utf8") : "";

const bundle = {
  bundleVersion: "0.2.0",
  builtAt: new Date().toISOString(),
  source: {
    handoff: "handoff.json",
    tokens: handoff.tokens,
    componentMap: handoff.componentMap,
    apiContract: handoff.apiContract || null
  },
  dhpVersion: handoff.dhpVersion,
  module: handoff.module,
  language: handoff.language || "zh-CN",
  targetStack: handoff.targetStack,
  tokens,
  tokenList: flattenTokens(tokens),
  componentMap,
  apiContract,
  pages,
  components,
  flows,
  acceptance,
  assumptions
};

const out = path.join(root, ".handoff", "build", "handoff.bundle.json");
writeJson(out, bundle);
console.log(`DHP bundle built: ${path.relative(process.cwd(), out)}`);
