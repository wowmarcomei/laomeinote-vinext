import type { CardData, PaginationData } from "../components/ListPage";
import { getAllPosts, getTerms, type Post } from "./content";
import { site } from "./site";

export function toCard(post: Post): CardData {
  return {
    url: post.url,
    title: post.title,
    image: post.image,
    dateText: post.dateText,
    readingTime: post.readingTime,
    excerpt: post.excerpt,
  };
}

export function listProps(basePath: string, page = 1, posts = getAllPosts()) {
  const total = Math.max(1, Math.ceil(posts.length / site.paginate));
  const cards = posts.slice((page - 1) * site.paginate, page * site.paginate).map(toCard);
  const pagination: PaginationData = { current: page, total, basePath };
  return {
    cards,
    pagination,
    tags: getTerms("tags"),
    categories: getTerms("categories"),
    series: getTerms("series"),
  };
}

export function totalPages(posts: Post[]): number {
  return Math.max(1, Math.ceil(posts.length / site.paginate));
}
