import { defineCollection, z } from "astro:content";

import { glob } from "astro/loaders";

const posts = defineCollection({
    loader: glob({ pattern: "./**/*.md", base: "./src/blog" }),

    schema: z.object({
        layout: z.string(),
        title: z.string(),
        subtitle: z.string(),
        pubDate: z.date(),
        tags: z.array(z.string()),
        slug: z.string(),
    }),
});

export const collections = { posts };
