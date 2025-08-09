// @ts-check
import { defineConfig } from "astro/config";
import remarkEmoji from "remark-emoji";
import remarkMath from "remark-math";
import tailwindcss from "@tailwindcss/vite";
import rehypeKatex from "rehype-katex";

import {
    transformerNotationDiff,
    transformerNotationHighlight,
    transformerNotationWordHighlight,
    transformerNotationFocus,
    transformerNotationErrorLevel,
    transformerMetaHighlight,
    transformerMetaWordHighlight,
} from "@shikijs/transformers";

// https://astro.build/config
export default defineConfig({
    site: "https://shenawy29.github.io",

    vite: {
        plugins: [tailwindcss()],
    },

    markdown: {
        syntaxHighlight: "shiki",
        shikiConfig: {
            theme: "kanagawa-wave",
            transformers: [
                transformerNotationDiff(),
                transformerNotationHighlight(),
                transformerNotationWordHighlight(),
                transformerNotationFocus(),
                transformerNotationErrorLevel(),
                transformerMetaHighlight(),
                transformerMetaWordHighlight(),
            ],
        },

        remarkPlugins: [remarkMath, remarkEmoji],
        rehypePlugins: [[rehypeKatex, { output: "mathml" }]],
    },
});
