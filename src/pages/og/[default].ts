import { OGImageRoute } from "astro-og-canvas";

export const { getStaticPaths, GET } = await OGImageRoute({
    param: "default",

    pages: {
        "default-ar": {
            title: "شناوي",
            description:
                "بلوج محمد الشناوي للبرمجة، التكنولوجيا، وأشياء طريفة أخرى.",
            locale: "ar",
        },
        "default-en": {
            title: "Shenawy",
            description:
                "Mohamed Elshenawy's blog for programming, tech, and other fun things.",
            locale: "en",
        },
    },

    getImageOptions: (_, page) => {
        const isAr = page.locale === "ar";
        return {
            title: page.title,
            description: page.description,
            dir: isAr ? "rtl" : "ltr",

            font: {
                title: {
                    color: [255, 160, 102],
                    families: [
                        isAr ? "Cairo" : "Rokkitt SemiBold",
                        "Fira Code Light",
                    ],
                    size: 70,
                    lineHeight: 1.4,
                },
                description: {
                    color: [200, 192, 147],
                    families: [
                        isAr ? "Cairo" : "Rokkitt SemiBold",
                        "Fira Code Light",
                    ],
                    size: 40,
                },
            },

            bgGradient: [[31, 31, 40]],
            border: {
                color: [126, 156, 216],
                width: 10,
            },

            fonts: [
                "./public/fonts/Cairo.woff2",
                "./public/fonts/Rokkitt.woff2",
                "./public/fonts/FiraCode.woff2",
            ],
        };
    },
});
