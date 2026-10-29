"use client";

import { useEffect, useMemo, useState } from "react";
import { icons } from "./icons";
import { site } from "../lib/site";
import type { Term } from "../lib/content";

export interface CardData {
  url: string;
  title: string;
  image: string;
  dateText: string;
  readingTime: number;
  excerpt: string;
}

export interface PaginationData {
  current: number;
  total: number;
  basePath: string; // "/" => /page/2/；"/tags/docker/" => /tags/docker/page/2/
}

function svg(name: string) {
  return { __html: icons[name] };
}

function PostCard({ card }: { card: CardData }) {
  return (
    <article className="summary-classic" data-ani="false">
      <div className="summary-classic__flex-box">
        {card.image && (
          <div
            className="summary-classic__image-container summary-classic__image-wrapper"
            data-position="right"
            data-hwm=""
          >
            <a href={card.url}>
              <img
                src={card.image}
                alt={card.title}
                loading="lazy"
                className="summary-classic__image"
                data-ani="false"
                data-hwm=""
              />
            </a>
          </div>
        )}
        <div className="summary-classic__content">
          <header>
            <h5 className="title h5">
              <a href={card.url}>{card.title}</a>{" "}
            </h5>
            <h6 className="subtitle caption">
              <time title="创建日期" dir="ltr">
                📅&nbsp;{card.dateText}{" "}
              </time>
              <span title="阅读时长" dir="ltr">
                {" "}
                &middot; ☕&nbsp;{card.readingTime}&nbsp;分钟{" "}
              </span>
            </h6>
          </header>
          <div>
            <div className="summary-classic__text p2">{card.excerpt}</div>
          </div>
        </div>
      </div>
      <hr />
    </article>
  );
}

function Pagination({ data }: { data: PaginationData }) {
  const { current, total, basePath } = data;
  if (total <= 1) return null;
  const href = (n: number) => (n === 1 ? basePath : `${basePath.replace(/\/$/, "")}/page/${n}/`);
  return (
    <ul className="pagination">
      {Array.from({ length: total }, (_, i) => i + 1).map((n) => (
        <li key={n} className={n === current ? "active" : ""}>
          <a href={n === 1 && basePath === "/" ? "/" : href(n)}>{n}</a>
        </li>
      ))}
    </ul>
  );
}

function TaxoSection({ title, href, terms, kind }: { title: string; href: string; terms: Term[]; kind: string }) {
  if (terms.length === 0) return null;
  return (
    <div className="taxo">
      <section>
        <span className="title p2">
          <a href={href} className="taxo__title">
            {title}
          </a>
        </span>
        {terms.map((t) => (
          <span className="tag" key={t.slug}>
            <a href={`${href}${t.slug}/`} className={`is-${kind} taxo__link`} data-dir="ltr">
              <span className="taxo__text">{t.name}</span>
              <span className="taxo__num" dir="auto">
                {t.count}
              </span>
            </a>
          </span>
        ))}
      </section>
    </div>
  );
}

export function Bio() {
  const w = site.whoami;
  return (
    <section className="bio" data-dir="ltr">
      <hr className="hr-slash bio-hr" />
      <div className="bio__photo-wrapper">
        <img src={w.avatar} alt={w.name} loading="lazy" className="bio__photo" data-ani="false" />
      </div>
      <hr className="hr-slash bio-hr" />
      <div className="bio__photo-wrapper">
        <img src={w.extraImage} loading="lazy" className="bio__photo" />
      </div>
      <hr className="hr-slash bio-hr" />
      <div className="bio__name">{w.name}</div>
      <div className="bio__info">
        <div className="bio__info--icon" dangerouslySetInnerHTML={svg("location")} />
        {w.location}
      </div>
      <div className="bio__info">
        <div className="bio__info--icon" dangerouslySetInnerHTML={svg("email20")} />
        <a href={`mailto:${w.email}`}>{w.email}</a>
      </div>
      <div className="bio__info">
        <div className="bio__info--icon" dangerouslySetInnerHTML={svg("link")} />
        <a href={w.link} target="_blank" rel="noreferrer">
          {w.link}
        </a>
      </div>
      <div className="bio__social">
        {site.social.map((s) => (
          <a key={s.name} href={s.url} target="_blank" rel="noreferrer" title={s.name} aria-label={s.name}>
            <span dangerouslySetInnerHTML={svg(`${s.icon}25`)} />
          </a>
        ))}
      </div>
    </section>
  );
}

interface SearchItem {
  uri: string;
  title: string;
  description: string;
  content: string;
  tags: string[];
}

export default function ListPage({
  cards,
  pagination,
  tags,
  categories,
  series,
  showBio = true,
}: {
  cards: CardData[];
  pagination: PaginationData;
  tags: Term[];
  categories: Term[];
  series: Term[];
  showBio?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState<SearchItem[] | null>(null);
  const [FuseClass, setFuseClass] = useState<typeof import("fuse.js").default | null>(null);

  useEffect(() => {
    if (!query.trim() || index) return;
    fetch("/index.json")
      .then((r) => r.json())
      .then(async (data) => {
        const mod = await import("fuse.js");
        setIndex(data);
        setFuseClass(() => mod.default);
      });
  }, [query, index]);

  const results = useMemo(() => {
    if (!query.trim() || !index || !FuseClass) return [];
    const fuse = new FuseClass(index, {
      keys: ["title", "description", "content", "tags"],
      includeMatches: true,
      threshold: 0.4,
      distance: 100,
    });
    return fuse.search(query).slice(0, 20);
  }, [query, index, FuseClass]);

  const searching = query.trim().length > 0;

  return (
    <main className="main inner" data-sidebar-position="right">
      <div className="list__main lm">
        <div className="summary__container" data-display={searching ? "none" : "block"}>
          {!searching && (
            <>
              {cards.map((c) => (
                <PostCard key={c.url} card={c} />
              ))}
              <Pagination data={pagination} />
            </>
          )}
        </div>
        <div className="search-result" data-display={searching ? "block" : "none"}>
          {searching && (
            <>
              <div className="search-result__header">
                <div
                  className="search-result__close"
                  data-dir="ltr"
                  onClick={() => setQuery("")}
                  dangerouslySetInnerHTML={svg("close28")}
                />
              </div>
              <div className="search-result__body">
                <ul>
                  {results.map((r) => (
                    <li className="search-result__item" key={r.item.uri}>
                      <a href={r.item.uri}>
                        <div className="search-result__item--title">{r.item.title}</div>
                        <div className="search-result__item--desc">{r.item.description}</div>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      </div>

      <aside className="list__sidebar r" data-dir="ltr">
        <div className="sidebar">
          <div className="search">
            <span className="icon" dangerouslySetInnerHTML={svg("search")} />
            <input
              id="search"
              aria-label="Site Search"
              className="input"
              type="text"
              placeholder="搜索"
              autoComplete="off"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div id="search-results" className="dropdown">
              <div id="search-menu" className="dropdown-menu" role="menu"></div>
            </div>
          </div>

          {showBio && <Bio />}
          <hr className="hr-fade sidebar-hr" />

          <div className="taxo-root">
            <TaxoSection title="标签" href="/tags/" terms={tags} kind="tags" />
            <TaxoSection title="分类" href="/categories/" terms={categories} kind="categories" />
            <TaxoSection title="系列" href="/series/" terms={series} kind="series" />
          </div>
        </div>
        <hr className="hr-fade sidebar-hr" />
      </aside>
    </main>
  );
}
