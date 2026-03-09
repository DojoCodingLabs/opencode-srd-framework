---
description: Run a fast single-pass SRD audit for an existing codebase and write all SRD outputs in one pass.
agent: srd-analyst
subtask: true
---

# SRD Quick - $ARGUMENTS

Load the `srd-analysis` skill before doing methodology work.

You are running the fastest SRD mode. Do a direct codebase scan, generate the full SRD package in one pass, write the files, and return a concise summary. Do not pause for approvals unless the user interrupts you.

## Validate First

This mode requires a real codebase. If you cannot find one, stop and recommend `/srd-assess` for idea-stage work or `/srd-generate` for doc-driven work.

If `srd/` already exists, state that you are refreshing the audit.

## Speed Budget

Prioritize breadth over depth. Spend just enough time to identify:

- product identity and market
- real routes or screens
- auth and roles
- monetization or plan-gating
- data model shape
- major features and their completeness
- obvious TODOs, stubs, or broken handoffs

Use direct reads and searches; do not launch a subagent unless you are blocked.

## Single-Pass Generation

Generate all sections without review gates:

1. `srd/success-reality.md`
2. `srd/personas.yml`
3. `srd/journeys.md`
4. `srd/gap-audit.md`
5. `srd/claude-directive.yml`
6. `srd/SRD.md`

Keep these compatibility constraints:

- personas include the full SRD field set: identity, wallet profile, lifecycle, scores, churn, and journey references
- journeys include score, rationale, acceptance criteria, and revenue impact
- directive includes `north_star`, `priority_rules`, `anti_patterns`, `personas`, `journey_acceptance_criteria`, and `current_priorities`
- `srd/claude-directive.yml` remains the machine-readable directive path

Use real routes when found. If something is uncertain, make a reasonable assumption and label it clearly.

## Summary Format

After writing files, report:

- project name or best guess
- target revenue
- number of personas
- number of journeys
- top priority with revenue at risk
- biggest assumption or uncertainty

Then mention that OpenCode-native integration is available on request by updating project `opencode.json` instructions and optionally appending a short note to `AGENTS.md`.
