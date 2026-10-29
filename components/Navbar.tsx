"use client";

import { useEffect, useRef, useState } from "react";
import { icons } from "./icons";
import { site } from "../lib/site";

const MENU = [
  { name: "首页", url: "/" },
  { name: "时光机", url: "/archive" },
  { name: "关于", url: "/about/" },
];

function svg(name: string) {
  return { __html: icons[name] };
}

export default function Navbar() {
  const [theme, setTheme] = useState("dark");
  const [themeOpen, setThemeOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileQuery, setMobileQuery] = useState("");
  const [mobileResults, setMobileResults] = useState<
    { uri: string; title: string; description: string }[]
  >([]);
  const indexRef = useRef<unknown[] | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) setTheme(saved);
  }, []);

  const selectTheme = (t: string) => {
    setTheme(t);
    setThemeOpen(false);
    localStorage.setItem("theme", t);
    document.getElementById("root")!.className = `theme__${t}`;
  };

  // 桌面端搜索按钮：聚焦当前页面的搜索框（侧栏或文章页隐藏搜索框）
  const focusPageSearch = () => {
    const input = document.querySelector<HTMLInputElement>("#search");
    if (input) {
      input.scrollIntoView({ behavior: "smooth", block: "center" });
      input.closest(".hide")?.classList.remove("hide");
      input.focus();
    }
  };

  const searchMobile = async (q: string) => {
    setMobileQuery(q);
    if (!q.trim()) {
      setMobileResults([]);
      return;
    }
    if (!indexRef.current) {
      indexRef.current = (await (await fetch("/index.json")).json()) as unknown[];
    }
    const Fuse = (await import("fuse.js")).default;
    const fuse = new Fuse(indexRef.current, {
      keys: ["title", "description", "content", "tags"],
      includeMatches: true,
      threshold: 0.4,
      distance: 100,
    });
    const results = fuse.search(q).slice(0, 10);
    setMobileResults(
      results.map((r) => {
        const item = r.item as { uri: string; title: string; description: string };
        return { uri: item.uri, title: item.title, description: item.description };
      })
    );
  };

  return (
    <nav className="navbar scrolling" role="navigation" aria-label="main navigation" data-dir="ltr">
      <div className="navbar__brand">
        <a href="/" title="主页" rel="home" className="navbar__logo-link">
          <img src="/logo.png" alt="Home" className="navbar__logo" />
        </a>
        <a href="/" title="主页" rel="home" className="navbar__title-link">
          <h6 className="navbar__title colorful">{site.logoText}</h6>
        </a>
      </div>

      <div className="theme theme-mobile" data-ani="false">
        <div className="dropdown">
          <button
            className="dropdown-trigger navbar__slide-down"
            aria-label="Select Theme Button"
            data-ani="false"
            onClick={() => setThemeOpen(!themeOpen)}
            dangerouslySetInnerHTML={svg("theme")}
          />
          <div className={`dropdown-content select-theme${themeOpen ? " is-active" : ""}`}>
            {["dark", "light"].map((t) => (
              <a
                key={t}
                href="#"
                className={`dropdown-item select-theme__item ${theme === t ? "is-active" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  selectTheme(t);
                }}
              >
                {t}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div
        className="mobile-search__btn navbar-search"
        data-ani="false"
        onClick={() => setMobileSearchOpen(true)}
        dangerouslySetInnerHTML={svg("search")}
      />

      <div
        id="search-mobile-container"
        className={`mobile-search${mobileSearchOpen ? "" : " hide"}`}
        data-dir="ltr"
      >
        <div className="mobile-search__top">
          <input
            id="search-mobile"
            type="text"
            aria-label="Mobile Search"
            placeholder="搜索"
            className="mobile-search__top--input"
            value={mobileQuery}
            onChange={(e) => searchMobile(e.target.value)}
          />
          <div
            id="search-mobile-close"
            className="mobile-search__top--icon"
            onClick={() => {
              setMobileSearchOpen(false);
              setMobileQuery("");
              setMobileResults([]);
            }}
            dangerouslySetInnerHTML={svg("close22")}
          />
        </div>
        <div id="search-mobile-results" className="mobile-search__body">
          {mobileResults.map((r) => (
            <div className="mobile-search__result" key={r.uri}>
              <a href={r.uri}>{r.title}</a>
              <p>{r.description}</p>
            </div>
          ))}
        </div>
      </div>

      <a
        role="button"
        className={`navbar__burger${mobileMenuOpen ? " is-active" : ""}`}
        aria-label="menu"
        aria-expanded={mobileMenuOpen}
        data-ani="false"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
      <div
        className="navbarm__collapse"
        data-open={mobileMenuOpen}
        style={mobileMenuOpen ? { maxHeight: "100%" } : { maxHeight: 0 }}
      >
        <ul dir="ltr">
          {MENU.map((m) => (
            <li className="navbarm__menu--item " key={m.url}>
              <a href={m.url}>{m.name}</a>
            </li>
          ))}
          <li className="navbarm__menu--item ">
            <a href="/tags" className="navbarm__menu--term" data-index="0">
              标签
            </a>
          </li>
          <li className="navbarm__menu--item ">
            <a href="/categories" className="navbarm__menu--term" data-index="1">
              分类
            </a>
          </li>
        </ul>
      </div>

      <div className="navbar__menu">
        <div className="theme">
          <div className="dropdown">
            <button
              className="dropdown-trigger navbar__slide-down navbar-search"
              aria-label="Search Button"
              data-ani="false"
              onClick={focusPageSearch}
              dangerouslySetInnerHTML={svg("search")}
            />
            <div className="dropdown-content"></div>
          </div>
        </div>

        <div className="theme" data-ani="false">
          <div className="dropdown">
            <button
              className="dropdown-trigger navbar__slide-down"
              aria-label="Select Theme Button"
              data-ani="false"
              onClick={() => setThemeOpen(!themeOpen)}
              dangerouslySetInnerHTML={svg("theme")}
            />
            <div className={`dropdown-content select-theme${themeOpen ? " is-active" : ""}`}>
              {["dark", "light"].map((t) => (
                <a
                  key={t}
                  href="#"
                  className={`dropdown-item select-theme__item ${theme === t ? "is-active" : ""}`}
                  onClick={(e) => {
                    e.preventDefault();
                    selectTheme(t);
                  }}
                >
                  {t}
                </a>
              ))}
            </div>
          </div>
        </div>

        {MENU.map((m) => (
          <a
            key={m.url}
            href={m.url}
            className="navbar__menu-item navbar__slide-down "
            dir="ltr"
            data-ani="false"
          >
            {m.name}
          </a>
        ))}
      </div>
    </nav>
  );
}
