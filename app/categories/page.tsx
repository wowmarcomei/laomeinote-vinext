import Shell from "../../components/Shell";
import { getTerms, termSize } from "../../lib/content";

export const metadata = { title: "Categories" };

export default function CategoriesPage() {
  const terms = getTerms("categories");
  return (
    <Shell type="categories" kind="taxonomy">
      <h3 className="terms__title capitalize h3">Categories</h3>
      <main className="terms main">
        <div className="terms__list">
          {terms.map((t) => (
            <a key={t.slug} href={`/categories/${t.slug}/`} className={`terms__item ${termSize(t.count)}`}>
              <span className="terms__tags">{t.name}</span>
              <span className="terms__len">({t.count})</span>
            </a>
          ))}
        </div>
      </main>
    </Shell>
  );
}
