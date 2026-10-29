"use client";

import { useEffect, useRef, useState } from "react";
import type { Gallery } from "../lib/content";
import { icons } from "./icons";

function svg(name: string) {
  return { __html: icons[name] };
}

declare global {
  interface Window {
    Masonry?: new (el: Element, opts: unknown) => { layout: () => void };
    imagesLoaded?: (el: Element, cb: () => void) => void;
  }
}

export default function GalleryGrid({ gallery }: { gallery: Gallery }) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState<number | null>(null);

  // 与原站一致：imagesloaded + masonry 瀑布流
  useEffect(() => {
    let cancelled = false;
    const loadScript = (src: string) =>
      new Promise<void>((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) return resolve();
        const s = document.createElement("script");
        s.src = src;
        s.onload = () => resolve();
        s.onerror = reject;
        document.body.appendChild(s);
      });
    (async () => {
      await loadScript("/js/imagesloaded.pkgd.min.js");
      await loadScript("/js/masonry.pkgd.min.js");
      if (cancelled || !gridRef.current || !window.Masonry) return;
      const init = () =>
        new window.Masonry!(gridRef.current!, {
          itemSelector: ".grid-item",
          columnWidth: ".grid-sizer",
          percentPosition: true,
        });
      if (window.imagesLoaded) window.imagesLoaded(gridRef.current, init);
      else init();
    })();
    return () => {
      cancelled = true;
    };
  }, [gallery.slug]);

  // 键盘左右切换 / 关闭
  useEffect(() => {
    if (current === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCurrent(null);
      if (e.key === "ArrowLeft") setCurrent((c) => (c! + gallery.images.length - 1) % gallery.images.length);
      if (e.key === "ArrowRight") setCurrent((c) => (c! + 1) % gallery.images.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current, gallery.images.length]);

  const img = current !== null ? gallery.images[current] : null;

  return (
    <main className="gallery main">
      <div className="grid gallery__container" ref={gridRef}>
        <div className="grid-sizer"></div>
        {gallery.images.map((image, i) => (
          <div className="grid-item" key={image.image} onClick={() => setCurrent(i)}>
            <img src={image.image} alt={image.caption} />
            <div className="grid-item__desc hide">
              <span className="grid-item__desc--text">{image.caption}</span>
            </div>
          </div>
        ))}
      </div>

      {img && (
        <div className="modal micromodal-slide is-open" id="modal" aria-hidden="false" style={{ display: "block" }}>
          <div className="modal__overlay" tabIndex={-1}>
            <div className="modal__container" role="dialog" aria-modal="true" aria-labelledby="modal-title">
              <div className="modal__content" id="modal-content">
                <img src={img.image} alt={img.caption} style={{ maxWidth: "100%", maxHeight: "80vh" }} />
              </div>
              <span className="modal__items">
                <span className="modal__header">
                  <div className="modal__paging" title="Page Info" aria-label="Current Page">
                    {current! + 1} / {gallery.images.length}
                  </div>
                  <div
                    className="modal__icon modal__toolbar modal__toolbar--close"
                    title="Close"
                    aria-label="Close Button"
                    onClick={() => setCurrent(null)}
                    dangerouslySetInnerHTML={svg("galleryClose")}
                  />
                </span>
                <div
                  className="modal__icon modal__arrow modal__arrow--left"
                  title="Arrow Left"
                  aria-label="Arrow Left Button"
                  onClick={() => setCurrent((current! + gallery.images.length - 1) % gallery.images.length)}
                  dangerouslySetInnerHTML={svg("galleryLeft")}
                />
                <div
                  className="modal__icon modal__arrow modal__arrow--right"
                  title="Arrow Right"
                  aria-label="Arrow Right Button"
                  onClick={() => setCurrent((current! + 1) % gallery.images.length)}
                  dangerouslySetInnerHTML={svg("galleryRight")}
                />
                <div className="modal__caption">
                  <span className="modal__caption--text">{img.caption}</span>
                </div>
              </span>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
