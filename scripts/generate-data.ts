// 构建前生成静态数据文件到 public/（纯静态导出时 route handler 不适用）
import fs from "node:fs";
import path from "node:path";
import { getAllPosts, getTerms } from "../lib/content";
import { absoluteUrl, site } from "../lib/site";

const out = path.join(process.cwd(), "public");

const posts = getAllPosts();

// 与原站 Hugo SearchIndex 格式一致（Fuse.js 使用）
const searchIndex = posts.map((p, i) => ({
  content: p.text,
  description: p.description,
  id: i,
  section: "posts",
  tags: p.tags,
  title: p.title,
  uri: absoluteUrl(p.url),
}));
fs.writeFileSync(path.join(out, "index.json"), JSON.stringify(searchIndex));

const escape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const items = posts
  .slice(0, 100)
  .map(
    (p) => `    <item>
      <title>${escape(p.title)}</title>
      <link>${absoluteUrl(p.url)}</link>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <guid>${absoluteUrl(p.url)}</guid>
      <description>${escape(p.description || p.excerpt)}</description>
      <content:encoded><![CDATA[${p.html}]]></content:encoded>
    </item>`
  )
  .join("\n");
fs.writeFileSync(
  path.join(out, "index.xml"),
  `<?xml version="1.0" encoding="utf-8" standalone="yes"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escape(site.title)}</title>
    <link>${site.baseUrl}/</link>
    <description>${escape(site.description)}</description>
    <language>zh</language>
    <atom:link href="${site.baseUrl}/index.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`
);

const urls = [
  "/",
  "/archive/",
  "/about/",
  "/gallery/",
  "/gallery/cartoon/",
  "/gallery/photo/",
  "/posts/",
  "/tags/",
  "/categories/",
  "/series/",
  ...posts.map((p) => p.url),
  ...getTerms("tags").map((t) => `/tags/${t.slug}/`),
  ...getTerms("categories").map((t) => `/categories/${t.slug}/`),
  ...getTerms("series").map((t) => `/series/${t.slug}/`),
];
fs.writeFileSync(
  path.join(out, "sitemap.xml"),
  `<?xml version="1.0" encoding="utf-8" standalone="yes"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${absoluteUrl(u)}</loc></url>`).join("\n")}
</urlset>`
);

console.log(`生成完成: index.json(${posts.length} 篇), index.xml, sitemap.xml(${urls.length} 个 URL)`);
