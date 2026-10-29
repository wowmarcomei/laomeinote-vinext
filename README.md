# 老梅笔记 · vinext 重写版

原站 [laomeinote.com](https://laomeinote.com)（Hugo + zzo 主题）的 **1:1 重写**：
使用 Cloudflare 官方 [vinext](https://github.com/cloudflare/vinext)（Next.js API on Vite）实现，
部署到 **Cloudflare Workers**。

- 框架：vinext（App Router + React Server Components + 静态预渲染）
- 内容：37 篇 Markdown 文章（`content/posts/`），gray-matter + markdown-it 渲染
- 样式：zzo 主题编译后的原始 CSS（`public/css/`），DOM 结构与原站逐块对应
- 代码高亮：highlight.js → chroma 类名映射，行号表格与原站一致
- 搜索：Fuse.js + `/index.json`（格式与原站 Hugo SearchIndex 一致）
- 交互：暗/亮主题切换、移动端菜单、TOC 滚动高亮、代码复制、相册瀑布流 + 灯箱
- SEO：RSS（`/index.xml`）、Sitemap（`/sitemap.xml`）、OG meta

## 开发

```bash
npm install
npm run dev        # 本地开发（Vite HMR）
npm run build      # 生产构建（静态预渲染全部页面）
npm run start      # 本地预览生产产物
```

## 新写文章

```bash
# 1. 生成文章脚手架（slug 即文章 URL：/posts/<slug>/）
npm run new:post -- my-first-post "我的第一篇文章"

# 2. 编辑 content/posts/my-first-post.md，填写 frontmatter 与正文

# 3. 本地预览（自动重新生成搜索索引/RSS/Sitemap）
npm run dev        # http://localhost:3000

# 4. 发布（构建 94+ 个静态页面并部署到 Workers）
export CLOUDFLARE_API_TOKEN=<your-token>
npm run deploy
```

frontmatter 字段与原 Hugo 站点一致：

```yaml
---
title: 文章标题            # 必填
date: 2026-10-29 12:00:00  # 必填，列表按日期倒序
updated: 2026-10-29 12:00:00
description: 一句话摘要     # 显示在列表卡片与搜索结果
author: Laomei
pinned: false              # true 则置顶到首页最前
categories: [技术笔记]      # 对应 /categories/<名称>/
tags: [Docker]             # 对应 /tags/<小写名称>/
series: [Docker]           # 对应 /series/<小写名称>/
image: images/posts/xxx.png  # 列表卡片缩略图，放在 public/images/posts/
keywords: docker,容器      # SEO
---
```

`npm run build` 的完整流程：`prebuild` 生成 `public/index.json`（搜索索引）、
`index.xml`（RSS）、`sitemap.xml` → Vite 静态预渲染全部页面 → `postbuild`
还原中文路径。新增/修改文章后无需手动维护任何索引。

## 部署到 Cloudflare Workers

```bash
export CLOUDFLARE_API_TOKEN=<your-token>
npm run deploy     # 完整构建 + @vinext/cloudflare deploy --skip-build
```

Worker 名称见 `wrangler.toml`（默认 `laomeinote`）。
自定义站点地址（影响 canonical / RSS / 搜索索引）：

```bash
BASE_URL="https://your-domain.com" npm run build
```

## 目录

```
app/            # App Router 页面与路由（首页/分页/文章/归档/关于/相册/标签/分类/系列/RSS/搜索索引）
components/     # zzo 结构对应的 React 组件（含原站内联 SVG 图标）
lib/            # 内容加载、Markdown 渲染（chroma 结构）、站点配置
content/        # Markdown 文章、关于、相册配置
public/         # 静态资源（图片/字体/favicon/zzo 编译 CSS/masonry）
```
