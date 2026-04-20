#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const target = path.resolve(process.argv[2] || "./handoff-new");
if (fs.existsSync(target)) {
  console.error(`目标目录已存在：${target}`);
  process.exit(1);
}
fs.mkdirSync(target, { recursive: true });
fs.cpSync(path.resolve("./handoff"), target, { recursive: true });
fs.rmSync(path.join(target, ".handoff"), { recursive: true, force: true });
console.log(`已创建新的 DHP 协议包：${target}`);
console.log("下一步：修改 handoff.json、pages/*.md、components/*.md，然后执行 npm run dhp:validate -- <目录>");
