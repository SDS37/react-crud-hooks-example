# TypeScript

The app, the server, the tests, and the config files are TypeScript. `npm run typecheck` runs `react-router typegen && tsc` with `strict` on and `allowJs` off. `eslint.config.mjs` stays JavaScript. There is no `prop-types` package and no JSX-in-`.js` Vite plugin.

The [TypeScript handbook](https://www.typescriptlang.org/docs/handbook/intro.html) is the language. Do not copy it into this file.

- Turn `strict` on, including `strictNullChecks` and `noImplicitAny`.
- Use `unknown` for a value that is not yet checked. Do not add `any`, `as any`, or `@ts-ignore` unless the spec gives a one-line reason.
- Types and interfaces are `PascalCase`, with no `I` prefix. Values and functions are `camelCase`.
- Use `string`, `number`, and `boolean`. Do not use the boxed `String`, `Number`, or `Boolean` types.
- Use ES modules. Do not add `require` or a `namespace` module.
- The server runs on Node 24 type stripping. Keep it to erasable syntax: no `enum`, no runtime `namespace`, no parameter properties, and no import aliases. `npm run start-server` stays one `node` command.
- Confirm a library's types with the `docs` skill before writing them.
