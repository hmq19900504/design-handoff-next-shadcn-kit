import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { ensureLiveLink } from "./install-live-links-lib.mjs";

function makeTempDir(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "dhp-live-link-"));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  return dir;
}

test("目标不存在时应该创建软链接", (t) => {
  const root = makeTempDir(t);
  const source = path.join(root, "source");
  const destination = path.join(root, "dest", "skill");

  fs.mkdirSync(source, { recursive: true });
  fs.writeFileSync(path.join(source, "SKILL.md"), "# test\n", "utf8");

  const result = ensureLiveLink({ source, destination });

  assert.equal(result.status, "linked");
  assert.equal(fs.lstatSync(destination).isSymbolicLink(), true);
  assert.equal(path.resolve(fs.readlinkSync(destination)), source);
});

test("目标已是正确软链接时应该保持不变", (t) => {
  const root = makeTempDir(t);
  const source = path.join(root, "source");
  const destination = path.join(root, "skill");

  fs.mkdirSync(source, { recursive: true });
  fs.symlinkSync(source, destination, "dir");

  const result = ensureLiveLink({ source, destination });

  assert.equal(result.status, "already-linked");
  assert.equal(result.backupPath, undefined);
});

test("目标是普通目录时应该先备份再重新链接", (t) => {
  const root = makeTempDir(t);
  const source = path.join(root, "source");
  const destination = path.join(root, "skill");

  fs.mkdirSync(source, { recursive: true });
  fs.mkdirSync(destination, { recursive: true });
  fs.writeFileSync(path.join(destination, "old.txt"), "old\n", "utf8");

  const result = ensureLiveLink({
    source,
    destination,
    now: new Date(2026, 3, 21, 12, 34, 56)
  });

  assert.equal(result.status, "relinked");
  assert.ok(result.backupPath?.endsWith(".backup-20260421-123456"));
  assert.equal(fs.existsSync(path.join(result.backupPath, "old.txt")), true);
  assert.equal(fs.lstatSync(destination).isSymbolicLink(), true);
  assert.equal(path.resolve(fs.readlinkSync(destination)), source);
});
