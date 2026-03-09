---
name: srd-guardian
description: Check whether proposed work aligns with the active SRD priorities and highest-value journeys.
license: MIT
compatibility: opencode
metadata:
  workflow: srd-alignment
  audience: engineering
---

## When to use this skill

Use this when:

- a project has `srd/claude-directive.yml`
- someone asks what to work on next
- you are reviewing a plan, branch, PR, or active edit
- you want to sanity-check whether current work matches the active SRD

## What to read

Load the SRD state from:

1. `srd/claude-directive.yml`
2. `srd/gap-audit.md`
3. `srd/personas.yml`
4. `srd/journeys.md`

If the files are missing, say that SRD has not been generated yet and recommend `/srd-assess`, `/srd-generate`, or `/srd-quick`.

## Alignment protocol

1. Identify the current or proposed work.
2. Check `current_priorities` and `priority_rules` in `srd/claude-directive.yml`.
3. Compare the work against the highest-priority unfixed journey and fix tier.
4. Look for any triggered anti-patterns.
5. Explain whether the work advances a failing acceptance criterion.

## How to answer

### If aligned

Confirm alignment, cite the tier or journey, mention the revenue at risk, and recommend proceeding.

### If misaligned

Name the higher-priority journey or fix, reference the relevant priority rule, and recommend switching first.

### If an anti-pattern is triggered

Name the anti-pattern, explain the trigger, and recommend reconsidering or sequencing the work differently.

## Additional checks

- If `generated_date` is older than 30 days, suggest refreshing SRD after the current answer.
- Be specific with IDs, journey names, persona names, and dollars.
- Stay advisory, not blocking.
