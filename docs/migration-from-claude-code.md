# Migration From Claude Code

This package is the OpenCode-native successor to the original Claude-oriented SRD plugin.

## What changed

- `.claude-plugin/` packaging is gone.
- the legacy shell hook in `hooks/hooks.json` is now an npm-loadable OpenCode plugin in `src/plugin.ts`
- commands moved from Claude-style prompts to OpenCode markdown commands in `assets/commands/`
- agents moved to OpenCode markdown agent definitions in `assets/agents/`
- skills were rewritten to be self-contained and OpenCode-compatible
- runtime prompt dependencies on repo-local `resources/` and `schemas/` were removed
- project integration now targets `opencode.json` `instructions` and optional `AGENTS.md`

## What stayed compatible

- the SRD output file set remains the same
- `srd/claude-directive.yml` remains the machine-readable directive path
- persona, journey, and directive schemas still ship for documentation and maintenance

## New install model

Use:

```bash
npx @dojocoding/opencode-srd-framework install
```

This copies global commands, agents, and skills into `~/.config/opencode/` and safely registers the npm plugin in the OpenCode config.
