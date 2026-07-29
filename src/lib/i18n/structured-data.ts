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

function ref(id: string) {
    return { "@id": id };
}

export function websiteData(locale: string, name: string, description: string) {
    return {
        "@type": "WebSite",
        "@id": websiteId,
        name,
        description,
        url: `${site}/${locale}/`,
        inLanguage: locale,
        author: ref(personId),
        publisher: ref(personId),
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
        datePublished: datePublished.toISOString().substring(0, 10),
        dateModified: (dateModified ?? datePublished)
            .toISOString()
            .substring(0, 10),
        keywords: keywords.join(", "),
        author: ref(personId),
        publisher: ref(personId),
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
        mainEntity: ref(personId),
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
