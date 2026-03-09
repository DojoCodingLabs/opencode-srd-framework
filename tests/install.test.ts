import { mkdtemp, mkdir, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { doctorSrdFramework } from "../src/lib/doctor.js";
import { installSrdFramework } from "../src/lib/install.js";
import { resolvePackageRoot } from "../src/lib/paths.js";
import { uninstallSrdFramework } from "../src/lib/uninstall.js";
import { updateSrdFramework } from "../src/lib/update.js";

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

describe("install/update/uninstall/doctor", () => {
  it("installs into a temp config directory and is idempotent", async () => {
    const packageRoot = resolvePackageRoot(import.meta.url);
    const configDir = await makeTempDir("opencode-srd-install-");

    const first = await installSrdFramework({ configDir, packageRoot });
    const second = await installSrdFramework({ configDir, packageRoot });

    expect(first.copied.length).toBeGreaterThan(0);
    expect(second.copied).toHaveLength(0);
    expect(second.updated).toHaveLength(0);
    expect(join(configDir, "commands", "srd-assess.md")).toBeTruthy();
    expect(await readFile(join(configDir, "commands", "srd-assess.md"), "utf8")).toContain("SRD Assess");
  });

  it("update refreshes managed files", async () => {
    const packageRoot = resolvePackageRoot(import.meta.url);
    const configDir = await makeTempDir("opencode-srd-update-");

    await installSrdFramework({ configDir, packageRoot });
    await writeFile(join(configDir, "commands", "srd-quick.md"), "mutated", "utf8");

    const result = await updateSrdFramework({ configDir, packageRoot });
    const content = await readFile(join(configDir, "commands", "srd-quick.md"), "utf8");

    expect(result.updated).toContain("commands/srd-quick.md");
    expect(content).toContain("SRD Quick");
  });

  it("uninstall removes only managed files", async () => {
    const packageRoot = resolvePackageRoot(import.meta.url);
    const configDir = await makeTempDir("opencode-srd-uninstall-");
    await installSrdFramework({ configDir, packageRoot });

    await mkdir(join(configDir, "commands"), { recursive: true });
    await writeFile(join(configDir, "commands", "custom.md"), "keep me", "utf8");

    await uninstallSrdFramework({ configDir });

    await expect(readFile(join(configDir, "commands", "custom.md"), "utf8")).resolves.toBe("keep me");
    await expect(readFile(join(configDir, "commands", "srd-assess.md"), "utf8")).rejects.toThrow();
  });

  it("doctor reports healthy and unhealthy states", async () => {
    const packageRoot = resolvePackageRoot(import.meta.url);
    const configDir = await makeTempDir("opencode-srd-doctor-");

    await installSrdFramework({ configDir, packageRoot });
    const healthy = await doctorSrdFramework({ configDir, packageRoot });

    expect(healthy.healthy).toBe(true);

    await writeFile(join(configDir, "commands", "srd-assess.md"), "drifted", "utf8");
    const unhealthy = await doctorSrdFramework({ configDir, packageRoot });

    expect(unhealthy.healthy).toBe(false);
    expect(unhealthy.driftedFiles).toContain("commands/srd-assess.md");
  });
});
