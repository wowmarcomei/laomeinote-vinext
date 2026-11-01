+++
title = "关于我"
description = "博主的个人介绍"
type = "about"
date = "2019-02-28"
+++

> ## 我是谁
一个普通 IT 男，在深圳做 Kubernetes 相关的工作。喜欢骑行和自由阅读，也爱折腾各种工具和系统，折腾完顺手把过程记下来。

> ## 为何建站
写东西图个自在。公共平台当然也能写，但账号、审核和规则都在别人手里，指不定哪天内容就没了。自己搭个站，想写什么写什么，数据也都在自己手上，心里踏实。

> ## 如何建站
最早的要求很简单，不用自己维护服务器，写完能自动发布，访问别太慢，最好免费。WordPress、腾讯云 COS、Hexo、GitHub Pages、Vercel 都试过一圈，最后落在 Hugo + GitHub + Vercel + CloudFront 这套静态方案上，跑了几年也算省心。

> ## 2026 年的一次重写
今年我把整站从 Hugo 重写成了 React 应用，用的是 Cloudflare 官方开源的 vinext。它把 Next.js 的 API 跑在 Vite 上，可以直接部署到 Cloudflare Workers。原来的 37 篇文章一篇不少，页面结构、样式、代码高亮和站内搜索都按原样复刻，连每篇文章的阅读时长都和旧站一致。

新站在构建时静态生成全部页面，Workers 只负责分发，速度只快不慢。域名换成了 blog.laomei.app，证书交给 Cloudflare 自动签发和续期。现在写新文章也很省事，一条命令生成草稿，写完再一条命令构建发布。代码在 GitHub 上开源，仓库是 [laomeinote-vinext](https://github.com/wowmarcomei/laomeinote-vinext)。

> ## 本站主题
主要记录 Kubernetes、Istio、Linux 等 IT 技术笔记，也有一些读书笔记、个人周记和日常折腾的记录，欢迎交流。
