# Compatibility Notes

## Generated files

The package continues to generate:

- `srd/success-reality.md`
- `srd/personas.yml`
- `srd/journeys.md`
- `srd/gap-audit.md`
- `srd/claude-directive.yml`
- `srd/SRD.md`

These paths are intentionally preserved so existing SRD review and automation workflows continue to work.

## Directive path

`srd/claude-directive.yml` remains the canonical machine-readable directive file even though the host integration is now OpenCode-first.

## Project integration

Primary integration target:

- project `opencode.json` or `opencode.jsonc` `instructions`
- optional `AGENTS.md` note

Compatibility-only target:

- `CLAUDE.md`

## Prompt portability

Commands, agents, and skills no longer depend on packaged `resources/` or `schemas/` at runtime. Packaged reference and schema files remain in `assets/` for maintenance, documentation, and future evolution.
