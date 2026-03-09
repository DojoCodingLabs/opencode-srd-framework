export { SrdFrameworkPlugin, SrdFrameworkPlugin as default } from "./plugin.js";
export { installSrdFramework } from "./lib/install.js";
export { updateSrdFramework } from "./lib/update.js";
export { uninstallSrdFramework } from "./lib/uninstall.js";
export { doctorSrdFramework } from "./lib/doctor.js";
export {
  CLI_NAME,
  CONFIG_SCHEMA_URL,
  DEFAULT_REMINDER_INTERVAL_MS,
  MANIFEST_FILE_NAME,
  PACKAGE_NAME,
  defaultConfigDir,
  resolveConfigDir,
} from "./lib/paths.js";
