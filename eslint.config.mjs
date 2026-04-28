import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";

export default [
  {
    // Rules for all TypeScript files
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: {
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-non-null-assertion": "error",
      "@typescript-eslint/no-unused-vars": "error",
      "eqeqeq": "error",
      "indent": ["error", 2],
      "no-console": "warn",
      "no-var": "error",
      "prefer-const": "error",
      "quotes": ["error", "double"],
      "semi": ["error", "always"],
    },
  },
  {
    // explicit-function-return-type scoped to helpers only
    // Playwright test callbacks should never have explicit return types
    files: ["helpers/**/*.ts"],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: {
      "@typescript-eslint/explicit-function-return-type": "error",
    },
  },
];
