import { mkdtemp, mkdir, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import { spawnSync } from "node:child_process";

const tempRoots: string[] = [];
const repoRoot = process.cwd();

async function makeTempDir(prefix: string): Promise<string> {
  const root = await mkdtemp(join(os.tmpdir(), prefix));
  tempRoots.push(root);
  return root;
}

afterAll(async () => {
  const { rm } = await import("node:fs/promises");
  await Promise.all(tempRoots.splice(0).map((path) => rm(path, { recursive: true, force: true })));
});

describe("package smoke", () => {
  it("packs, exposes assets, and installs from a tarball", async () => {
    const packResult = spawnSync("npm", ["pack", "--json"], {
      cwd: repoRoot,
      encoding: "utf8",
    });

    expect(packResult.status).toBe(0);
    const tarballName = JSON.parse(packResult.stdout)[0].filename as string;
    const tarballPath = join(repoRoot, tarballName);
    tempRoots.push(tarballPath);

    const tarList = spawnSync("tar", ["-tf", tarballPath], {
      cwd: repoRoot,
      encoding: "utf8",
    });

    expect(tarList.status).toBe(0);
    expect(tarList.stdout).toContain("package/assets/commands/srd-assess.md");
    expect(tarList.stdout).toContain("package/assets/agents/srd-analyst.md");
    expect(tarList.stdout).toContain("package/assets/skills/srd-analysis/SKILL.md");

    const installRoot = await makeTempDir("opencode-srd-pack-install-");
    const configDir = await makeTempDir("opencode-srd-pack-config-");
    await writeFile(join(installRoot, "package.json"), '{"name":"smoke","private":true}\n', "utf8");

    const installResult = spawnSync("npm", ["install", tarballPath], {
      cwd: installRoot,
      encoding: "utf8",
    });

    expect(installResult.status).toBe(0);

    const cliResult = spawnSync(
      "node",
      [
        join(
          installRoot,
          "node_modules",
          "@dojocoding",
          "opencode-srd-framework",
          "dist",
          "cli.js",
        ),
        "install",
        "--config-dir",
        configDir,
      ],
      {
        cwd: installRoot,
        encoding: "utf8",
      },
    );

    expect(cliResult.status).toBe(0);
    await expect(readFile(join(configDir, "commands", "srd-assess.md"), "utf8")).resolves.toContain("SRD Assess");

    const doctorResult = spawnSync(
      "node",
      [
        join(
          installRoot,
          "node_modules",
          "@dojocoding",
          "opencode-srd-framework",
          "dist",
          "cli.js",
        ),
        "doctor",
        "--config-dir",
        configDir,
        "--json",
      ],
      {
        cwd: installRoot,
        encoding: "utf8",
      },
    );

    expect(doctorResult.status).toBe(0);
    expect(JSON.parse(doctorResult.stdout).healthy).toBe(true);
  }, 120_000);
});
