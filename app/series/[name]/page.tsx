import Shell from "../../../components/Shell";
import ListPage from "../../../components/ListPage";
import { listProps } from "../../../lib/list";
import { getPostsByTerm, getTerms } from "../../../lib/content";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return getTerms("series").map((t) => ({ name: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ name: string }> }) {
  const { name: rawName } = await params;
  const name = decodeURIComponent(rawName);
  const term = getTerms("series").find((t) => t.slug === name);
  return { title: term?.name ?? name };
}

export default async function SeriesTermPage({ params }: { params: Promise<{ name: string }> }) {
  const { name: rawName } = await params;
  const name = decodeURIComponent(rawName);
  const term = getTerms("series").find((t) => t.slug === name);
  if (!term) notFound();
  return (
    <Shell type="series" kind="term">
      <ListPage {...listProps(`/series/${name}/`, 1, getPostsByTerm("series", name))} />
    </Shell>
  );
}
