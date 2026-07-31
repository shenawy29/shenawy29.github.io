const WORDS_PER_MINUTE = 200;

export function wordCountOf(body: string): number {
    return body.trim().split(/\s+/).length;
}

export function readingTimeMinutes(wordCount: number): number {
    return Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE));
}
