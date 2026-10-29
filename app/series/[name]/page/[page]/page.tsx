import Shell from "../../../../../components/Shell";
import ListPage from "../../../../../components/ListPage";
import { listProps, totalPages } from "../../../../../lib/list";
import { getPostsByTerm, getTerms } from "../../../../../lib/content";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return getTerms("series").flatMap((t) => {
    const total = totalPages(getPostsByTerm("series", t.slug));
    return Array.from({ length: total - 1 }, (_, i) => ({ name: t.slug, page: String(i + 2) }));
  });
}

export default async function PaginatedSeries({ params }: { params: Promise<{ name: string; page: string }> }) {
  const { name: rawName, page } = await params;
  const name = decodeURIComponent(rawName);
  const posts = getPostsByTerm("series", name);
  const n = Number(page);
  if (!posts.length || !Number.isInteger(n) || n < 2 || n > totalPages(posts)) notFound();
  return (
    <Shell type="series" kind="term">
      <ListPage {...listProps(`/series/${name}/`, n, posts)} />
    </Shell>
  );
}
