import { OGImageRoute } from "astro-og-canvas";

export const { getStaticPaths, GET } = await OGImageRoute({
    param: "default",

    pages: {
        default: {
            title: "شناوي",
            description:
                "بلوج محمد الشناوي للبرمجة، التكنولوجيا، وأشياء طريفة أخرى.",
        },
    },

    getImageOptions: (_, page) => ({
        title: page.title,
        description: page.description,
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

        fonts: ["./public/fonts/Cairo.woff2", "./public/fonts/FiraCode.woff2"],
    }),
});
