import fs from "node:fs";
import path from "node:path";

export function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

export function writeJson(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n", "utf8");
}

export function ensureFile(file, label = file) {
  if (!fs.existsSync(file)) throw new Error(`缺少文件：${label} (${file})`);
}

export function extractDhpBlocks(markdown) {
  const blocks = [];
  const re = /```(dhp-[a-zA-Z0-9-]+)\s*\n([\s\S]*?)```/g;
  let m;
  while ((m = re.exec(markdown))) {
    const type = m[1];
    const raw = m[2].trim();
    let json;
    try {
      json = JSON.parse(raw);
    } catch (err) {
      throw new Error(`协议块 ${type} 不是合法 JSON：${err.message}`);
    }
    blocks.push({ type, json });
  }
  return blocks;
}

export function readMarkdownWithBlocks(root, rel) {
  const file = path.join(root, rel);
  ensureFile(file, rel);
  const markdown = fs.readFileSync(file, "utf8");
  const title = (markdown.match(/^#\s+(.+)$/m) || [null, path.basename(rel)])[1];
  return { path: rel, title, markdown, blocks: extractDhpBlocks(markdown) };
}

export function flattenTokens(tokens) {
  const out = [];
  function walk(obj, prefix = []) {
    for (const [key, value] of Object.entries(obj || {})) {
      if (value && typeof value === "object" && "$value" in value) {
        out.push({ name: prefix.concat(key).join("."), value: value.$value, type: value.$type || "unknown" });
      } else if (value && typeof value === "object") {
        walk(value, prefix.concat(key));
      }
    }
  }
  walk(tokens);
  return out;
}

export function tokenNameToCssVar(name) {
  return `--dhp-${name.replace(/\./g, "-").replace(/[^a-zA-Z0-9-]/g, "-")}`;
}
