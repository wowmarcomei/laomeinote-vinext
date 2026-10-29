import Shell from "../../components/Shell";
import { getTerms, termSize } from "../../lib/content";

export const metadata = { title: "Series" };

export default function SeriesPage() {
  const terms = getTerms("series");
  return (
    <Shell type="series" kind="taxonomy">
      <h3 className="terms__title capitalize h3">Series</h3>
      <main className="terms main">
        <div className="terms__list">
          {terms.map((t) => (
            <a key={t.slug} href={`/series/${t.slug}/`} className={`terms__item ${termSize(t.count)}`}>
              <span className="terms__tags">{t.name}</span>
              <span className="terms__len">({t.count})</span>
            </a>
          ))}
        </div>
      </main>
    </Shell>
  );
}
