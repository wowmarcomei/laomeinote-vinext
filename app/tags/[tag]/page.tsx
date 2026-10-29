import Shell from "../../../components/Shell";
import ListPage from "../../../components/ListPage";
import { listProps } from "../../../lib/list";
import { getPostsByTerm, getTerms } from "../../../lib/content";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return getTerms("tags").map((t) => ({ tag: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ tag: string }> }) {
  const { tag: rawTag } = await params;
  const tag = decodeURIComponent(rawTag);
  const term = getTerms("tags").find((t) => t.slug === tag);
  return { title: term?.name ?? tag };
}

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag: rawTag } = await params;
  const tag = decodeURIComponent(rawTag);
  const term = getTerms("tags").find((t) => t.slug === tag);
  if (!term) notFound();
  return (
    <Shell type="tags" kind="term">
      <ListPage {...listProps(`/tags/${tag}/`, 1, getPostsByTerm("tags", tag))} />
    </Shell>
  );
}
