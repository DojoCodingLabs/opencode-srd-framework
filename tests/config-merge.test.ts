import { mkdtemp, mkdir, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { addPluginToConfig, removePluginFromConfig } from "../src/lib/merge-opencode-config.js";
import { PACKAGE_NAME } from "../src/lib/paths.js";

const tempRoots: string[] = [];

async function makeConfigDir(): Promise<string> {
  const root = await mkdtemp(join(os.tmpdir(), "opencode-srd-config-"));
  tempRoots.push(root);
  const configDir = join(root, "config");
  await mkdir(configDir, { recursive: true });
  return configDir;
}

afterEach(async () => {
  const { rm } = await import("node:fs/promises");
  await Promise.all(tempRoots.splice(0).map((path) => rm(path, { recursive: true, force: true })));
});

describe("merge-opencode-config", () => {
  it("adds the plugin entry only once", async () => {
    const configDir = await makeConfigDir();
    const configPath = join(configDir, "opencode.json");

    await writeFile(
      configPath,
      `{
  // keep my comments
  "plugin": ["example-plugin"]
}
`,
      "utf8",
    );

    await addPluginToConfig(configDir, PACKAGE_NAME);
    await addPluginToConfig(configDir, PACKAGE_NAME);

    const content = await readFile(configPath, "utf8");
    expect(content.match(new RegExp(PACKAGE_NAME.replace("/", "\\/"), "g"))?.length).toBe(1);
    expect(content).toContain("// keep my comments");
  });

  it("removes the plugin entry without disturbing the rest", async () => {
    const configDir = await makeConfigDir();
    const configPath = join(configDir, "opencode.json");

    await writeFile(
      configPath,
      `{
  "plugin": ["example-plugin", "${PACKAGE_NAME}"],
  "theme": "dark"
}
`,
      "utf8",
    );

    await removePluginFromConfig(configDir, PACKAGE_NAME);

    const content = await readFile(configPath, "utf8");
    expect(content).not.toContain(PACKAGE_NAME);
    expect(content).toContain("example-plugin");
    expect(content).toContain('"theme": "dark"');
  });
});
