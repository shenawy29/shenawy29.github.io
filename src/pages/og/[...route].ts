import { OGImageRoute } from "astro-og-canvas";
import { getCollection } from "astro:content";

const arPosts = await getCollection("posts-ar");
const enPosts = await getCollection("posts-en");

const arPages = Object.fromEntries(
    arPosts.map((post) => [
        `ar/${post.data.slug}`,
        { ...post.data, locale: "ar" as const },
    ]),
);

const enPages = Object.fromEntries(
    enPosts.map((post) => [
        `en/${post.data.slug}`,
        { ...post.data, locale: "en" as const },
    ]),
);

const pages = { ...arPages, ...enPages };

export const { getStaticPaths, GET } = await OGImageRoute({
    param: "route",
    pages,

    getImageOptions: (_, page) => {
        const dir = page.locale === "ar" ? "rtl" : "ltr";

        const fonts = [
            "public/fonts/Cairo.woff2",
            "public/fonts/Rokkitt.woff2",
        ];

        if (page.custom) {
            return {
                dir,
                bgImage: { path: `public/bg/${page.slug}.png`, fit: "cover" },
                bgGradient: [[31, 31, 40]],
                title: page.title,
                description: page.description,
                fonts,
                font: {
                    title: {
                        color: [255, 160, 102],
                        families: ["Cairo", "Rokkitt SemiBold"],
                        size: 70,
                        lineHeight: 1.4,
                    },
                    description: {
                        color: [200, 192, 147],
                        families: ["Cairo", "Rokkitt SemiBold"],
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
            fonts,
            dir,

            font: {
                title: {
                    color: [255, 160, 102],
                    families: ["Cairo", "Rokkitt SemiBold"],
                    size: 70,
                    lineHeight: 1.4,
                },
                description: {
                    color: [200, 192, 147],
                    families: ["Cairo", "Rokkitt SemiBold"],
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
