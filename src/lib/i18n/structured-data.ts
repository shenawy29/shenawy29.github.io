import { readingTimeMinutes } from "$lib/reading-time";

const site = "https://shenawy29.github.io";
const authorName = "Mohamed Elshenawy";
const personId = `${site}#person`;
const websiteId = `${site}#website`;

const person = {
    "@type": "Person",
    "@id": personId,
    name: authorName,
    url: site,
    image: `${site}/og/default-en.png`,
    sameAs: ["https://github.com/shenawy29/", "https://x.com/MoeElshenawy04"],
};

function fmtDate(d: Date): string {
    return d.toISOString().substring(0, 10) + "T00:00:00Z";
}

export function personData() {
    return person;
}

export function websiteData(locale: string, name: string, description: string) {
    return {
        "@type": "WebSite",
        "@id": websiteId,
        name,
        description,
        url: `${site}/${locale}/`,
        inLanguage: locale,
    };
}

export function blogPostingData(
    locale: string,
    headline: string,
    description: string | undefined,
    image: string,
    url: string,
    datePublished: Date,
    dateModified: Date | undefined,
    keywords: string[],
    wordCount: number,
) {
    const minutes = readingTimeMinutes(wordCount);
    return {
        "@type": "BlogPosting",
        "@id": site + url,
        headline,
        ...(description ? { description } : {}),
        image: site + image,
        thumbnailUrl: site + image,
        url: site + url,
        datePublished: fmtDate(datePublished),
        dateModified: fmtDate(dateModified ?? datePublished),
        wordCount,
        timeRequired: `PT${minutes}M`,
        keywords: keywords.join(", "),
        articleSection: keywords[0],
        author: person,
        publisher: person,
        inLanguage: locale,
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": site + url,
        },
        isPartOf: {
            "@id": websiteId,
        },
    };
}

export function breadcrumbData(
    locale: string,
    items: { name: string; url: string }[],
) {
    return {
        "@type": "BreadcrumbList",
        inLanguage: locale,
        itemListElement: items.map((item, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: item.name,
            item: site + item.url,
        })),
    };
}

export function collectionPageData(
    locale: string,
    name: string,
    url: string,
) {
    return {
        "@type": "CollectionPage",
        name,
        url: site + url,
        inLanguage: locale,
    };
}

export function profilePageData(
    locale: string,
    name: string,
    description: string,
    url: string,
) {
    return {
        "@type": "ProfilePage",
        name,
        description,
        url: site + url,
        inLanguage: locale,
        mainEntity: person,
    };
}

export function webPageData(locale: string, name: string, url: string) {
    return {
        "@type": "WebPage",
        name,
        url: site + url,
        inLanguage: locale,
    };
}
