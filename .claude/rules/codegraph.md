---
paths:
  - "**/*"
---

# CodeGraph

This repo ships the CodeGraph MCP server (`codegraph_*` tools): a tree-sitter-parsed knowledge graph of every symbol, edge, and file. Reads return structural information grep cannot.

If there is no `.codegraph/` directory, or a tool says the index is not initialized, skip CodeGraph. Indexing is the user's decision. Do not run `codegraph init`.

This rule applies to every file. To list the whole index, call `codegraph_files` with no `path` and no `pattern`.

## Rules of thumb

These apply when the index exists.

- Trust CodeGraph results. They come from a full AST parse. Do not re-verify them with grep.
- Do not grep first to look up a symbol by name. `codegraph_search` is faster.
- Do not chain `codegraph_search` and `codegraph_node` for context. Run `codegraph context "<task>"`.
- The watcher debounces about 500ms behind writes. Do not re-query immediately after editing.

## Prefer CodeGraph over grep for structural questions

| Question | Tool |
| --- | --- |
| Where is X defined? Find symbol X | `codegraph_search` |
| What calls function Y? | `codegraph_callers` |
| What does Y call? | `codegraph_callees` |
| How does X reach Y? Trace the flow | `codegraph_explore` |
| What breaks if I change Z? | `codegraph_impact` |
| Show Y's signature, source, or docstring | `codegraph_node` |
| Focused context for a task or area | `codegraph context` |
| Several related symbols' source at once | `codegraph_explore` |
| Every indexed file | `codegraph_files` |
