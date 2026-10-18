# CLAUDE.md

Claude Code project guidance for this repository.

Primary instructions live in the agent guide. Import it:

@AGENTS.md

## Claude-only notes

- Edit `AGENTS.md` when commands, architecture, or the spec gate change. Do not copy those sections into this file.
- Project docs start at `docs/README.md`.
- A new spec uses `/to-spec`. A small accepted change uses `/implement`. Work that will not fit one context uses `/implement-spec`. The lead does not implement that work itself.
- The stack upgrade is the `upgrade` skill. It reads `specs/upgrade.md` and uses the `docs` skill before writing a library API.
- After each edit, the format hook runs Prettier. The secret hook blocks `.env` and credential files. Lefthook repeats the Prettier check at commit time (`brew install lefthook && lefthook install`).
- CodeGraph usage is `.claude/rules/codegraph.md`. Leave the installer block in `.claude/CLAUDE.md` inside its markers.
