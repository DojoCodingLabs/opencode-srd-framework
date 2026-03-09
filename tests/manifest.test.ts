import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import os from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { getInstallableAssets, syncManagedAssets } from "../src/lib/copy-assets.js";
import { readInstallManifest, writeInstallManifest } from "../src/lib/manifest.js";
import { defaultConfigDir, resolveConfigDir, resolvePackageRoot } from "../src/lib/paths.js";

const tempRoots: string[] = [];

async function makeTempDir(prefix: string): Promise<string> {
  const root = await mkdtemp(join(os.tmpdir(), prefix));
  tempRoots.push(root);
  return root;
}

afterEach(async () => {
  const { rm } = await import("node:fs/promises");
  await Promise.all(tempRoots.splice(0).map((path) => rm(path, { recursive: true, force: true })));
});

describe("manifest and asset sync", () => {
  it("tracks only installable managed files", async () => {
    const packageRoot = resolvePackageRoot(import.meta.url);
    const assets = await getInstallableAssets(packageRoot);
    expect(assets.every((asset) => /^(commands|agents|skills)\//.test(asset.relativePath))).toBe(true);
    expect(assets.some((asset) => asset.relativePath === "commands/srd-assess.md")).toBe(true);
    expect(assets.some((asset) => asset.relativePath === "agents/srd-guardian.md")).toBe(true);
    expect(assets.some((asset) => asset.relativePath === "skills/srd-analysis/SKILL.md")).toBe(true);
  });

  it("detects unmanaged conflicts", async () => {
    const packageRoot = resolvePackageRoot(import.meta.url);
    const configDir = await makeTempDir("opencode-srd-conflict-");
    await mkdir(join(configDir, "commands"), { recursive: true });
    await writeFile(join(configDir, "commands", "srd-assess.md"), "user-owned", "utf8");

    const result = await syncManagedAssets({
      configDir,
      packageRoot,
    });

    expect(result.conflicts).toContain("commands/srd-assess.md");
  });

  it("resolves default and custom config directories", () => {
    expect(defaultConfigDir("/Users/example")).toBe("/Users/example/.config/opencode");
    expect(resolveConfigDir("./custom-config")).toContain("custom-config");
  });

  it("reads and writes install manifests", async () => {
    const configDir = await makeTempDir("opencode-srd-manifest-");
    await writeInstallManifest(configDir, {
      packageName: "pkg",
      installedVersion: "0.1.0",
      installedAt: new Date().toISOString(),
      configDir,
      managedFiles: [
        {
          relativePath: "commands/srd-assess.md",
          checksum: "abc",
          kind: "command",
        },
      ],
    });

    const manifest = await readInstallManifest(configDir);
    expect(manifest?.managedFiles).toHaveLength(1);
    expect(manifest?.managedFiles[0]?.relativePath).toBe("commands/srd-assess.md");
  });
});
