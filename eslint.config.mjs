import { globalIgnores } from "eslint/config";
import tsParser from "@typescript-eslint/parser";
export default [
  globalIgnores([".next/**", "node_modules/**", "prisma/migrations/**"]),
  {
    files: ["src/**/*.{js,jsx,ts,tsx}", "prisma/seed.ts"],
    languageOptions: { parser: tsParser, parserOptions: { ecmaVersion: "latest", sourceType: "module", ecmaFeatures: { jsx: true } } },
    rules: { "no-debugger": "error", "no-unreachable": "error" }
  }
];
