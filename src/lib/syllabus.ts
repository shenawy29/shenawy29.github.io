export interface SyllabusItem {
    authors?: string;
    title: string;
    href?: string;
    publisher?: string;
    commentary?: { en: string; ar: string };
}

export interface SyllabusCategory {
    id: string;
    title: { en: string; ar: string };
    note?: { en: string; ar: string };
    items: SyllabusItem[];
}

export const syllabus: SyllabusCategory[] = [
    {
        id: "programming-languages",
        title: { en: "Programming Languages", ar: "لغات برمجة" },
        items: [
            {
                authors: "Albing, C & Vossen, JP",
                title: "Bash Idioms",
                href: "https://www.oreilly.com/library/view/bash-idioms/9781492094746/",
                publisher: "O'Reilly, 2022",
                commentary: {
                    en: "Small book, approximately 167 pages, but you won't find anything better for learning shell scripting.",
                    ar: "كتاب صغير, 167 صفحة تقريباً, بس مش هتلاقي حاجة احسن تعلمك Shell Scripting.",
                },
            },
        ],
    },
];
