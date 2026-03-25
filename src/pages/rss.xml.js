import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { getContainerRenderer as getMDXRenderer } from "@astrojs/mdx";
import { loadRenderers } from "astro:container";
import { getCollection, render } from "astro:content";
import sanitizeHtml from "sanitize-html";
import rss from "@astrojs/rss";

export async function GET(context) {
    const renderers = await loadRenderers([getMDXRenderer()]);
    const container = await AstroContainer.create({ renderers });
    const posts = await getCollection("posts");

    const items = [];
    for (const post of posts) {
        const { Content } = await render(post);
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
        const link = new URL(
            `/${post.data.pubDate.toISOString().substring(0, 10)}/${post.id}`,
            context.url.origin,
        ).toString();
        items.push({ ...post.data, link, content });
    }

    return rss({
        title: "My blog",
        description: "All my thoughts",
        site: context.site,
        items,

        xmlns: {
            atom: "http://www.w3.org/2005/Atom",
        },

        customData: `
<language>ar</language>
<atom:link href="${context.site}rss.xml" rel="self" type="application/rss+xml" xmlns:atom="http://www.w3.org/2005/Atom" />,
    `,
    });
}
