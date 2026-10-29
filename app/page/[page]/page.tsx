import Shell from "../../../components/Shell";
import ListPage from "../../../components/ListPage";
import { listProps, totalPages } from "../../../lib/list";
import { getAllPosts } from "../../../lib/content";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return Array.from({ length: totalPages(getAllPosts()) - 1 }, (_, i) => ({ page: String(i + 2) }));
}

export default async function PaginatedHome({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  const n = Number(page);
  if (!Number.isInteger(n) || n < 2 || n > totalPages(getAllPosts())) notFound();
  return (
    <Shell type="page" kind="home">
      <ListPage {...listProps("/", n)} />
    </Shell>
  );
}
