// @ts-check
import { execSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import {
    defineConfig,
    fontProviders,
} from "astro/config";
import remarkEmoji from "remark-emoji";
import remarkMath from "remark-math";
import tailwindcss from "@tailwindcss/vite";
import { unified } from "@astrojs/markdown-remark";
import mdx from "@astrojs/mdx";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
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
import { EnumChangefreq } from "sitemap";
import { remarkModifiedTime } from "./remark-modified-time.mjs";
import { rehypeExcerpt } from "./rehype-excerpt.mjs";

const ROOT = fileURLToPath(new URL(".", import.meta.url));

function buildGitDateMap() {
    /** @type {Record<string, string>} */
    const map = {};
    for (const locale of ["ar", "en"]) {
        const dir = join(ROOT, "src", "blog", locale);
        let entries;
        try { entries = readdirSync(dir); } catch { continue; }
        for (const entry of entries) {
            if (entry.startsWith(".")) continue;
            let fullPath, content;
            for (const ext of [".md", ".mdx"]) {
                const p = join(dir, entry, `index${ext}`);
                try {
                    content = readFileSync(p, "utf-8");
                    fullPath = p;
                    break;
                } catch {}
            }
            if (!content) continue;

            const pubDateMatch = content.match(/^pubDate:\s*(.+)$/m);
            const slugMatch = content.match(/^slug:\s*(.+)$/m);
            if (!pubDateMatch || !slugMatch) continue;

            const pubDate = pubDateMatch[1].replace(/^["']|["']$/g, "").trim().substring(0, 10);
            const slug = slugMatch[1].replace(/^["']|["']$/g, "").trim();

            try {
                const result = execSync(`git log -1 --pretty="format:%cI" "${fullPath}"`, { encoding: "utf-8" });
                const dateStr = result.trim();
                if (dateStr) {
                    const d = new Date(dateStr);
                    /** @type {Record<string, string>} */
                    map[`/${locale}/${pubDate}/${slug}/`] = d.toISOString().replace(/\.\d{3}Z$/, "Z");
                }
            } catch {
                // git log failed (e.g. file not tracked, shallow clone) — skip
            }
        }
    }
    return map;
}

/** @type {Record<string, string>} */
let gitDateMap = {};
try { gitDateMap = buildGitDateMap(); } catch {}

export default defineConfig({
    site: "https://shenawy29.github.io",
    fonts: [
        {
            provider: fontProviders.local(),
            name: "Vazirmatn",
            cssVariable: "--font-vazirmatn",
            options: {
                variants: [
                    {
                        weight: "100 900",
                        style: "normal",
                        src: ["./public/fonts/Vazirmatn.woff2"],
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
                        weight: "400",
                        style: "normal",
                        src: ["./public/fonts/FiraCode.woff2"],
                    },
                ],
            },
        },
        {
            provider: fontProviders.local(),
            name: "FiraCodeNerdFont",
            cssVariable: "--font-fira-nerd",
            options: {
                variants: [
                    {
                        weight: "400",
                        style: "normal",
                        src: ["./public/fonts/FiraCodeNerdFont-Regular.woff2"],
                    },
                ],
            },
        },
        {
            provider: fontProviders.local(),
            name: "Cairo",
            cssVariable: "--font-cairo",
            options: {
                variants: [
                    {
                        weight: "700",
                        style: "normal",
                        src: ["./public/fonts/Cairo.woff2"],
                    },
                ],
            },
        },

        {
            provider: fontProviders.local(),
            name: "Rokkitt",
            cssVariable: "--font-rokkitt",
            options: {
                variants: [
                    {
                        weight: "100 900",
                        style: "normal",
                        src: ["./public/fonts/Rokkitt.woff2"],
                    },
                ],
            },
            fallbacks: ["Cairo"],
        },
    ],

    security: { csp: false },

    vite: {
        build: {
            sourcemap: true,
        },
        plugins: [tailwindcss()],
    },

    integrations: [
        mdx(),
        sitemap({
            i18n: {
                defaultLocale: "ar",
                locales: {
                    ar: "ar",
                    en: "en",
                },
            },
            filter: (page) => {
                const u = new URL(page);
                const path = u.pathname;
                if (path === "/") return false;
                if (path.endsWith("/404/")) return false;
                if (path.endsWith("/404")) return false;
                return true;
            },
            serialize: (page) => {
                const u = new URL(page.url);
                const path = u.pathname;
                const gitMod = gitDateMap[path];
                const m = path.match(
                    /^\/(?:ar|en)\/(\d{4}-\d{2}-\d{2})\//,
                );
                const entry = { url: page.url, links: page.links };
                if (gitMod) {
                    return {
                        ...entry,
                        lastmod: gitMod,
                        changefreq: EnumChangefreq.MONTHLY,
                        priority: 0.8,
                    };
                }
                if (m) {
                    return {
                        ...entry,
                        lastmod: m[1] + "T00:00:00Z",
                        changefreq: EnumChangefreq.MONTHLY,
                        priority: 0.8,
                    };
                }
                return {
                    ...entry,
                    changefreq: EnumChangefreq.WEEKLY,
                    priority: 0.5,
                };
            },
        }),
        robotsTxt(),
    ],

    i18n: {
        locales: ["ar", "en"],
        defaultLocale: "ar",
        routing: {
            prefixDefaultLocale: true,
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

        processor: unified({
            remarkPlugins: [remarkMath, remarkEmoji, remarkModifiedTime],
            rehypePlugins: [
                rehypeSlug,
                [
                    rehypeAutolinkHeadings,
                    { behavior: "wrap", ariaHidden: true },
                ],
                [rehypeKatex, { output: "mathml" }],
                rehypeExcerpt,
            ],
        }),
    },
});
