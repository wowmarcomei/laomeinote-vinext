import Shell from "../../components/Shell";
import { getAllPosts } from "../../lib/content";

export const metadata = { title: "时光机" };

export default function ArchivePage() {
  const posts = getAllPosts();
  const years = [...new Set(posts.map((p) => p.year))].sort((a, b) => b.localeCompare(a));
  return (
    <Shell type="archive" kind="section">
      <main className="main archive">
        <div className="archive__container">
          {years.map((year) => (
            <div key={year}>
              <span className="archive__key" data-ani="false">
                {year}
              </span>
              <ul className="archive__ul" data-dir="ltr">
                {posts
                  .filter((p) => p.year === year)
                  .map((p) => (
                    <li className="archive__li" data-dir="ltr" key={p.url}>
                      <span className="archive__meta" data-ani="false">
                        <span className="archive__type">posts</span>
                        <span className="archive__date">{p.dateShort}</span>
                      </span>
                      <a href={p.url} className="archive__title" data-title-wrap="wrap" data-dir="ltr">
                        {p.title}
                      </a>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </main>
    </Shell>
  );
}
