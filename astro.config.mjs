// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import remarkEmoji from "remark-emoji";
import remarkMath from "remark-math";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import rehypeKatex from "rehype-katex";
import robotsTxt from "astro-robots-txt";

import {
    transformerNotationDiff,
    transformerNotationHighlight,
    transformerNotationWordHighlight,
    transformerNotationFocus,
    transformerNotationErrorLevel,
    transformerMetaHighlight,
    transformerMetaWordHighlight,
} from "@shikijs/transformers";

import sitemap from "@astrojs/sitemap";

export default defineConfig({
    site: "https://shenawy29.github.io",

    fonts: [
        {
            provider: fontProviders.local(),
            name: "Cairo",
            cssVariable: "--font-cairo",
            options: {
                variants: [
                    {
                        src: ["./public/fonts/Cairo.woff2"],
                        unicodeRange: [
                            "U+0600-06FF",
                            "U+FB50-FDFF",
                            "U+FE70-FEFF",
                        ],
                    },
                ],
            },
        },

        {
            provider: fontProviders.local(),
            name: "FiraCode",
            cssVariable: "--font-fira",
            options: {
                variants: [
                    {
                        src: ["./public/fonts/FiraCode.woff2"],
                    },
                ],
            },
        },
    ],

    security: { csp: true },

    vite: {
        build: {
            sourcemap: true,
        },
        plugins: [tailwindcss()],
    },

    integrations: [mdx(), sitemap(), robotsTxt()],

    i18n: {
        locales: ["en", "eg-ar"],
        defaultLocale: "en",
        routing: {
            prefixDefaultLocale: false,
        },
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
