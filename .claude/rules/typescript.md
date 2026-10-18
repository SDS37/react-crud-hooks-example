# TypeScript

This app stays JavaScript. `specs/upgrade.md` forbids converting it during the upgrade. Do not add a TypeScript dependency, a `tsconfig`, or a `.ts` or `.tsx` file unless an accepted spec in `specs/` says so.

When that spec exists, the [TypeScript handbook](https://www.typescriptlang.org/docs/handbook/intro.html) is the language. Do not copy it into this file.

- Turn `strict` on, including `strictNullChecks` and `noImplicitAny`.
- Use `unknown` for a value that is not yet checked. Do not add `any`, `as any`, or `@ts-ignore` unless the spec gives a one-line reason.
- Types and interfaces are `PascalCase`, with no `I` prefix. Values and functions are `camelCase`.
- Use `string`, `number`, and `boolean`. Do not use the boxed `String`, `Number`, or `Boolean` types.
- Use ES modules. Do not add `require` or a `namespace` module.
- Confirm a library's types with the `docs` skill before writing them.
