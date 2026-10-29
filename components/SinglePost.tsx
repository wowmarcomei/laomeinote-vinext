"use client";

import { useEffect, useRef, useState } from "react";
import type { Post } from "../lib/content";
import { absoluteUrl, site } from "../lib/site";

function ShareLinks({ post }: { post: Post }) {
  const url = encodeURIComponent(absoluteUrl(post.url));
  const title = encodeURIComponent(post.title);
  return (
    <div className="donation">
      <div className="donation__message"></div>
      <div className="donation__icons">
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
          title="Facebook"
          aria-label="Facebook Share Button"
          className="donation__item"
          target="_blank"
          rel="noreferrer"
          data-type="share"
        >
          Facebook
        </a>
        <a
          href={`https://twitter.com/intent/tweet?text=${title}&url=${url}&hashtags=${post.tags.join(",")}&via=Laomei`}
          title="Twitter"
          aria-label="Twitter Share Button"
          className="donation__item"
          target="_blank"
          rel="noreferrer"
          data-type="share"
        >
          Twitter
        </a>
        <a
          href={`https://www.reddit.com/submit?url=${url}&title=${title}`}
          target="_blank"
          rel="noreferrer"
          title="Reddit"
          aria-label="Reddit Share Button"
          className="donation__item"
          data-type="share"
        >
          Reddit
        </a>
        <a
          href={`https://www.douban.com/recommend/?url=${url}&title=${title}`}
          className="donation__item"
          target="_blank"
          rel="noreferrer"
          title="Douban"
          aria-label="Douban Share Button"
          data-type="share"
        >
          Douban
        </a>
        <a
          href={`https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`}
          target="_blank"
          rel="noreferrer"
          title="LinkedIn"
          aria-label="LinkedIn Share Button"
          className="donation__item"
          data-type="share"
        >
          LinkedIn
        </a>
        <a
          href={`https://telegram.me/share/url?url=${url}&text=${title}`}
          className="donation__item"
          target="_blank"
          rel="noreferrer"
          title="Telegram"
          aria-label="Telegram Share Button"
          data-type="share"
        >
          Telegram
        </a>
      </div>
    </div>
  );
}

export default function SinglePost({ post }: { post: Post }) {
  const [tocOn, setTocOn] = useState(true);
  const [activeId, setActiveId] = useState("");
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ uri: string; title: string; description: string }[]>([]);
  const searchRef = useRef<{ index: unknown[]; Fuse: typeof import("fuse.js").default } | null>(null);

  // 文章页搜索（searchResultPosition=main：结果显示在正文区域）
  const onSearch = async (q: string) => {
    setQuery(q);
    if (!q.trim()) {
      setResults([]);
      return;
    }
    if (!searchRef.current) {
      const [data, mod] = await Promise.all([
        fetch("/index.json").then((r) => r.json()),
        import("fuse.js"),
      ]);
      searchRef.current = { index: data, Fuse: mod.default };
    }
    const { index, Fuse } = searchRef.current;
    const fuse = new Fuse(index, {
      keys: ["title", "description", "content", "tags"],
      includeMatches: true,
      threshold: 0.4,
      distance: 100,
    });
    setResults(
      fuse.search(q).slice(0, 20).map((r) => {
        const item = r.item as { uri: string; title: string; description: string };
        return { uri: item.uri, title: item.title, description: item.description };
      })
    );
  };

  // 代码块复制按钮（对应原站 clipboard 行为）
  useEffect(() => {
    const blocks = document.querySelectorAll(".single__contents .highlight");
    const cleanups: (() => void)[] = [];
    blocks.forEach((block) => {
      if (block.querySelector(".copy-to-clipboard")) return;
      const btn = document.createElement("span");
      btn.className = "copy-to-clipboard";
      btn.title = "Copy to clipboard";
      btn.innerText = "copy";
      const onClick = () => {
        const code = block.querySelector("td.lntd:last-child code")?.textContent ?? "";
        navigator.clipboard?.writeText(code.replace(/\n$/, ""));
        btn.innerText = "copied!";
        setTimeout(() => (btn.innerText = "copy"), 1500);
      };
      btn.addEventListener("click", onClick);
      block.appendChild(btn);
      cleanups.push(() => {
        btn.removeEventListener("click", onClick);
        btn.remove();
      });
    });
    return () => cleanups.forEach((fn) => fn());
  }, [post.slug]);

  // TOC 滚动高亮
  useEffect(() => {
    const headings = document.querySelectorAll(".single__contents h2, .single__contents h3, .single__contents h4");
    const onScroll = () => {
      let current = "";
      headings.forEach((h) => {
        if ((h as HTMLElement).getBoundingClientRect().top < 120) current = h.id;
      });
      setActiveId(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [post.slug]);

  // 文章图片点击放大
  useEffect(() => {
    const imgs = document.querySelectorAll(".single__contents img");
    const handlers: [Element, () => void][] = [];
    imgs.forEach((img) => {
      const fn = () => setLightbox((img as HTMLImageElement).src);
      img.addEventListener("click", fn);
      (img as HTMLElement).style.cursor = "zoom-in";
      handlers.push([img, fn]);
    });
    return () => handlers.forEach(([img, fn]) => img.removeEventListener("click", fn));
  }, [post.slug]);

  return (
    <>
      <main className="single__main main-main">
        <nav className="breadcrumb" aria-label="breadcrumbs">
          <ol>
            <li>
              <a href="/" className="capitalize">
                {site.title}
              </a>
            </li>
            <li>
              <a href="/posts/" className="capitalize">
                文章
              </a>
            </li>
            <li className="is-active">
              <span>{post.title}</span>
            </li>
          </ol>
        </nav>

        <div className="single">
          <h2 className="single__title" data-ani="false">
            {post.title}
          </h2>
          <h3 className="single__subtitle"></h3>
          <div className="single__meta">
            <div className="single__infos">
              <time className="single__info" title="创建日期">
                📅&nbsp;{post.dateText}{" "}
              </time>
              &nbsp;&middot;&nbsp;{" "}
              <span className="single__info" title="阅读时长">
                {" "}
                ☕&nbsp;{post.readingTime}&nbsp;分钟{" "}
              </span>
              &nbsp;&middot;&nbsp;{" "}
              <span className="single__info" title="作者">
                ✍️&nbsp;{post.author}
              </span>
            </div>

            <ul className="single__tags caption">
              🏷️
              {post.tags.map((t) => (
                <li key={t}>
                  <a href={`/tags/${t.trim().toLowerCase().replace(/\s+/g, "-")}/`} className="single__tag" title={t}>
                    #{t}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <article
            className="single__contents"
            data-dir="ltr"
            data-ani="false"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />

          <ShareLinks post={post} />

          <div className={query.trim() ? "" : "hide"}>
            <div className="search">
              <span className="icon" />
              <input
                id="search"
                aria-label="Site Search"
                className="input"
                type="text"
                placeholder="搜索"
                autoComplete="off"
                value={query}
                onChange={(e) => onSearch(e.target.value)}
              />
            </div>
          </div>
          {query.trim() && (
            <div className="search-result" data-display="block">
              <div className="search-result__header">
                <div className="search-result__close" data-dir="ltr" onClick={() => onSearch("")}>
                  ×
                </div>
              </div>
              <div className="search-result__body">
                <ul>
                  {results.map((r) => (
                    <li className="search-result__item" key={r.uri}>
                      <a href={r.uri}>
                        <div className="search-result__item--title">{r.title}</div>
                        <div className="search-result__item--desc">{r.description}</div>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </main>

      <aside className="single__side main-side">
        <section className="sidebar">
          <div className="toc__flexbox" data-position="fixed">
            <h6 className="toc__title" data-ani="false">
              目录
            </h6>
            <label className="switch" data-ani="false">
              <input
                id="toggle-toc"
                aria-label="Toggle TOC"
                type="checkbox"
                checked={tocOn}
                onChange={() => setTocOn(!tocOn)}
              />
              <span className="slider round"></span>
            </label>
          </div>
          <div className={`toc ${tocOn ? "" : "hide"}`} data-dir="ltr" data-folding="false" data-ani="false">
            <nav
              id="TableOfContents"
              dangerouslySetInnerHTML={{
                __html: post.tocHtml,
              }}
              onClick={(e) => {
                const a = (e.target as HTMLElement).closest("a");
                if (a) setActiveId(a.getAttribute("href")!.slice(1));
              }}
            />
          </div>
          <TocHighlighter activeId={activeId} />
        </section>
      </aside>

      {lightbox && (
        <div
          className="modal micromodal-slide"
          id="modal"
          aria-hidden="false"
          style={{ display: "block" }}
          onClick={() => setLightbox(null)}
        >
          <div className="modal__overlay" tabIndex={-1} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <img src={lightbox} alt="" style={{ maxWidth: "90vw", maxHeight: "90vh", cursor: "zoom-out" }} />
          </div>
        </div>
      )}
    </>
  );
}

// 给 TOC 当前项加 active 类（zzo 样式依赖 a.active）
function TocHighlighter({ activeId }: { activeId: string }) {
  useEffect(() => {
    const links = document.querySelectorAll("#TableOfContents a");
    links.forEach((l) => {
      l.classList.toggle("active", l.getAttribute("href") === `#${activeId}`);
    });
  }, [activeId]);
  return null;
}
