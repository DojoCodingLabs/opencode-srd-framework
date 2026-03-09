---
name: srd-analysis
description: Generate and validate Synthetic Reality Development outputs for ideas, PRDs, and codebases.
license: MIT
compatibility: opencode
metadata:
  workflow: srd
  audience: product-and-engineering
---

## What this skill does

Use this skill when you need to generate, review, or refresh an SRD package. SRD means working backwards from a believable success state instead of starting with a feature list.

The workflow is:

1. define the success state at a target revenue or impact level
2. model the personas that create, unlock, or protect that value
3. map the critical journeys those personas must complete
4. audit the gaps between the current product and those journeys
5. turn the audit into machine-readable directives for future work

## Required deliverables

An SRD run writes these files into `srd/`:

- `srd/success-reality.md`
- `srd/personas.yml`
- `srd/journeys.md`
- `srd/gap-audit.md`
- `srd/claude-directive.yml`
- `srd/SRD.md`

## Success reality method

Create a six-month snapshot that includes:

- target revenue or equivalent north-star target
- KPI table with users, paying users, conversion, churn, engagement, and NPS assumptions
- revenue breakdown by plan, take rate, usage, or contract type
- content, listing, transaction, or activity volume at target scale
- conversion attribution that totals about 100%

If the user does not provide a target, estimate it from product type:

- solo dev tool: roughly `$5k-$15k MRR`
- B2B SaaS: roughly `$30k-$100k MRR`
- B2C SaaS: roughly `$20k-$75k MRR`
- marketplace: roughly `$50k-$200k MRR`
- education platform: roughly `$30k-$100k MRR`
- developer API/platform: roughly `$20k-$80k MRR`
- enterprise SaaS: roughly `$100k-$500k MRR`

## Persona schema

Each persona must include:

- `id`, `name`, `archetype`
- `identity`
  - `age`
  - `location`
  - `background`
  - `goals`
  - `pain_points`
  - `tech_stack`
  - `languages`
- `wallet_profile`
  - `income`
  - `plan_progression`
  - `upgrade_trigger`
  - `monthly_spend`
  - `ltv`
  - `user_pct`
  - `revenue_pct`
- `lifecycle` with at least 6 time-based entries
- `scores` for revenue, engagement, virality
- `churn_risk_moments`
- `primary_journeys`
- `conversion_trigger`
- optional `critical_note`

Scaling guidance:

- simple product: 3-5 personas
- standard SaaS: 6-8 personas
- complex platform: 8-12 personas
- marketplace or multi-sided system: 10-15 personas

## Journey schema

Each journey must include:

- `id`, `name`, `personas`, `revenue_tag`
- 5-12 `steps`
  - `step`
  - `user_action`
  - `screen_route`
  - `what_must_happen`
  - `data_required`
- `current_score`
- `score_rationale`
- `acceptance_criteria`
- `revenue_impact`
  - `conversion_pct`
  - `revenue_at_risk`
  - `personas_blocked`

Journey score guidelines:

- `0-25`: broken
- `25-50`: scaffolded
- `50-75`: partial
- `75-90`: mostly complete
- `90-100`: complete

Use real routes when a codebase exists. Use planned routes or `[TBD]` markers when working from docs or ideas.

## Gap audit method

Build the decision engine in four layers:

1. persona x journey impact matrix
2. revenue at risk per journey
3. persona viability tiers
4. prioritized fix list

Revenue-at-risk formula:

`revenue_at_risk = conversion_pct * target_revenue * (1 - current_score / 100)`

Fix tiers:

- `T0`: revenue blockers
- `T1`: value-delivery blockers
- `T2`: retention and growth improvements

Every fix should include an ID, description, journey, personas affected, revenue at risk, effort, and dependencies.

## Directive schema

`srd/claude-directive.yml` must include:

- project metadata and generated date
- `north_star`
- ordered `priority_rules`
- project-specific `anti_patterns`
- abbreviated `personas`
- `journey_acceptance_criteria`
- `current_priorities`

Priority rules should resolve real tradeoffs. Anti-patterns should reference actual team or codebase tendencies, not generic platitudes.

## Consistency checks

Before finalizing, confirm:

- revenue breakdown reconstructs the target
- persona `user_pct` totals about 100
- persona `revenue_pct` totals about 100
- journey references and persona references match
- conversion attribution totals about 100
- journey scores match the acceptance criteria
- revenue at risk does not exceed the total target envelope
- the top priorities logically follow from the weakest high-value journeys

## Integration guidance

Prefer OpenCode-native integration after SRD generation:

1. update project `opencode.json` or `opencode.jsonc` so `instructions` includes `srd/claude-directive.yml` and `srd/gap-audit.md`
2. optionally append a short note to `AGENTS.md`
3. treat `CLAUDE.md` as compatibility-only

Do not require package-local resources or schemas at runtime. This skill contains the methodology needed to execute the flow in any project.
