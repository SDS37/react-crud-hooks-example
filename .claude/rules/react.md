# React

Follow the React version in force, React 19.3.1. Confirm an API with the `docs` skill before writing it.

The language rules are the [Rules of React](https://react.dev/reference/rules). Do not copy them into this file.

This app adds these boundaries:

- Function components and hooks.
- Only `src/data/iceCreamData.js` calls axios or `fetch`.
- Add and edit are thin containers. They render `src/ice-cream/IceCream.js`.
- `useValidation` returns `[error, ariaProps]`. Spread `ariaProps` on the input. Errors show after the first submit. A failed submit focuses the first `[aria-invalid="true"]` control.
- Quantity 0 and out of stock stay coupled.
- Styles are Emotion `css` blocks in the component file, applied with the `css` prop.
- The skip link targets `#main`. `main` is the landmark. Loading uses `aria-live`. Decorative images use `alt=""`.
