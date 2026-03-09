# Changelog

## [0.1.0] - 2026-03-09

### Added
- Initial OpenCode-native SRD framework package under `@dojocoding/opencode-srd-framework`
- Global SRD commands for guided, autonomous, and quick audit workflows
- Global SRD agents and skills rewritten for OpenCode markdown formats
- npm-loadable OpenCode plugin with throttled SRD alignment reminders
- Safe install, update, uninstall, and doctor CLI with manifest tracking
- Tests, CI, packaging smoke coverage, and publish workflow

### Changed
- Migrated away from Claude-only marketplace packaging and hooks
- Rewrote prompts to remove runtime dependence on repo-local resources and schemas
- Switched project integration guidance from `CLAUDE.md`-first to `opencode.json` instructions plus optional `AGENTS.md`
