import { translations, locales, defaultLocale, type Locale } from "./translations";

export function getLocale(pathname: string): Locale {
    const segments = pathname.split("/").filter(Boolean);
    const first = segments[0];
    if (locales.includes(first as Locale)) {
        return first as Locale;
    }
    return defaultLocale;
}

export function useTranslations(locale: Locale) {
    return (key: string): string => {
        return translations[locale][key] ?? translations[defaultLocale][key] ?? key;
    };
}

export function getLocalizedPath(path: string, locale: Locale): string {
    const clean = path.startsWith("/") ? path : `/${path}`;
    if (locale === defaultLocale) {
        return `/ar${clean}`;
    }
    return `/en${clean}`;
}

export function getAlternateLocalePath(path: string, currentLocale: Locale): string {
    const clean = path.startsWith("/") ? path : `/${path}`;
    const stripped = clean.replace(new RegExp(`^/${currentLocale}`), "") || "/";
    const otherLocale = currentLocale === "ar" ? "en" : "ar";
    if (otherLocale === defaultLocale) {
        return `/ar${stripped}`;
    }
    return `/en${stripped}`;
}

export { type Locale, locales, defaultLocale };
