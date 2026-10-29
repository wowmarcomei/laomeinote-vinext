import Shell from "../../../../../components/Shell";
import ListPage from "../../../../../components/ListPage";
import { listProps, totalPages } from "../../../../../lib/list";
import { getPostsByTerm, getTerms } from "../../../../../lib/content";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return getTerms("tags").flatMap((t) => {
    const total = totalPages(getPostsByTerm("tags", t.slug));
    return Array.from({ length: total - 1 }, (_, i) => ({ tag: t.slug, page: String(i + 2) }));
  });
}

export default async function PaginatedTag({ params }: { params: Promise<{ tag: string; page: string }> }) {
  const { tag: rawTag, page } = await params;
  const tag = decodeURIComponent(rawTag);
  const posts = getPostsByTerm("tags", tag);
  const n = Number(page);
  if (!posts.length || !Number.isInteger(n) || n < 2 || n > totalPages(posts)) notFound();
  return (
    <Shell type="tags" kind="term">
      <ListPage {...listProps(`/tags/${tag}/`, n, posts)} />
    </Shell>
  );
}
