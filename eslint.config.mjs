import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";

export default defineConfig([
  globalIgnores([
    "dist/",
    "test-results/",
    "playwright-report/",
    "blob-report/",
  ]),
  {
    files: ["src/**/*.js"],
    extends: [js.configs.recommended],
    plugins: { "react-hooks": reactHooks },
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      // The same two hook rules CRA's react-app config ran.
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      // The classic JSX runtime uses the React import implicitly, and CRA did
      // not report unused caught errors.
      "no-unused-vars": [
        "error",
        { varsIgnorePattern: "^React$", caughtErrors: "none" },
      ],
    },
  },
  {
    files: ["src/**/*.test.js", "src/setupTests.js"],
    languageOptions: { globals: { ...globals.node, ...globals.vitest } },
  },
  {
    // A characterization file: its runner may change, not its code. CRA did
    // not run this rule.
    files: ["src/serverApi.test.js"],
    rules: { "no-useless-assignment": "off" },
  },
  {
    files: ["server/**/*.js"],
    extends: [js.configs.recommended],
    languageOptions: { sourceType: "commonjs", globals: globals.node },
  },
  {
    files: ["*.mjs", "e2e/**/*.js"],
    extends: [js.configs.recommended],
    languageOptions: { globals: globals.node },
  },
]);
