import { copyFile, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import {
  ensureDir,
  fileExists,
  listFilesRecursive,
  relativePosixPath,
  sha256,
  toPosixPath,
} from "./fs-utils.js";
import type { InstallManifest, ManagedFile } from "./manifest.js";

export interface AssetDescriptor {
  kind: ManagedFile["kind"];
  sourcePath: string;
  relativePath: string;
  checksum: string;
}

export interface SyncAssetsOptions {
  configDir: string;
  dryRun?: boolean;
  force?: boolean;
  manifest?: InstallManifest;
  packageRoot: string;
}

export interface SyncAssetsResult {
  copied: string[];
  updated: string[];
  skipped: string[];
  removed: string[];
  conflicts: string[];
  managedFiles: ManagedFile[];
}

const installRoots: Array<{ kind: ManagedFile["kind"]; source: string; target: string }> = [
  { kind: "command", source: "assets/commands", target: "commands" },
  { kind: "agent", source: "assets/agents", target: "agents" },
  { kind: "skill", source: "assets/skills", target: "skills" },
];

export async function getInstallableAssets(packageRoot: string): Promise<AssetDescriptor[]> {
  const assets: AssetDescriptor[] = [];

  for (const installRoot of installRoots) {
    const sourceRoot = join(packageRoot, installRoot.source);
    const files = await listFilesRecursive(sourceRoot);

    for (const file of files) {
      const sourceContents = await readFile(file);
      assets.push({
        kind: installRoot.kind,
        sourcePath: file,
        relativePath: toPosixPath(join(installRoot.target, relativePosixPath(sourceRoot, file))),
        checksum: sha256(sourceContents),
      });
    }
  }

  return assets.sort((left, right) => left.relativePath.localeCompare(right.relativePath));
}

export async function syncManagedAssets(
  options: SyncAssetsOptions,
): Promise<SyncAssetsResult> {
  const assets = await getInstallableAssets(options.packageRoot);
  const copied: string[] = [];
  const updated: string[] = [];
  const skipped: string[] = [];
  const removed: string[] = [];
  const conflicts: string[] = [];
  const currentManaged = new Set(options.manifest?.managedFiles.map((file) => file.relativePath) ?? []);
  const expectedPaths = new Set(assets.map((asset) => asset.relativePath));

  for (const asset of assets) {
    const targetPath = join(options.configDir, asset.relativePath);
    const targetExists = await fileExists(targetPath);
    const isManaged = currentManaged.has(asset.relativePath);

    if (targetExists && !isManaged && !options.force) {
      conflicts.push(asset.relativePath);
      continue;
    }

    if (targetExists) {
      const currentChecksum = sha256(await readFile(targetPath));

      if (currentChecksum === asset.checksum) {
        skipped.push(asset.relativePath);
        continue;
      }
    }

    if (!options.dryRun) {
      await ensureDir(dirname(targetPath));
      await copyFile(asset.sourcePath, targetPath);
    }

    if (targetExists) {
      updated.push(asset.relativePath);
    } else {
      copied.push(asset.relativePath);
    }
  }

  const staleManagedPaths = (options.manifest?.managedFiles ?? [])
    .map((file) => file.relativePath)
    .filter((relativePath) => !expectedPaths.has(relativePath));

  for (const staleManagedPath of staleManagedPaths) {
    const absolutePath = join(options.configDir, staleManagedPath);

    if (!(await fileExists(absolutePath))) {
      continue;
    }

    if (!options.dryRun) {
      const { rm } = await import("node:fs/promises");
      await rm(absolutePath, { force: true });
    }

    removed.push(staleManagedPath);
  }

  return {
    copied,
    updated,
    skipped,
    removed,
    conflicts,
    managedFiles: assets.map((asset) => ({
      relativePath: asset.relativePath,
      checksum: asset.checksum,
      kind: asset.kind,
    })),
  };
}
