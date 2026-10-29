"use client";

import { useEffect, useState } from "react";
import { icons } from "./icons";

export default function GoToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      id="gtt"
      style={{ display: visible ? "block" : "none", cursor: "pointer" }}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <div className="gtt" dangerouslySetInnerHTML={{ __html: icons.gtt }} />
    </div>
  );
}
