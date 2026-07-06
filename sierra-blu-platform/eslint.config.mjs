import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Filter out build artifacts and dependencies
    ".next/**",
    ".firebase/**",
    "node_modules/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "tools/**",
    "tools_backup/**",
    "skills/**",
    "allll/**",
    "temp_repos/**",
    "Applications_Data/**",
    "May 4 last plan/**",
    "old projects/**",
    "New folder/**",
    "Sierra-Blu-*/**",
    "my-*/**",
    "antigravity-awesome-skills/**",
    "mempalace/**",
    "bots/**",
    "composio/**"
  ]),
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "react-hooks/exhaustive-deps": "off",
      "react-hooks/rules-of-hooks": "off",
      "react/no-unescaped-entities": "off",
      "@next/next/no-img-element": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/purity": "off",
      "@next/next/no-page-custom-font": "off",
      "@typescript-eslint/no-require-imports": "off"
    }
  }
]);

export default eslintConfig;