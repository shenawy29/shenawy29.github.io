export const locales = ["ar", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ar";

export const translations: Record<Locale, Record<string, string>> = {
    ar: {
        "site.title": "شناوي",
        "site.description":
            "بلوج محمد الشناوي للبرمجة، التكنولوجيا، وأشياء طريفة أخرى.",
        "nav.home": "العمومي",
        "nav.cv": "سي ڤي",
        "nav.syllabus": "منهج",
        "nav.about": "عني",
        "nav.tags": "تاجژ",
        "nav.analytics": "أناليتكس",
        "tags.title": "تاجژ",
        "post.translation_pending": "ترجمة قادمة...",
        lang_switch: "En",
    },
    en: {
        "site.title": "Shenawy",
        "site.description":
            "Mohamed Shenawy's blog for programming, tech, and other fun things.",
        "nav.home": "Home",
        "nav.cv": "CV",
        "nav.syllabus": "Syllabus",
        "nav.about": "About",
        "nav.tags": "Tags",
        "nav.analytics": "Analytics",
        "tags.title": "Tags",
        "post.translation_pending": "Translation pending...",
        lang_switch: "ع",
    },
};
