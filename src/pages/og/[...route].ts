import { OGImageRoute } from "astro-og-canvas";
import { getCollection } from "astro:content";

const posts = await getCollection("posts");

const pages = Object.fromEntries(
    posts.map((post) => [post.data.slug, post.data]),
);

export const { getStaticPaths, GET } = await OGImageRoute({
    param: "route",
    pages,

    getImageOptions: (_, page) => {
        if (page.custom) {
            return {
                dir: "rtl",
                bgImage: { path: `public/bg/${page.slug}.png`, fit: "cover" },
                bgGradient: [[31, 31, 40]],
                title: page.title,
                fonts: ["public/fonts/Cairo.woff2"],
                font: {
                    title: {
                        color: [255, 160, 102],
                        families: ["Cairo", "Fira Code"],
                        size: 70,
                        lineHeight: 1.4,
                    },
                    description: {
                        color: [200, 192, 147],
                        families: ["Cairo", "Fira Code"],
                        size: 40,
                    },
                },
                border: {
                    color: [126, 156, 216],
                    width: 10,
                },
            };
        }
        return {
            title: page.title,
            description: page.description,
            fonts: ["public/fonts/FiraCode.woff2", "public/fonts/Cairo.woff2"],
            dir: "rtl",

            font: {
                title: {
                    color: [255, 160, 102],
                    families: ["Cairo", "Fira Code"],
                    size: 70,
                    lineHeight: 1.4,
                },
                description: {
                    color: [200, 192, 147],
                    families: ["Cairo", "Fira Code"],
                    size: 40,
                },
            },

            bgGradient: [[31, 31, 40]],
            border: {
                color: [126, 156, 216],
                width: 10,
            },
        };
    },
});
