---
description: Run an autonomous SRD assessment with review gates and OpenCode-native integration guidance.
agent: srd-analyst
subtask: true
---

# SRD Generate - $ARGUMENTS

Load the `srd-analysis` skill before doing methodology work.

You are running Synthetic Reality Development in autonomous mode. Explore the project independently, synthesize the current state, then generate each SRD section with explicit review gates before writing files.

## Inputs

- The codebase in the current project, if present.
- Optional PRD or planning files referenced by `$ARGUMENTS`.
- Existing docs such as `README.md`, `AGENTS.md`, `opencode.json`, specs, or roadmap files.

## Initial Validation

Look for a codebase marker or planning document. If neither exists, stop and recommend `/srd-assess` for idea-stage work.

If a codebase exists, invoke the `codebase-auditor` subagent immediately through the Task tool and ask for a structured report covering product identity, routes, auth, data model, monetization, feature completeness, and tech stack.

## Autonomous Context Gathering

While the auditor runs, read the best available documentation and extract:

- product type and market
- monetization model and pricing clues
- user types and roles
- feature completeness and known gaps
- technical constraints and integrations
- target metrics or business goals

If `srd/` already exists, treat it as context, not truth. Call out where you are refreshing assumptions.

## Framing Check

Before generating sections, present a concise synthesis that states:

- product type
- revenue model
- proposed target revenue
- planned persona count
- planned journey count
- highest-confidence and lowest-confidence assumptions

Wait for confirmation or correction.

## Section Review Gates

Generate these sections one at a time and wait for approval after each one:

1. Success Reality
2. Personas
3. Journeys
4. Gap Audit
5. Directive

Each section must follow the SRD structures embedded in the `srd-analysis` skill:

- personas must contain the required identity, wallet, lifecycle, score, churn, and cross-reference fields
- journeys must include step maps, scores, acceptance criteria, and revenue impact
- the directive must include the north star, priority rules, anti-patterns, persona quick references, journey acceptance criteria, and current priorities

Validate math before presenting each section:

- revenue breakdown sums to the target
- persona `user_pct` sums to about 100
- persona `revenue_pct` sums to about 100
- journey revenue at risk stays within the target revenue envelope

## Write Files

After all gates are approved, write:

- `srd/success-reality.md`
- `srd/personas.yml`
- `srd/journeys.md`
- `srd/gap-audit.md`
- `srd/claude-directive.yml`
- `srd/SRD.md`

Then present a concise summary with the target revenue, top priority, persona count, journey count, and any major assumptions that remain.

## Integration Offer

After generation, offer OpenCode-native project integration:

1. add `srd/claude-directive.yml` and `srd/gap-audit.md` to the project `instructions` array in `opencode.json` or `opencode.jsonc`
2. optionally append a short note to `AGENTS.md`
3. treat `CLAUDE.md` as compatibility-only and update it only on request

Do not reference Claude marketplace flows, repo-local `resources/`, or repo-local `schemas/`.
