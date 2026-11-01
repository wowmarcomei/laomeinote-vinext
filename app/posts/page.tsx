import Shell from "../../components/Shell";
import ListPage from "../../components/ListPage";
import { listProps } from "../../lib/list";
import { withCanonical } from "../../lib/seo";

export const metadata = withCanonical("/posts/", { title: "文章" });

export default function PostsPage() {
  return (
    <Shell type="posts" kind="section">
      <ListPage {...listProps("/posts/")} />
    </Shell>
  );
}
