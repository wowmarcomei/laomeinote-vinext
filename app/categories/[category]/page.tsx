import Shell from "../../../components/Shell";
import ListPage from "../../../components/ListPage";
import { listProps } from "../../../lib/list";
import { getPostsByTerm, getTerms } from "../../../lib/content";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return getTerms("categories").map((t) => ({ category: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category: rawCategory } = await params;
  const category = decodeURIComponent(rawCategory);
  const term = getTerms("categories").find((t) => t.slug === category);
  return { title: term?.name ?? category };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: rawCategory } = await params;
  const category = decodeURIComponent(rawCategory);
  const term = getTerms("categories").find((t) => t.slug === category);
  if (!term) notFound();
  return (
    <Shell type="categories" kind="term">
      <ListPage {...listProps(`/categories/${category}/`, 1, getPostsByTerm("categories", category))} />
    </Shell>
  );
}
