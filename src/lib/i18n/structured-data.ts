const site = "https://shenawy29.github.io";
const authorName = "Mohamed Elshenawy";
const personId = `${site}#person`;
const websiteId = `${site}#website`;

const person = {
    "@type": "Person",
    "@id": personId,
    name: authorName,
    url: site,
};

function fmtDate(d: Date): string {
    return d.toISOString().substring(0, 10) + "T00:00:00Z";
}

export function websiteData(locale: string, name: string, description: string) {
    return {
        "@type": "WebSite",
        "@id": websiteId,
        name,
        description,
        url: `${site}/${locale}/`,
        inLanguage: locale,
        author: person,
        publisher: person,
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
) {
    return {
        "@type": "BlogPosting",
        headline,
        ...(description ? { description } : {}),
        image: site + image,
        url: site + url,
        datePublished: fmtDate(datePublished),
        dateModified: fmtDate(dateModified ?? datePublished),
        keywords: keywords.join(", "),
        author: person,
        publisher: person,
        inLanguage: locale,
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": site + url,
        },
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
