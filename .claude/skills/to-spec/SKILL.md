---
name: to-spec
description: "Turn the current conversation into a spec at specs/<slug>.md and stop for acceptance. No interview, just synthesis of what you've already discussed."
disable-model-invocation: true
---

Write the spec to `specs/<slug>.md` from the conversation and the code. Do not interview the user. Do not publish it to GitHub. Set `Status: proposed` at the top and stop. Do not edit `src/`, `server/`, or `package.json` until the user accepts that file.

Use the vocabulary in `AGENTS.md`. Do not create a glossary or a `docs/` file.

## Process

1. Read the code the change touches, if you have not already.
2. Name the seam the test will use. Prefer a seam this repo already has. One seam is enough unless the change crosses two.
3. Write the spec with the template below. Show it to the user and stop.

<spec-template>

## Problem Statement

The problem, from the user's perspective.

## Solution

The solution, from the user's perspective.

## User Stories

Numbered stories for the behavior the conversation already asked for:

1. As a shop staff member, I want to see the menu sorted by name, so that I can find a flavour quickly

Do not add stories the conversation did not discuss.

## Implementation Decisions

Modules, interfaces, and API contracts. Name a file when it is the seam, as `specs/upgrade.md` does.

## Testing Decisions

What the test observes from outside the module, which existing test it should resemble, and the command from "Commands in force".

## Out of Scope

What this spec does not change.

## Further Notes

Anything a later commit would otherwise have to guess.

</spec-template>
