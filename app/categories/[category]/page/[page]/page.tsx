import Shell from "../../../../../components/Shell";
import ListPage from "../../../../../components/ListPage";
import { listProps, totalPages } from "../../../../../lib/list";
import { getPostsByTerm, getTerms } from "../../../../../lib/content";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return getTerms("categories").flatMap((t) => {
    const total = totalPages(getPostsByTerm("categories", t.slug));
    return Array.from({ length: total - 1 }, (_, i) => ({ category: t.slug, page: String(i + 2) }));
  });
}

export default async function PaginatedCategory({
  params,
}: {
  params: Promise<{ category: string; page: string }>;
}) {
  const { category: rawCategory, page } = await params;
  const category = decodeURIComponent(rawCategory);
  const posts = getPostsByTerm("categories", category);
  const n = Number(page);
  if (!posts.length || !Number.isInteger(n) || n < 2 || n > totalPages(posts)) notFound();
  return (
    <Shell type="categories" kind="term">
      <ListPage {...listProps(`/categories/${category}/`, n, posts)} />
    </Shell>
  );
}
