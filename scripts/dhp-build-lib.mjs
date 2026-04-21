import fs from "node:fs";
import path from "node:path";
import { readJson, readMarkdownWithBlocks, flattenTokens } from "./lib.mjs";

export const BUNDLE_VERSION = "0.2.0";
export const BUNDLE_RELATIVE_PATH = path.join(".handoff", "build", "handoff.bundle.json");

function buildBundleBody(root) {
  const handoff = readJson(path.join(root, "handoff.json"));
  const tokens = readJson(path.join(root, handoff.tokens));
  const componentMap = readJson(path.join(root, handoff.componentMap));
  const apiContract = handoff.apiContract ? readJson(path.join(root, handoff.apiContract)) : null;

  const pages = (handoff.pages || []).map((rel) => readMarkdownWithBlocks(root, rel));
  const components = (handoff.components || []).map((rel) => readMarkdownWithBlocks(root, rel));
  const flows = (handoff.flows || []).map((rel) => readMarkdownWithBlocks(root, rel));
  const acceptance = handoff.acceptance ? fs.readFileSync(path.join(root, handoff.acceptance), "utf8") : "";
  const assumptionsPath = path.join(root, "assumptions.md");
  const assumptions = fs.existsSync(assumptionsPath) ? fs.readFileSync(assumptionsPath, "utf8") : "";

  return {
    bundleVersion: BUNDLE_VERSION,
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
}

function readPreviousBundle(out) {
  if (!fs.existsSync(out)) return null;

  try {
    return JSON.parse(fs.readFileSync(out, "utf8"));
  } catch {
    return null;
  }
}

function stripBuiltAt(bundle) {
  if (!bundle || typeof bundle !== "object") return null;
  const { builtAt, ...rest } = bundle;
  return rest;
}

export function buildBundleData({ root, now = new Date() }) {
  const out = path.join(root, BUNDLE_RELATIVE_PATH);
  const body = buildBundleBody(root);
  const previousBundle = readPreviousBundle(out);
  const previousBody = stripBuiltAt(previousBundle);
  const builtAt = JSON.stringify(previousBody) === JSON.stringify(body)
    ? previousBundle?.builtAt || now.toISOString()
    : now.toISOString();
  const { bundleVersion, source, ...rest } = body;

  return {
    bundleVersion,
    builtAt,
    source,
    ...rest
  };
}
