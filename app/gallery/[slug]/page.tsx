import Shell from "../../../components/Shell";
import GalleryGrid from "../../../components/GalleryGrid";
import { getGallery, getGalleries } from "../../../lib/content";
import { withCanonical } from "../../../lib/seo";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return getGalleries().map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return withCanonical(`/gallery/${slug}/`, { title: getGallery(slug).title });
}

export default async function GalleryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!["cartoon", "photo"].includes(slug)) notFound();
  return (
    <Shell type="gallery" kind="page">
      <GalleryGrid gallery={getGallery(slug)} />
    </Shell>
  );
}
