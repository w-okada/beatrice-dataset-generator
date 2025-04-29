import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import reactPlugin from "eslint-plugin-react";
import prettierPlugin from "eslint-plugin-prettier";

export default tseslint.config(
    { ignores: ["dist", "**/*.test.ts", "**/*.test.tsx"] },
    {
        files: ["**/*.{ts,tsx}"],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
                ecmaVersion: 13,
                sourceType: "module",
            },
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        plugins: {
            "@typescript-eslint": tseslint,
            "react-hooks": reactHooks,
            "react-refresh": reactRefresh,
            react: reactPlugin,
            prettier: prettierPlugin,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
        },
    }
);
