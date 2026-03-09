import type { Plugin } from "@opencode-ai/plugin";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { DEFAULT_REMINDER_INTERVAL_MS } from "./lib/paths.js";
import { fileExists } from "./lib/fs-utils.js";

const lastToastByProject = new Map<string, number>();
const watchedTools = new Set(["write", "edit", "patch", "multiedit"]);

function extractCurrentPriorityJourney(directiveText: string): string | undefined {
  const match = directiveText
    .split(/current_priorities:\s*/i)
    .slice(1)
    .join("\n")
    .match(/^\s*journey:\s*["']?(.+?)["']?\s*$/m);

  return match?.[1];
}

export const SrdFrameworkPlugin: Plugin = async ({ client, directory, worktree }) => {
  await client.app.log({
    body: {
      service: "opencode-srd-framework",
      level: "info",
      message: "SRD Framework plugin initialized",
      extra: { directory, worktree },
    },
  });

  return {
    "tool.execute.after": async (input) => {
      if (!watchedTools.has(input.tool)) {
        return;
      }

      const projectRoot = worktree || directory;

      if (!projectRoot) {
        return;
      }

      const directivePath = join(projectRoot, "srd", "claude-directive.yml");

      if (!(await fileExists(directivePath))) {
        return;
      }

      const lastToastAt = lastToastByProject.get(projectRoot) ?? 0;
      const now = Date.now();

      if (now - lastToastAt < DEFAULT_REMINDER_INTERVAL_MS) {
        return;
      }

      lastToastByProject.set(projectRoot, now);

      let journeyLabel = "the highest-priority unfixed journey";

      try {
        const directive = await readFile(directivePath, "utf8");
        const currentJourney = extractCurrentPriorityJourney(directive);

        if (currentJourney) {
          journeyLabel = `journey ${currentJourney}`;
        }
      } catch {
        // Best-effort only.
      }

      const message = `SRD check: keep this edit aligned with ${journeyLabel}. Review srd/claude-directive.yml and srd/gap-audit.md before continuing.`;

      await Promise.allSettled([
        client.tui.showToast({
          body: {
            title: "SRD alignment reminder",
            message,
            variant: "info",
          },
        }),
        client.app.log({
          body: {
            service: "opencode-srd-framework",
            level: "info",
            message: "SRD alignment reminder shown",
            extra: {
              projectRoot,
              tool: input.tool,
              journeyLabel,
            },
          },
        }),
      ]);
    },
  };
};

export default SrdFrameworkPlugin;
