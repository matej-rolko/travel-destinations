import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

/** @type { import("eslint").Linter.Config[] } */
export default [
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    { files: ["**/*.{js,mjs,cjs,ts}"] },
    { ignores: ["dist/"] },
    { languageOptions: { globals: globals.node } },
    {
        rules: {
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    args: "all",
                    argsIgnorePattern: "^_",
                    caughtErrors: "all",
                    caughtErrorsIgnorePattern: "^_",
                    destructuredArrayIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                    ignoreRestSiblings: true,
                },
            ],
        },
    },
];
