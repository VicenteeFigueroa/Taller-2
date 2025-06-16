import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    ignores: ["eslint.config.js"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    rules: {
      semi: ["warn", "always"],
      quotes: ["warn", "single", { avoidEscape: true }],
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
];
