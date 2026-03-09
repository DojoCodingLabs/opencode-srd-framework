import type { InstallOptions, InstallResult } from "./install.js";
import { installSrdFramework } from "./install.js";

export async function updateSrdFramework(options: InstallOptions): Promise<InstallResult> {
  const result = await installSrdFramework(options);
  return {
    ...result,
    command: "update",
  };
}
