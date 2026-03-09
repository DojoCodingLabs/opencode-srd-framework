---
description: Run a guided SRD assessment with approval gates for each section.
agent: srd-analyst
subtask: true
---

# SRD Assess - $ARGUMENTS

Load the `srd-analysis` skill before doing methodology work.

You are running Synthetic Reality Development in guided mode. The goal is to generate a complete, internally consistent SRD package in `srd/` while keeping the user in the loop at every major decision point.

## Inputs

- Working codebase if one exists.
- Optional PRD or planning doc from `$ARGUMENTS`.
- Idea-stage description from the user if no code or docs exist.

## Required Outputs

Write these files only after the user approves every section:

1. `srd/success-reality.md`
2. `srd/personas.yml`
3. `srd/journeys.md`
4. `srd/gap-audit.md`
5. `srd/claude-directive.yml`
6. `srd/SRD.md`

Keep the output format compatible with existing SRD workflows, especially the YAML structure in `srd/personas.yml` and `srd/claude-directive.yml`.

## Operating Rules

- Ask one question at a time.
- Ask 5-8 core questions; never exceed 10 total before moving to generation.
- If a codebase exists, invoke the `codebase-auditor` subagent early through the Task tool and ask for routes, auth, data model, monetization, feature completeness, and gaps.
- If a PRD or spec is provided, read it and extract product type, users, monetization, metrics, roadmap, and constraints.
- If the user says to move faster, state your assumptions and continue.
- Present one full section at a time, then wait for approval or edits.

## Question Flow

Cover these topics in natural language:

1. Product identity and who it serves.
2. Revenue model and who pays.
3. Revenue target to plan backwards from.
4. Current state: codebase, PRD, idea, or hybrid.
5. Top user types and how they differ.
6. Core value loop that must succeed for the product to live.
7. Current pain points or drop-off points if the product exists.
8. Competitive alternatives and differentiation.

Use 1-2 targeted follow-ups only when needed to clarify monetization, marketplace sides, or enterprise buyer vs. end user.

## Section Gates

Generate and review these sections in order.

### 1. Success Reality

Produce a six-month success snapshot with:

- KPI table: target revenue, users, paying users, conversion, churn, NPS, and engagement assumptions
- revenue breakdown that sums to the target
- content or activity volume at the target state
- conversion attribution that sums to about 100%

Then ask whether the success snapshot feels right.

### 2. Personas

Generate the right number of personas for the product complexity and ensure each persona includes:

- `id`, `name`, `archetype`
- `identity` with age, location, background, goals, pain points, tech stack, languages
- `wallet_profile` with income, plan progression, upgrade trigger, monthly spend, `ltv`, `user_pct`, `revenue_pct`
- `lifecycle` with at least 6 dated entries
- `scores` for revenue, engagement, virality
- `churn_risk_moments`
- `primary_journeys`, `conversion_trigger`, optional `critical_note`

Validate that user and revenue percentages each sum to about 100%.

Then ask for approval.

### 3. Journeys

Map critical journeys with:

- `id`, `name`, `personas`, `revenue_tag`
- 5-12 steps containing `user_action`, `screen_route`, `what_must_happen`, `data_required`
- `current_score` and `score_rationale`
- binary `acceptance_criteria`
- `revenue_impact` with `conversion_pct`, `revenue_at_risk`, `personas_blocked`

Use real routes when a codebase exists. Use planned or `[TBD]` routes otherwise.

Then ask for approval.

### 4. Gap Audit

Cross-reference personas and journeys to produce:

- persona x journey impact matrix
- revenue at risk per journey
- persona viability tiers
- tiered fixes `T0`, `T1`, `T2`
- quick wins
- implementation order with dependencies

Then ask whether the prioritization feels right.

### 5. Directive

Generate `srd/claude-directive.yml` with:

- project metadata and generated date
- `north_star`
- ordered `priority_rules`
- project-specific `anti_patterns`
- abbreviated `personas`
- `journey_acceptance_criteria`
- `current_priorities`

Then ask for approval.

## After Approval

Write all six files. End with a concise summary including the target, number of personas, number of journeys, and highest-priority fix.

## Integration Offer

After writing files, offer OpenCode-native integration:

1. Update project `opencode.json` or `opencode.jsonc` so `instructions` includes `srd/claude-directive.yml` and `srd/gap-audit.md` exactly once while preserving unrelated config and comments.
2. Optionally append a short SRD note to `AGENTS.md`.
3. Only touch `CLAUDE.md` if the user explicitly wants compatibility help.

Do not mention Claude marketplace packaging, `.claude-plugin/`, or pseudo-APIs.
