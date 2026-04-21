import fs from "node:fs";
import path from "node:path";
import { getRepoRoot } from "./version-info-lib.mjs";

export function getDefaultSkillPackagePaths({ repoRoot = getRepoRoot(import.meta.url) } = {}) {
  return {
    sourceDir: path.join(repoRoot, "plugins", "dhp-next-shadcn", "skills", "design-handoff-next-shadcn"),
    outputDir: path.join(repoRoot, "dist", "skills", "design-handoff-next-shadcn")
  };
}

function buildManifest({ repoRoot, sourceDir, version, now = new Date() }) {
  return {
    name: "design-handoff-next-shadcn",
    version,
    compatibility: ["codex", "claude"],
    sourceDir: path.relative(repoRoot, sourceDir),
    packagedAt: now.toISOString()
  };
}

function readPackageVersion(repoRoot) {
  const packagePath = path.join(repoRoot, "package.json");
  const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
  return packageJson.version;
}

export function buildInstallableSkillPackage({ repoRoot = getRepoRoot(import.meta.url), dryRun = false, now = new Date() } = {}) {
  const { sourceDir, outputDir } = getDefaultSkillPackagePaths({ repoRoot });

  if (!fs.existsSync(sourceDir)) {
    throw new Error(`skill 源目录不存在：${sourceDir}`);
  }

  const manifest = buildManifest({
    repoRoot,
    sourceDir,
    version: readPackageVersion(repoRoot),
    now
  });

  if (dryRun) {
    return {
      status: "dry-run",
      sourceDir,
      outputDir,
      manifest
    };
  }

  fs.rmSync(outputDir, { recursive: true, force: true });
  fs.mkdirSync(path.dirname(outputDir), { recursive: true });
  fs.cpSync(sourceDir, outputDir, { recursive: true });
  fs.writeFileSync(path.join(outputDir, "skill.json"), JSON.stringify(manifest, null, 2) + "\n", "utf8");

  return {
    status: "packaged",
    sourceDir,
    outputDir,
    manifest
  };
}
