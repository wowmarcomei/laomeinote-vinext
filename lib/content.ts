import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { load as loadYaml } from "js-yaml";
import { plainText, readingMinutes, renderMarkdown, stripHtml, tocToHtml, type TocItem } from "./markdown";

// 与原站 Hugo 行为对齐：frontmatter 允许重复键（后者覆盖前者）
function parse(source: string) {
  return matter(source, {
    engines: { yaml: (s) => loadYaml(s, { json: true }) as object },
  });
}

const CONTENT_DIR = path.join(process.cwd(), "content");

export interface Post {
  slug: string;
  url: string;
  title: string;
  date: string; // ISO
  dateText: string; // 2025年04月21日
  dateShort: string; // 04-21
  year: string;
  updated?: string;
  description: string;
  author: string;
  pinned: boolean;
  categories: string[];
  tags: string[];
  series: string[];
  image: string;
  keywords?: string;
  html: string;
  toc: TocItem[];
  tocHtml: string;
  excerpt: string;
  readingTime: number;
  text: string;
}

export interface Term {
  name: string;
  slug: string;
  count: number;
}

function formatDate(d: Date): { iso: string; text: string; short: string; year: string } {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return {
    iso: d.toISOString(),
    text: `${y}年${m}月${day}日`,
    short: `${m}-${day}`,
    year: String(y),
  };
}

// Hugo urlize：小写、空格转连字符，保留 CJK
export function urlize(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, "-");
}

function toArray(v: unknown): string[] {
  if (!v) return [];
  if (Array.isArray(v)) return v.map(String);
  return [String(v)];
}

let cache: Post[] | null = null;

export function getAllPosts(): Post[] {
  if (cache) return cache;
  const dir = path.join(CONTENT_DIR, "posts");
  const posts = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
    .map((file) => {
      const slug = file.replace(/\.md$/, "").toLowerCase();
      const { data, content } = parse(fs.readFileSync(path.join(dir, file), "utf8"));
      const date = formatDate(new Date(data.date));
      const { html, toc } = renderMarkdown(content);
      const plain = stripHtml(html);
      const text = plainText(content);
      const description = data.description ? String(data.description) : "";
      return {
        slug,
        url: `/posts/${slug}/`,
        title: String(data.title ?? slug),
        date: date.iso,
        dateText: date.text,
        dateShort: date.short,
        year: date.year,
        updated: data.updated ? formatDate(new Date(data.updated)).text : undefined,
        description,
        author: String(data.author ?? "Laomei"),
        pinned: data.pinned === true,
        categories: toArray(data.categories),
        tags: toArray(data.tags),
        series: toArray(data.series),
        image: data.image ? `/${String(data.image).replace(/^\//, "")}` : "",
        keywords: data.keywords ? String(data.keywords) : undefined,
        html,
        toc,
        tocHtml: tocToHtml(toc),
        excerpt: description || `${text.slice(0, 70)}…`,
        readingTime: readingMinutes(plain),
        text: plain,
      } satisfies Post;
    });
  posts.sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return b.date.localeCompare(a.date);
  });
  cache = posts;
  return posts;
}

export function getPost(slug: string): Post | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

export function getTerms(field: "tags" | "categories" | "series"): Term[] {
  const map = new Map<string, Term>();
  for (const post of getAllPosts()) {
    for (const name of post[field]) {
      const slug = urlize(name);
      const term = map.get(slug) ?? { name, slug, count: 0 };
      term.count += 1;
      map.set(slug, term);
    }
  }
  return [...map.values()].sort((a, b) => (a.slug < b.slug ? -1 : a.slug > b.slug ? 1 : 0));
}

export function getPostsByTerm(field: "tags" | "categories" | "series", slug: string): Post[] {
  return getAllPosts().filter((p) => p[field].some((name) => urlize(name) === slug));
}

export function termSize(count: number): string {
  if (count >= 20) return "is-large";
  if (count >= 10) return "is-medium";
  if (count >= 5) return "is-normal";
  return "is-small";
}

export interface GalleryImage {
  image: string;
  caption: string;
}

export interface Gallery {
  slug: string;
  title: string;
  description: string;
  image: string;
  images: GalleryImage[];
  html: string;
}

export function getGallery(slug: string): Gallery {
  const { data, content } = parse(
    fs.readFileSync(path.join(CONTENT_DIR, "gallery", `${slug}.md`), "utf8")
  );
  return {
    slug,
    title: String(data.title ?? slug),
    description: String(data.description ?? ""),
    image: data.image ? `/${String(data.image).replace(/^\//, "")}` : "",
    images: (data.images ?? []).map((i: { image: string; caption?: string }) => ({
      image: `/gallery/${slug}/${i.image}`,
      caption: i.caption ?? "",
    })),
    html: renderMarkdown(content).html,
  };
}

export function getGalleries(): Gallery[] {
  return ["cartoon", "photo"].map(getGallery);
}

export function getAbout(): { title: string; html: string; description: string } {
  const { data, content } = parse(fs.readFileSync(path.join(CONTENT_DIR, "about.md"), "utf8"));
  return {
    title: String(data.title ?? "关于我"),
    description: String(data.description ?? ""),
    html: renderMarkdown(content).html,
  };
}
