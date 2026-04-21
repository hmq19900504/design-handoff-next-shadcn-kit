#!/usr/bin/env node
import path from "node:path";
import { writeJson } from "./lib.mjs";
import { buildBundleData, BUNDLE_RELATIVE_PATH } from "./dhp-build-lib.mjs";

const root = path.resolve(process.argv[2] || "./handoff");
const bundle = buildBundleData({ root });
const out = path.join(root, BUNDLE_RELATIVE_PATH);
writeJson(out, bundle);
console.log(`DHP bundle built: ${path.relative(process.cwd(), out)}`);
