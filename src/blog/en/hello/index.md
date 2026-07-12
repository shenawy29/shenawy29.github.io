---
title: Hello World!
pubDate: 2025-08-09
tags: [tech]
slug: astro
---

> If a hammer is all you have, everything looks like a nail

This will probably be the first post on this blog.

If you ask most people to build a simple website, they’ll slowly gravitate toward React[^1], Angular, Vue, or one of the million other frameworks currently available.

Honestly, when I first thought about starting this blog, I turned to what I knew best: React. But then I thought about it a bit more and remembered reading about Astro. It’s designed for static sites, the kind that don’t require much interactivity.

Before I started, I had a few specific requirements:

1. The site needs to be fast. I’m literally not building anything amazing that would make it slow. It’s just HTML and CSS, nothing more.
2. Writing posts needs to be easy. If writing posts is difficult, I won’t feel motivated to write.
3. I need to build it quickly. I don’t want to start from scratch, but I do want to get things done!

I’m not going to explain Astro itself. If you want to learn more about it, the [documentation](https://docs.astro.build/en/getting-started/) explains it much better than I can. However, I’ll explain how Astro solves the problems I mentioned above.

## Fast

If you’re building a static site, you probably don’t need JavaScript. Or, to be more precise, the client doesn’t need JavaScript.

Astro is fast because, by default, it doesn’t send any JavaScript to the client. However, Astro works as a compiler. You write everything you want in `.astro` files, and in the end, this is converted into a small HTML file that’s sent to the client.

For example, take a look at this code. It’s the code that fetches all the posts on the [`/tags`](/tags) page. It’s empty right now, but it’ll fill up (hopefully).

```astro
---
import BaseLayout from "$lib/layouts/base_layout.astro";
import { getCollection } from "astro:content";

const pages = await getCollection("posts");

const tagMap = new Map();

for (const page of pages) {
    for (const tag of page.data.tags) {
        if (!tagMap.has(tag)) {
            tagMap.set(tag, []);
        }
        tagMap.get(tag).push(page);
    }
}

const uniqueTags = [...tagMap.keys()];
---

<BaseLayout>
    <h1>Tags</h1>
    {
        uniqueTags.map((tag) => (
            <div>
                <h2 id={tag}>
                    <span>#{tag}</span>
                </h2>
                <ul>
                    {tagMap.get(tag).map((post) => (
                        <li>
                            <a
                                href={`/${post.data.pubDate.toISOString().substring(0, 10)}/${post.id}`}
                            >
                                <span>
                                    {post.data.pubDate
                                        .toISOString()
                                        .substring(0, 10)}
                                </span>
                                <span>-</span>
                                <span>{post.data.title}</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        ))
    }
</BaseLayout>
```

What is this? Are you kidding me?! This is JavaScript! And what’s this, too? Two nested for loops!

This is $O(n \times t)$![^2] How could this possibly be fast?

You’re right… this isn’t exactly efficient… if it were executed at runtime. The idea is that Astro sees this code and converts everything to static HTML. Ultimately, it compiles the JavaScript you write and converts it to HTML & CSS. This way, Astro preserves the DX by letting you write in a scripting language, while at the same time preventing the client from sending it things it doesn’t need!

This contrasts with the concept behind popular frontend frameworks, where a single HTML page is dynamically updated by JavaScript (these are [Single-Page Applications](https://en.wikipedia.org/wiki/Single-page_application)).

Don’t believe me? Check the Network tab in Chrome DevTools. There aren’t even any JavaScript resources.

## Writing Posts Made Easy

One of the easiest languages you can use and learn [in literally an hour](https://www.markdownguide.org/basic-syntax/) is Markdown. It’s also one of the least known languages in terms of syntax, I don’t know why. It feels like everyone collectively decided decided to write their README files using AI.

Most of the time, you’ll write your content in Markdown in Astro, and that Markdown will eventually be converted to HTML so your browser can read it.

Why not just write in HTML from the start? You can do that, sure, but you’re basically punishing yourself. If given the choice, would you want to write this:

```html
<!doctype html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title></title>
    </head>
    <body>
        <h1>Hello, World!</h1>
    </body>
</html>
```

Or this?

```md
# Hello, World!
```

## Quick DX

I’m not a fan of building UIs. For me, it’s the most tedious part of writing any software. So I use tools that make it easier for me whenever I get the chance, and the first one I usually turn to is [Tailwind](https://tailwindcss.com/).

Another thing I might use is any component library that uses Tailwind. If I were using React or Next.js, I’d probably choose [ShadCn](https://ui.shadcn.com/), but I had a specific vision for how the blog would look, and unfortunately, I couldn’t find anything that matched exactly what I wanted and didn’t use JavaScript, so I had to write my own components from scratch (yikes).

It wasn’t too hard, though, because Astro also lets you create your own components. Any `.astro` file is considered a component from Astro’s perspective.

For example:

```astro
---
const { post } = Astro.props;
---

<div class="w-full">
    <div
        class="flex flex-wrap gap-x-3 divide-dotted text-xl text-wrap opacity-70"
    >
        <span class="text-wrap">
            {post.data.pubDate.toISOString().substring(0, 10)}
        </span>
        {
            post.data.tags.map((t) => (
                <>
                    <span> • </span>

                    <a href={`/tags#${t}`}>
                        <span>#{t}</span>
                    </a>
                </>
            ))
        }
    </div>
    <h1 class="mb-0">
        <a
            href={`/${post.data.pubDate.toISOString().substring(0, 10)}/${post.id}`}
        >
            {post.data.title}
        </a>
    </h1>
    <span class="italic">{post.data.subtitle}</span>
</div>
```

This is the code that displays the Title, Subtitle, Date, and Tags for each post. The component takes a `Post` prop and renders this information based on each post.

You can use it like this:

```astro
---
import { getCollection } from "astro:content";
import PostHeader from "./post-header.astro"; //[!code highlight]
const allPosts = await getCollection("posts");
---

<div class="flex h-full w-full flex-col gap-y-12">
    {
        allPosts
            .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime())
            .map((post) => (
                <div class="flex flex-col">{<PostHeader post={post} />}</div> //[!code highlight]
            ))
    }
</div>
```

You use it just like any other component you’ve used in your life (most likely).

## Conclusion

Astro isn’t the only Static Site Generator. There’s also [Jekyll](https://jekyllrb.com/), [11ty](https://www.11ty.dev/), [Hugo](https://gohugo.io/), and others. Of course, I haven’t used them all, and I might very well end up liking an SSG other than Astro, but it’s hard to imagine a developer experience (DX) easier than Astro’s.

I hope I’ve encouraged you to use Astro for a project, and if you do use it because of this post, send me a link!

[^1]: React is a library, not a framework… I know… I know.

[^2]: The "O" looks cool, right? These are Astro plugins [that it supports](https://docs.astro.build/en/guides/markdown-content/#markdown-plugins): [remark-math](https://github.com/remarkjs/remark-math/tree/main/packages/remark-math) and [rehype-katex](https://github.com/remarkjs/remark-math/tree/main/packages/rehype-katex). Astro also [supports syntax highlighting](https://docs.astro.build/en/guides/syntax-highlighting/) for code using [Shiki](https://shiki.style/) and [Prism](https://prismjs.com/).
