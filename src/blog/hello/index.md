---
layout: ../../lib/layouts/base_layout.astro
title: هيللو وورلد!
subtitle: طعم من استرو
pubDate: 2025-08-09
tags: [tech]
slug: astro
---

> إن كانت المطرقة هي كل ما بيدك، فسترى كل الأشياء مسامير

دا غالباً هيبقى اول بوست فالبلوج دي.

معظم الناس لو طلبت منهم يعملوا موقع بسيط، هيقربوا ببطء لReact[^1] ، Angular، Vue، او الخمسوميت فريم وورك اللي موجودين حالياً.

بصراحة، اول لما جيت افكر اعمل البلوج دي اتجهت للحاجة اللي انا اعرفها، React. بس، بعدها بدأت افكر شوية وافتكرت اني كنت قريت عن استرو وانه يعتبر مخصص للStatic Sites، حاجات مش محتاجة Interactivity كتير.

قبل مابدأ، انا كنت محتاج حاجات معينة:

1. محتاج ان الموقع يكون سريع. انا حرفياً مش بعمل حاجة مذهلة لأنه يكون بطيء، هو كل اللي بتشوفه HTML و CSS مش اكتر.
2. محتاج ان كتابة البوستس تكون سهلة. لو كتابة البوستس صعبة، مش هيبقى عندي شغف اني اكتب.
3. محتاج اني اعملة بسرعة. مش عايز ابدأ من الصفر، ولكن عايز انجز يعني!

انا مش هشرح استرو نفسه، لو عايز تتعلم اكتر عنه ال[documentation](https://docs.astro.build/en/getting-started/) هتشرح احسن مني بكتير. بس، انا هشرح ازاي استرو حل المشاكل اللي اتكلمت عليها فوق.

## سريع

لو بتعمل Static Site، فانت غالباً مش محتاج JavaScript. او بمعنى اصح، الClient مش محتاج JavaScript.

استرو سريع عشان هو By default مش بيبعت اي JavaScript للClient. ولكن، استرو بيشتغل كCompiler. بتكتب كل كل ما تريد في ملفات `astro.`، وفالاخر دا بيتحول لملف HTML صغير يتبعت للClient.

كمثال، بص عالكود دا، دا الكود اللي بيجيب كل البوستس في صفحة [`tags/`](/tags). هي فاضية دلوقت، بس هتتملي (اتمنى).

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
    <h1>تاجژ</h1>
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

اية دا؟ انت بتضحك عليا؟! دي JavaScript اهي! واية دا كمان؟ 2 for loop جوا بعض!

دي $ O(n \times t) $![^2] ازاي ممكن يكون سريع؟

عندك حق... دا مش اكتر حاجة Efficient...لو دا بيتعمل At runtime. الفكرة ان استرو بيشوف الكود دا، وبيحول كل حاجة لStatic HTML. مالاخر، بيعمل Compile للJavaScript اللي بتكتبه، وبيحوله لHTML & CSS. بالطريقة دي، استرو بيحفظ الDX بأنه يسيبك تكتب لغة للScripting، وفنفس الوقت مبيعاقبش الClient بأنه يبعتله حاجات هو مش محتاجها!

دا بيواجه الفكرة بتاعت الFrontend Frameworks المشهورة، صفحة واحدة HTML وJavaScript تغير الHTML بطريقة Dynamic (دي ال [Single-Page Applications](https://en.wikipedia.org/wiki/Single-page_application))

مش مصدقني؟ ادخل عالNetwork Tab في الChrome Devtools. مفيش ولا JavaScript Resource.

## كتابة بوستس سهلة

من اكتر اللغات السهلة اللي ممكن تتعملها [في ساعة حرفياً](https://www.markdownguide.org/basic-syntax/) هي Markdown. وهي برضو من اكتر اللغات اللي الناس متعرفهاش، مش عارف لية. تحس ان البني ادمين كلهم قرروا يكتبوا الReadMe بتاعتهم بالAI.

غالباً، الكونتنت بتاعتك هتكتبها بMarkdown في استرو، والMarkdown دا هيتحول لHTML فالاخر عشان الBrowser بتاعك يقدر يقراه.

لية مكتبش بHTML على طول؟ انت ممكن تعمل كدا عادي، بس انت يعتبر بتعاقب نفسك. لو خيروك، هتحب تكتب دا:

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

ولا دا؟

```md
# Hello, World!
```

## DX سريعة

انا شخص مبحبش اعمل UI. بالنسبالي اكتر جزء مضجر في كتابة اي Software. فابستعمل ادوات بتسهللي الموضوع لو جاتلي الفرصة، اولهم غالباً هي [Tailwind](https://tailwindcss.com/).

تاني حاجة ممكن استعملها هي اي Component Library بتستعمل Tailwind. لو كنت بستعمل React او Next، كنت غالباً هختار [ShadCn](https://ui.shadcn.com/) ، بس انا كان عندي نظره لشكل الBlog هيبقى عامل ازاي، وللأسف ملقتش حاجة بنفس الشكل اللي انا عايزه ومبتستعملش JavaScript، فاضطريت اكتب الComponents بتاعتي بايدي (رعب).

الموضوع مكنش صعب اوي، عشان استرو برضو بيتيحلك انك تعمل الComponents بتاعتك. اي ملف `astro.` يعتبر Component من وجهه نظر استرو.

دا مثلاً:

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

دا الكود اللي بيظهر الTitle - Subtitle - Date - Tags بتاعت كل بوست. الComponent بياخد Prop من النوع Post و بيRender دا على حسب كل بوست.

ممكن تستعمله كدا:

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

بتستعمله زي اي Component استعملته في حياتك (غالباً).

## الناهية

استرو مش الStatic Site Generator الوحيد، في [Jekyll](https://jekyllrb.com/)، [11ty](https://www.11ty.dev/)، [Hugo](https://gohugo.io/) و غيرهم. طبعاً انا مستعملتهمش كلهم، ووارد جداً احب SSG غير استرو، ولكن صعب اتخيل DX اسهل من استرو.

اتمنى اني اكون شجعتك انك تستعمل استرو في مشروع ما، ولو استعملته بسبب البوست دا ابعتلي لينك!

[^1]: رياكت Library مش Framework....عارف...عارف.

[^2]: حلو شكل الO صح؟ دي Plugins استرو [بيدعمها](https://docs.astro.build/en/guides/markdown-content/#markdown-plugins): [remark-math](https://github.com/remarkjs/remark-math/tree/main/packages/remark-math) و [rehype-katex](https://github.com/remarkjs/remark-math/tree/main/packages/rehype-katex). استرو برضو [بيدعم Syntax Highlighting](https://docs.astro.build/en/guides/syntax-highlighting/) في الكود ب [Shiki](https://shiki.style/) و [Prism](https://prismjs.com/).
