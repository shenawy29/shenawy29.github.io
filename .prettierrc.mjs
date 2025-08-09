// .prettierrc.mjs
/** @type {import("prettier").Config} */

export default {
    tabWidth: 4,
    semi: true,
    singleQuote: false,
    plugins: ["prettier-plugin-astro", "prettier-plugin-tailwindcss"],
    pluginSearchDirs: false,
    overrides: [
        {
            files: "*.astro",
            options: {
                parser: "astro",
            },
        },
    ],

    tailwindStylesheet: "./src/lib/styles/global.css",
};
