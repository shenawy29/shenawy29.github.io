import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";

const ROOT = join(dirname(new URL(import.meta.url).pathname), "..");
const PORT = process.env.PORT ?? "4399";
const BASE = `http://127.0.0.1:${PORT}`;
const WIDTH = 1200;
const HEIGHT = 630;
const SKIP_EXISTING = ["1", "true", "yes"].includes(
    process.env.SKIP_EXISTING?.toLowerCase(),
);

const STATIC = {
    en: {
        index: "/en/",
        about: "/en/about",
        syllabus: "/en/syllabus",
        tags: "/en/tags",
    },
    ar: {
        index: "/ar/",
        about: "/ar/about",
        syllabus: "/ar/syllabus",
        tags: "/ar/tags",
    },
};

function findChrome() {
    const candidates = [
        process.env.CHROME_PATH,
        "/run/current-system/sw/bin/google-chrome",
        "/run/current-system/sw/bin/google-chrome-stable",
        "/run/current-system/sw/bin/chromium",
        "/usr/bin/google-chrome",
        "/usr/bin/chromium",
        "/usr/bin/chromium-browser",
    ].filter(Boolean);
    return candidates.find((p) => {
        try {
            readFileSync(p);
            return true;
        } catch {
            return false;
        }
    });
}

function postFile(dir) {
    const candidate = ["index.md", "index.mdx"].map((f) => join(dir, f));
    return (
        candidate.find((f) => {
            try {
                readFileSync(f);
                return true;
            } catch {
                return false;
            }
        }) ?? null
    );
}

function parseFrontmatter(file) {
    const content = readFileSync(file, "utf8").match(
        /^---\n([\s\S]*?)\n---/,
    )?.[1];
    const slug = content?.match(/^slug:\s*(.+)$/m)?.[1]?.trim();
    const pubDate = content?.match(/^pubDate:\s*(.+)$/m)?.[1]?.trim();
    return { slug, pubDate };
}

function listPosts(lang) {
    const base = join(ROOT, "src/blog", lang);
    return readdirSync(base, { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => {
            const file = postFile(join(base, d.name));
            if (!file) return null;
            const { slug, pubDate } = parseFrontmatter(file);
            if (!slug || !pubDate) return null;
            return {
                url: `/${lang}/${pubDate}/${d.name}/`,
                out: `public/og/${lang}/${slug}.png`,
            };
        })
        .filter(Boolean);
}

async function waitForServer() {
    for (let i = 0; i < 120; i++) {
        try {
            const res = await fetch(BASE);
            if (res.ok) return;
        } catch {
            /* not ready yet */
        }
        await new Promise((r) => setTimeout(r, 500));
    }
    throw new Error(`Dev server did not become ready at ${BASE}`);
}

async function buildRoutes() {
    const routes = [];

    // Static pages: fixed urls + filenames.
    for (const lang of ["en", "ar"]) {
        for (const [name, url] of Object.entries(STATIC[lang])) {
            routes.push({ url, out: `public/og/${lang}/${name}.png` });
        }
        for (const post of listPosts(lang)) {
            routes.push(post);
        }
    }

    return routes;
}

async function main() {
    const chrome = findChrome();
    if (!chrome) {
        throw new Error(
            "No Chrome/Chromium found. Set CHROME_PATH or install one.",
        );
    }

    const server = spawn(
        "npx",
        ["astro", "dev", "--port", PORT, "--host", "127.0.0.1"],
        {
            cwd: ROOT,
            stdio: "ignore",
        },
    );
    console.log(`Dev server starting on ${BASE} ... (chrome: ${chrome})`);
    await waitForServer();

    const browser = await chromium.launch({
        executablePath: chrome,
        args: ["--no-sandbox"],
    });

    try {
        const routes = await buildRoutes();

        const statuses = [];
        for (const route of routes) {
            const res = await fetch(new URL(route.url, BASE));
            statuses.push({
                route,
                ok: res.status === 200,
                status: res.status,
            });
        }
        const skipped = statuses.filter((s) => !s.ok);
        for (const { route, status } of skipped) {
            console.warn(
                `✗ ${status} ${route.url} -> skipped (would screenshot 404)`,
            );
        }
        let targets = statuses.filter((s) => s.ok).map((s) => s.route);

        let existing = 0;
        if (SKIP_EXISTING) {
            const kept = [];
            for (const r of targets) {
                const isHome = r.url === "/en/" || r.url === "/ar/";
                if (!isHome && existsSync(join(ROOT, r.out))) {
                    existing++;
                } else {
                    kept.push(r);
                }
            }
            targets = kept;
        }

        let ok = 0;
        let failed = 0;
        for (const { url, out } of targets) {
            const page = await browser.newPage({
                viewport: { width: WIDTH, height: HEIGHT },
                locale: url.startsWith("/ar") ? "ar-EG" : "en-US",
            });
            try {
                await page.goto(new URL(url, BASE).href, {
                    waitUntil: "load",
                    timeout: 60_000,
                });
                const absOut = join(ROOT, out);
                mkdirSync(dirname(absOut), { recursive: true });
                await page.screenshot({ path: absOut, timeout: 60_000 });
                console.log(`✓ ${url} -> ${out}`);
                ok++;
            } catch (err) {
                console.error(`✗ ${url} -> ${err.message}`);
                failed++;
            } finally {
                await page.close();
            }
        }
        console.log(
            `Done. ${ok} screenshots, ${failed} failed, ${skipped.length} skipped, ${existing} existing.`,
        );
    } finally {
        await browser.close();
        server.kill();
    }
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
