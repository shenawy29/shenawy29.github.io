import { toHtml } from "hast-util-to-html";

const DEFAULT_TEXT_MAX = 200;
const DEFAULT_HTML_MAX = 600;

function collectText(node, out) {
    if (node.type === "text") {
        out.push(node.value);
        return;
    }
    if (node.type !== "element") return;
    if (node.tagName === "math" || node.tagName === "style" || node.tagName === "script") return;
    for (const child of node.children ?? []) collectText(child, out);
}

function lengthOf(node) {
    const out = [];
    collectText(node, out);
    return out.join("").length;
}

function truncateText(value, maxLength) {
    if (value.length <= maxLength) return value;
    const cut = value.slice(0, maxLength);
    const lastSpace = cut.lastIndexOf(" ");
    const end = lastSpace > 0 ? lastSpace : maxLength;
    return cut.slice(0, end).trimEnd();
}

function truncateNode(node, budget) {
    if (budget <= 0) return null;
    if (node.type === "text") {
        const value = truncateText(node.value, budget);
        return value ? { ...node, value } : null;
    }
    if (node.type !== "element") return null;
    const children = [];
    let used = 0;
    for (const child of node.children ?? []) {
        const len = lengthOf(child);
        if (used + len <= budget) {
            children.push(child);
            used += len;
        } else {
            const sliced = truncateNode(child, budget - used);
            if (sliced) children.push(sliced);
            break;
        }
    }
    if (!children.length) return null;
    return { ...node, children };
}

function truncateParagraph(node, budget) {
    const children = [];
    let used = 0;
    for (const child of node.children ?? []) {
        const len = lengthOf(child);
        if (used + len <= budget) {
            children.push(child);
            used += len;
        } else {
            const sliced = truncateNode(child, budget - used);
            if (sliced) children.push(sliced);
            break;
        }
    }
    return { ...node, children: [...children, { type: "text", value: "…" }] };
}

function selectBlocks(tree, maxLength, paragraphsOnly) {
    const blocks = [];
    let used = 0;
    for (const child of tree.children ?? []) {
        if (child.type !== "element") continue;
        if (paragraphsOnly && child.tagName !== "p") continue;
        const len = lengthOf(child);
        if (used + len <= maxLength) {
            blocks.push(child);
            used += len;
        } else if (child.tagName === "p") {
            blocks.push(truncateParagraph(child, maxLength - used));
            break;
        } else {
            break;
        }
    }
    return blocks;
}

function blocksToText(blocks) {
    const parts = [];
    for (const block of blocks) {
        const out = [];
        collectText(block, out);
        const value = out.join("").replace(/\s+/g, " ").trim();
        if (value) parts.push(value);
    }
    return parts.join(" ").trim();
}

export function rehypeExcerpt(options = {}) {
    const textMax = options.textMax ?? DEFAULT_TEXT_MAX;
    const htmlMax = options.htmlMax ?? DEFAULT_HTML_MAX;

    return function (_tree, file) {
        const frontmatter = file.data?.astro?.frontmatter;
        if (!frontmatter) return;

        const textBlocks = selectBlocks(_tree, textMax, true);
        const excerpt = blocksToText(textBlocks);
        if (excerpt) frontmatter.excerpt = excerpt;

        const htmlBlocks = selectBlocks(_tree, htmlMax, false);
        if (htmlBlocks.length) {
            frontmatter.excerptHtml = toHtml({ type: "root", children: htmlBlocks });
        }
    };
}