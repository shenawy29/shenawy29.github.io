import { execSync } from "node:child_process";

export function remarkModifiedTime() {
    return function (_tree, file) {
        const filepath = file.history[0];
        try {
            const result = execSync(
                `git log -1 --pretty="format:%cI" "${filepath}"`,
            );
            const date = result.toString().trim();
            if (date) {
                file.data.astro.frontmatter.lastModified = date;
            }
        } catch {
            // git log failed (e.g. file not tracked, no commits yet) — skip
        }
    };
}
