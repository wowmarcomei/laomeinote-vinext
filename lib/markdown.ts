import MarkdownIt from "markdown-it";
import hljs from "highlight.js";
import GithubSlugger from "github-slugger";

// highlight.js -> Hugo chroma 类名映射，让 zzo 主题的代码配色原样生效
const HLJS_TO_CHROMA: Record<string, string> = {
  "hljs-comment": "c1",
  "hljs-quote": "c1",
  "hljs-keyword": "k",
  "hljs-selector-tag": "k",
  "hljs-literal": "kc",
  "hljs-doctag": "cp",
  "hljs-string": "s",
  "hljs-regexp": "sr",
  "hljs-addition": "gi",
  "hljs-deletion": "gd",
  "hljs-number": "m",
  "hljs-built_in": "nb",
  "hljs-builtin-name": "nb",
  "hljs-title": "nf",
  "hljs-title function_": "nf",
  "hljs-title class_": "nc",
  "hljs-type": "kt",
  "hljs-attr": "na",
  "hljs-attribute": "na",
  "hljs-variable": "nv",
  "hljs-template-variable": "nv",
  "hljs-name": "nt",
  "hljs-tag": "nt",
  "hljs-meta": "cp",
  "hljs-meta-keyword": "kp",
  "hljs-symbol": "no",
  "hljs-bullet": "o",
  "hljs-operator": "o",
  "hljs-punctuation": "p",
  "hljs-section": "nf",
  "hljs-link": "s",
  "hljs-selector-id": "ni",
  "hljs-selector-class": "nc",
  "hljs-selector-attr": "na",
  "hljs-selector-pseudo": "nd",
  "hljs-template-tag": "k",
  "hljs-formula": "m",
  "hljs-emphasis": "ge",
  "hljs-strong": "gs",
};

function mapHljsClasses(html: string): string {
  return html.replace(/class="([^"]+)"/g, (whole, classes: string) => {
    const mapped = classes
      .split(/\s+/)
      .map((c) => {
        if (HLJS_TO_CHROMA[c]) return HLJS_TO_CHROMA[c];
        if (c === "hljs-title") return "nf";
        if (c.startsWith("hljs-title")) return c.includes("class") ? "nc" : "nf";
        return c;
      })
      .join(" ");
    return `class="${mapped}"`;
  });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// 将高亮后的 HTML 按行拆分，跨行 span 在行尾闭合、下一行重新打开
function splitLines(html: string): string[] {
  const lines: string[] = [];
  const open: string[] = [];
  let cur = "";
  for (const tok of html.split(/(<[^>]+>|\n)/g)) {
    if (tok === "") continue;
    if (tok === "\n") {
      lines.push(cur + "</span>".repeat(open.length));
      cur = open.join("");
    } else if (tok.startsWith("<span")) {
      open.push(tok);
      cur += tok;
    } else if (tok === "</span>") {
      open.pop();
      cur += tok;
    } else {
      cur += tok;
    }
  }
  if (cur !== "") lines.push(cur);
  return lines;
}

// 复刻 Hugo markup.highlight 输出：lntable + 行号列 + chroma token span
function renderCodeBlock(code: string, lang: string): string {
  let highlighted: string;
  if (lang && hljs.getLanguage(lang)) {
    highlighted = mapHljsClasses(hljs.highlight(code, { language: lang }).value);
  } else {
    highlighted = escapeHtml(code);
  }
  if (highlighted.endsWith("\n")) highlighted = highlighted.slice(0, -1);
  const lines = splitLines(highlighted);
  const width = String(lines.length).length;
  const lnts = lines
    .map((_, i) => `<span class="lnt">${String(i + 1).padStart(width, " ")}\n</span>`)
    .join("");
  const body = lines
    .map((l) => `<span class="line"><span class="cl">${l}\n</span></span>`)
    .join("");
  const language = lang || "plaintext";
  return (
    `<div class="highlight"><div class="chroma">\n` +
    `<table class="lntable"><tr><td class="lntd">\n` +
    `<pre tabindex="0" class="chroma"><code>${lnts}</code></pre></td>\n` +
    `<td class="lntd">\n` +
    `<pre tabindex="0" class="chroma"><code class="language-${escapeHtml(language)}" data-lang="${escapeHtml(language)}">${body}</code></pre></td></tr></table>\n` +
    `</div>\n</div>`
  );
}

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export interface RenderedMarkdown {
  html: string;
  toc: TocItem[];
}

export function renderMarkdown(source: string): RenderedMarkdown {
  const slugger = new GithubSlugger();
  const toc: TocItem[] = [];

  const md = new MarkdownIt({
    html: true,
    breaks: true, // 对应 goldmark hardWraps
    linkify: true,
  });

  md.renderer.rules.heading_open = (tokens, idx) => {
    const text = tokens[idx + 1]?.content ?? "";
    const level = Number(tokens[idx].tag.slice(1));
    const id = slugger.slug(text);
    if (level >= 2 && level <= 4) toc.push({ id, text, level });
    return `<${tokens[idx].tag} id="${id}">`;
  };

  md.renderer.rules.fence = (tokens, idx) => {
    const token = tokens[idx];
    const lang = (token.info || "").trim().split(/\s+/)[0] || "";
    return renderCodeBlock(token.content, lang);
  };

  return { html: md.render(source), toc };
}

// Hugo .TableOfContents 的嵌套 <ul> 结构（h2~h4）
export function tocToHtml(toc: TocItem[]): string {
  if (toc.length === 0) return "";
  const root: TocItem & { children: unknown[] } = { id: "", text: "", level: 1, children: [] };
  const stack: { level: number; children: unknown[] }[] = [{ level: 1, children: root.children }];
  for (const item of toc) {
    const node = { ...item, children: [] as unknown[] };
    while (stack.length > 1 && stack[stack.length - 1].level >= item.level) stack.pop();
    stack[stack.length - 1].children.push(node);
    stack.push({ level: item.level, children: node.children });
  }
  const render = (nodes: { id: string; text: string; children: unknown[] }[]): string =>
    `<ul>${nodes
      .map(
        (n) =>
          `<li><a href="#${n.id}">${escapeHtml(n.text)}</a>${
            n.children.length ? render(n.children as never) : ""
          }</li>`
      )
      .join("")}</ul>`;
  return render(root.children as never);
}

export function plainText(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#>*_`~-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// 渲染后 HTML 转纯文本（对应 Hugo .Plain，保留代码文本）
export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'");
}

// Hugo CJK WordCount：按空白分词；含 CJK(汉字/假名/谚文) 的 token 按 rune 数计，其余 token 计 1
const CJK = /[\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF\u3040-\u309F\u30A0-\u30FF\uFF66-\uFF9D\uAC00-\uD7AF\u1100-\u11FF]/;

export function wordCount(plain: string): number {
  let count = 0;
  for (const token of plain.split(/\s+/)) {
    if (!token) continue;
    count += CJK.test(token) ? [...token].length : 1;
  }
  return count;
}

// 与原站 .ReadingTime 对齐：CJK 500 字/分钟，向上取整
export function readingMinutes(plain: string): number {
  return Math.max(1, Math.ceil(wordCount(plain) / 500));
}
