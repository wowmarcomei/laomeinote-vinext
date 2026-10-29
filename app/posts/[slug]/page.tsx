import Shell from "../../../components/Shell";
import SinglePost from "../../../components/SinglePost";
import { getAllPosts, getPost } from "../../../lib/content";
import { absoluteUrl, site } from "../../../lib/site";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description || post.excerpt,
    alternates: { canonical: absoluteUrl(post.url) },
    openGraph: {
      title: post.title,
      description: post.description || post.excerpt,
      url: absoluteUrl(post.url),
      images: post.image ? [post.image] : undefined,
      type: "article",
    },
    keywords: post.keywords,
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  return (
    <Shell type="posts" kind="page">
      <SinglePost post={post} />
    </Shell>
  );
}
