import Shell from "../../components/Shell";
import { getAbout } from "../../lib/content";

export const metadata = { title: "关于" };

export default function AboutPage() {
  const about = getAbout();
  return (
    <Shell type="about" kind="page">
      <main className="main about">
        <article
          className="single__contents single__contents--about"
          data-dir="ltr"
          data-ani="false"
          dangerouslySetInnerHTML={{ __html: about.html }}
        />
      </main>
    </Shell>
  );
}
