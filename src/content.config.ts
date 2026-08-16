import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const postsAr = defineCollection({
    loader: glob({ pattern: ["**/*.md", "**/*.mdx"], base: "src/blog/ar" }),

    schema: z.object({
        title: z.string(),
        pubDate: z.date(),
        tags: z.array(z.string()),
        keywords: z.array(z.string()).optional(),
        slug: z.string(),
        ogSubtitle: z.string().optional(),
        custom: z.boolean().optional().default(false),
    }),
});

const postsEn = defineCollection({
    loader: glob({ pattern: ["**/*.md", "**/*.mdx"], base: "src/blog/en" }),

    schema: z.object({
        title: z.string(),
        pubDate: z.date(),
        tags: z.array(z.string()),
        keywords: z.array(z.string()).optional(),
        slug: z.string(),
        ogSubtitle: z.string().optional(),
        custom: z.boolean().optional().default(false),
    }),
});

export const collections = { "posts-ar": postsAr, "posts-en": postsEn };
