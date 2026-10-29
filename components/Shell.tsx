import type { ReactNode } from "react";
import Navbar from "./Navbar";
import GoToTop from "./GoToTop";
import { icons } from "./icons";
import { site } from "../lib/site";

function svg(name: string) {
  return { __html: icons[name] };
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__social">
        <div className="social">
          {site.footerSocial.map((s) => (
            <a key={s.name} href={s.url} title={s.name} aria-label={s.name}>
              <span dangerouslySetInnerHTML={svg(s.icon)} />
            </a>
          ))}
        </div>
      </div>

      <GoToTop />

      <hr />

      <div className="basicflex flexwrap"></div>

      <div className="footer__poweredby">
        <p className="caption">©{new Date().getFullYear()}, All Rights Reserved</p>
        <p className="caption">
          Powered by{" "}
          <a href="https://gohugo.io/" target="_blank" rel="noreferrer">
            Hugo
          </a>{" "}
          and the{" "}
          <a href="https://github.com/zzossig/hugo-theme-zzo" target="_blank" rel="noreferrer">
            Zzo theme
          </a>
        </p>
      </div>
    </footer>
  );
}

// 页面外壳：对应原站 baseof.html 中 wrapper 部分
export default function Shell({
  type,
  kind,
  children,
}: {
  type: string;
  kind: string;
  children: ReactNode;
}) {
  return (
    <>
      <div className="wrapper" data-type={type} data-kind={kind}>
        <Navbar />
        <header className="header hide-mobile"></header>
        {children}
        <Footer />
      </div>
      <div className="wrapper__right hide" data-pad="true" dir="ltr"></div>
    </>
  );
}
