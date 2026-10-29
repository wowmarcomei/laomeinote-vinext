import Shell from "../../components/Shell";
import ListPage from "../../components/ListPage";
import { getGalleries, getTerms } from "../../lib/content";

export const metadata = { title: "Gallery" };

export default function GalleryIndexPage() {
  const cards = getGalleries().map((g) => ({
    url: `/gallery/${g.slug}/`,
    title: g.title,
    image: g.image,
    dateText: "",
    readingTime: 0,
    excerpt: g.description,
  }));
  return (
    <Shell type="gallery" kind="section">
      <ListPage
        cards={cards}
        pagination={{ current: 1, total: 1, basePath: "/gallery/" }}
        tags={getTerms("tags")}
        categories={getTerms("categories")}
        series={getTerms("series")}
      />
    </Shell>
  );
}
