// 新建文章：npm run new:post -- <slug> [标题]
// 例: npm run new:post -- my-first-post "我的第一篇文章"
import fs from "node:fs";
import path from "node:path";

const slug = process.argv[2];
const title = process.argv[3] || slug;

if (!slug || !/^[a-z0-9][a-z0-9-]*$/.test(slug)) {
  console.error("用法: npm run new:post -- <slug> [标题]");
  console.error("slug 仅允许小写字母、数字、连字符（会作为文章 URL）");
  process.exit(1);
}

const file = path.join(process.cwd(), "content", "posts", `${slug}.md`);
if (fs.existsSync(file)) {
  console.error(`文件已存在: ${file}`);
  process.exit(1);
}

const now = new Date();
const pad = (n: number) => String(n).padStart(2, "0");
const ts = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

const template = `---
title: ${title}
date: ${ts}
updated: ${ts}
description: 
author: Laomei
pinned: false
categories: 
  - 技术笔记
tags: 
  - 
series:
  - 
image: images/feature2/color-palette.png
keywords: 
---

在这里写正文……

## 小标题

支持 **加粗**、\`行内代码\`、[链接](https://example.com) 和代码块：

\`\`\`bash
echo "hello"
\`\`\`
`;

fs.writeFileSync(file, template);
console.log(`已创建: ${file}`);
console.log("编辑后运行 npm run dev 预览，npm run deploy 发布");
