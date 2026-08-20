export const locales = ["ar", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ar";

export const translations: Record<Locale, Record<string, string>> = {
    ar: {
        "site.title": "شناوي",
        "site.description":
            "بلوج محمد الشناوي للبرمجة، التكنولوجيا، وأشياء طريفة أخرى.",
        "nav.home": "العمومي",
        "nav.cv": "CV",
        "nav.syllabus": "منهج",
        "nav.about": "عني",
        "nav.tags": "تاجژ",
        "nav.analytics": "أناليتكس",
        "footer.analytics": "أناليتكس",
        "footer.attribution": "محمد الشناوي",
        "tags.title": "تاجژ",
        "post.translation_pending": "ترجمة قادمة...",
        "post.words": "كلمة",
        "post.minutes": "دقيقة",
        lang_switch: "En",
    },
    en: {
        "site.title": "shenawy",
        "site.description":
            "Mohamed Elshenawy's blog for programming, tech, and other fun things.",
        "nav.home": "Home",
        "nav.cv": "CV",
        "nav.syllabus": "Syllabus",
        "nav.about": "About",
        "nav.tags": "Tags",
        "nav.analytics": "Analytics",
        "footer.analytics": "Site Analytics",
        "footer.attribution": "Mohamed Elshenawy",
        "tags.title": "Tags",
        "post.translation_pending": "Translation pending...",
        "post.words": "words",
        "post.minutes": "minutes",
        lang_switch: "ع",
    },
};
