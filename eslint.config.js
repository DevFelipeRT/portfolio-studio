import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import json from "@eslint/json";
import markdown from "@eslint/markdown";
import css from "@eslint/css";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
  {
    ignores: ["**/*.md"],
  },
  {
    languageOptions: { globals: globals.browser },
    settings: { react: { version: "detect" } },
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  pluginReact.configs.flat["jsx-runtime"],
  {
    plugins: { "react-hooks": pluginReactHooks },
    rules: pluginReactHooks.configs.recommended.rules,
  },
  {
    rules: {
      "react/prop-types": "off",
    },
  },
  {
    files: ["resources/js/**/*.{ts,tsx}"],
    ignores: [
      "resources/js/app/bootstrap/**/*",
      "resources/js/app/pages/**/*",
      "resources/js/common/page-runtime/adapters/inertia/**/*",
      "resources/js/types/global.d.ts",
      "resources/js/modules/profile/ui/**/*",
    ],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@inertiajs/react",
              message:
                "Use '@/common/page-runtime' for runtime access, or keep framework wiring inside app/bootstrap and the Inertia adapter.",
            },
            {
              name: "@inertiajs/core",
              message:
                "Keep direct Inertia core imports inside app/bootstrap or common/page-runtime/adapters/inertia.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["**/*.json"],
    language: "json/json",
    ...json.configs.recommended,
  },
  {
    files: ["**/*.jsonc"],
    language: "json/jsonc",
    ...json.configs.recommended,
  },
  {
    files: ["**/*.json5"],
    language: "json/json5",
    ...json.configs.recommended,
  },
  ...markdown.configs.recommended,
  {
    files: ["**/*.css"],
    language: "css/css",
    ...css.configs.recommended,
  },
  eslintConfigPrettier,
];
