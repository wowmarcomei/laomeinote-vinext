// 站点配置：与原站 config/_default/{config,params}.toml 对应
export const site = {
  title: "老梅笔记 laomeinote",
  shortTitle: "老梅笔记",
  logoText: "Laomei Note | 老梅笔记",
  description:
    "LaomeiNote 老梅笔记是Laomei的个人站点，主要分享AI、Docker、Linux、Kubernetes、Devops、建站SEO技术, 最新科技、读书笔记等内容。",
  baseUrl: (process.env.BASE_URL || "https://blog.laomei.app").replace(/\/$/, ""),
  author: "Laomei",
  paginate: 10,
  archivePaginate: 40,
  summaryLength: 70,
  whoami: {
    name: "LaoMei",
    location: "Shenzhen, China",
    email: "lm@laomeinote.com",
    link: "https://laomeinote.com",
    avatar: "/images/whoami/avatar.jpg",
    extraImage: "/images/posts/gh_laomei.png",
  },
  social: [
    { name: "douban", url: "https://www.douban.com/people/marcomei/", icon: "douban" },
    { name: "facebook", url: "https://facebook.com/wowmarcomei", icon: "facebook" },
    { name: "github", url: "https://github.com/wowmarcomei", icon: "github" },
    { name: "weibo", url: "https://weibo.com/u/1740682610", icon: "weibo" },
  ],
  footerSocial: [
    { name: "douban", url: "https://www.douban.com/people/marcomei/", icon: "douban32" },
    { name: "email", url: "mailto:lm@laomeinote.com", icon: "email32" },
    { name: "facebook", url: "https://facebook.com/wowmarcomei", icon: "facebook32" },
    { name: "github", url: "https://github.com/wowmarcomei", icon: "github32" },
    { name: "weibo", url: "https://weibo.com/u/1740682610", icon: "weibo32" },
  ],
  menu: [
    { name: "首页", url: "/" },
    { name: "时光机", url: "/archive" },
    { name: "关于", url: "/about/" },
  ],
} as const;

export function absoluteUrl(path: string): string {
  return `${site.baseUrl}${path}`;
}

// 与 vinext metadata 解析一致：trailing slash，非 ASCII 按 URL 百分号编码。
// sitemap 的 <loc> 用它，才能和 alternates.canonical（经 metadataBase 解析）逐字相同。
export function encodedAbsoluteUrl(path: string): string {
  const base = new URL(site.baseUrl);
  const prefix = base.pathname.replace(/\/$/, "");
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const withSlash = normalized.endsWith("/") ? normalized : `${normalized}/`;
  const url = new URL(`${prefix}${withSlash}`.replace(/\/{2,}/g, "/"), base.origin);
  if (url.pathname === "/" && url.search === "" && url.hash === "") return `${url.origin}/`;
  return url.href;
}
