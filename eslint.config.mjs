import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  globalIgnores([
    "dist/",
    "build/",
    ".react-router/",
    "test-results/",
    "playwright-report/",
    "blob-report/",
  ]),
  {
    // A characterization file: its runner may change, not its code. CRA did
    // not run this rule, and it did not report unused caught errors.
    files: ["src/serverApi.test.ts"],
    rules: {
      "no-useless-assignment": "off",
      "@typescript-eslint/no-unused-vars": ["error", { caughtErrors: "none" }],
    },
  },
  {
    files: ["*.mjs"],
    extends: [js.configs.recommended],
    languageOptions: { globals: globals.node },
  },
  {
    files: ["**/*.{ts,tsx}"],
    extends: [tseslint.configs.recommended],
    rules: {
      "no-unused-vars": "off",
    },
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: { "react-hooks": reactHooks },
    languageOptions: { globals: globals.browser },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
  {
    files: ["src/**/*.test.ts", "src/**/*.test.tsx", "src/setupTests.ts"],
    languageOptions: { globals: { ...globals.node, ...globals.vitest } },
  },
  {
    files: ["server/**/*.ts"],
    languageOptions: { globals: globals.node },
  },
]);
