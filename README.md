# OpenCode SRD Framework

Synthetic Reality Development (SRD) for OpenCode. This package installs global commands, agents, and skills, and registers an npm-loaded OpenCode plugin that nudges teams back toward revenue-critical work after edits.

This package is the OpenCode-compatible npm distribution of the upstream SRD framework in [`DojoCodingLabs/srd-framework`](https://github.com/DojoCodingLabs/srd-framework). The upstream project targets Claude Code's plugin marketplace flow, while this repo repackages the same SRD methodology and assets for OpenCode and npm-based installation.

## What SRD Is

SRD is a backwards-from-success product workflow:

1. Define the target success state.
2. Model the personas that create and capture revenue.
3. Map the journeys those personas must complete.
4. Audit the gaps between the current product and that target reality.
5. Generate machine-readable directives so humans and agents keep shipping the highest-impact work.

Every SRD run writes these compatible outputs into `srd/`:

- `srd/success-reality.md`
- `srd/personas.yml`
- `srd/journeys.md`
- `srd/gap-audit.md`
- `srd/claude-directive.yml`
- `srd/SRD.md`

## Install

Fresh machine:

```bash
npx @dojocoding/opencode-srd-framework install
```

This command:

- copies global commands into `~/.config/opencode/commands/`
- copies global agents into `~/.config/opencode/agents/`
- copies global skills into `~/.config/opencode/skills/`
- safely merges `~/.config/opencode/opencode.json` to register `@dojocoding/opencode-srd-framework`
- writes a manifest so update and uninstall only touch package-managed files

Common options:

```bash
opencode-srd-framework install --config-dir /tmp/opencode --dry-run
opencode-srd-framework install --force
```

## Update

```bash
npx @dojocoding/opencode-srd-framework update
```

`update` refreshes managed commands, agents, and skills, prunes stale managed assets, and keeps unmanaged files alone unless `--force` is used.

## Uninstall

```bash
npx @dojocoding/opencode-srd-framework uninstall
```

`uninstall` removes only manifest-managed files and removes the plugin entry from `opencode.json`.

## Doctor

```bash
npx @dojocoding/opencode-srd-framework doctor
npx @dojocoding/opencode-srd-framework doctor --json
```

`doctor` verifies the config directory, managed assets, manifest, and plugin registration.

## Available Commands

- `/srd-assess` - guided dialogue with approval gates
- `/srd-generate` - autonomous analysis with review gates
- `/srd-quick` - single-pass fast audit for existing codebases

## Available Agents

- `@srd-analyst` - primary SRD generator and orchestrator
- `@srd-guardian` - read-only alignment checker
- `@codebase-auditor` - hidden read-only codebase explorer used by SRD flows

## Available Skills

- `srd-analysis`
- `srd-guardian`

## Usage Examples

```text
/srd-quick
/srd-generate docs/prd.md
/srd-assess "A marketplace for freelance developers"
@srd-guardian should I work on the analytics dashboard next?
```

## OpenCode-Native Integration Behavior

After SRD generation, the commands instruct the agent to integrate the project by:

- adding `srd/claude-directive.yml` and `srd/gap-audit.md` to the project `opencode.json` or `opencode.jsonc` `instructions` array
- optionally appending a short note to `AGENTS.md`
- keeping `CLAUDE.md` support as compatibility-only, not the primary integration target

The npm-loaded plugin listens after edit-style tools and shows a throttled SRD reminder whenever `srd/claude-directive.yml` exists in the active project.

## Compatibility Notes

- The upstream SRD framework lives in `DojoCodingLabs/srd-framework`; this package exists to make that workflow installable in OpenCode.
- The original Claude plugin is distributed through the plugin marketplace rather than npm; use this package for the npm-published OpenCode-compatible version.
- `srd/claude-directive.yml` remains the canonical machine-readable directive path for existing SRD workflows.
- Packaged references and schemas ship for maintenance and documentation, but runtime prompts are self-contained.
- Claude-only packaging from `.claude-plugin/` is intentionally not migrated.

More detail:

- `docs/migration-from-claude-code.md`
- `docs/compatibility.md`
- `docs/release.md`
