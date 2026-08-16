import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { getContainerRenderer } from "@astrojs/mdx/container-renderer";
import { loadRenderers } from "astro:container";
import { getCollection, render } from "astro:content";
import sanitizeHtml from "sanitize-html";
import rss from "@astrojs/rss";

export async function GET(context) {
    const renderers = await loadRenderers([getContainerRenderer()]);
    const container = await AstroContainer.create({ renderers });

    const url = new URL(context.url);
    const locale = url.pathname.startsWith("/en") ? "en" : "ar";
    const collectionName = locale === "ar" ? "posts-ar" : "posts-en";

    const allPosts = await getCollection(collectionName);
    const posts = allPosts.sort(
        (a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime(),
    );

    const siteUrl = locale === "ar"
        ? `${context.site?.origin ?? ""}/ar`
        : `${context.site?.origin ?? ""}/en`;

    const title = locale === "ar" ? "بلوج شناوي" : "Shenawy's Blog";
    const description = locale === "ar"
        ? "كل الافكار بتاعتي"
        : "All my thoughts";
    const language = locale === "ar" ? "ar" : "en";

    const items = [];
    for (const post of posts) {
        const { Content, remarkPluginFrontmatter } = await render(post);
        const raw = await container.renderToString(Content);
        const content = sanitizeHtml(raw, {
            allowedTags: [
                "p",
                "b",
                "i",
                "em",
                "strong",
                "a",
                "ul",
                "ol",
                "li",
                "blockquote",
                "code",
                "pre",
                "br",
                "hr",
                "h1",
                "h2",
                "h3",
                "h4",
                "h5",
                "h6",
                "img",
                "span",
                "math",
                "mi",
                "mn",
                "mo",
                "ms",
                "mrow",
            ],
            allowedAttributes: {
                a: ["href", "name", "target", "rel"],
                img: ["src", "alt", "title"],
                "*": ["class"],
            },
            allowedSchemes: ["http", "https", "mailto"],
            disallowedTagsMode: "discard",
        });
        const link = `${siteUrl}/${post.data.pubDate.toISOString().substring(0, 10)}/${post.id}`;
        items.push({ ...post.data, link, content, description: remarkPluginFrontmatter.excerpt });
    }

    return rss({
        title,
        description,
        site: siteUrl,
        items,

        xmlns: {
            atom: "http://www.w3.org/2005/Atom",
        },

        customData: `
<language>${language}</language>
<atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" xmlns:atom="http://www.w3.org/2005/Atom" />
    `,
    });
}
