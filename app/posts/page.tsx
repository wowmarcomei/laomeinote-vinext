import Shell from "../../components/Shell";
import ListPage from "../../components/ListPage";
import { listProps } from "../../lib/list";

export const metadata = { title: "文章" };

export default function PostsPage() {
  return (
    <Shell type="posts" kind="section">
      <ListPage {...listProps("/posts/")} />
    </Shell>
  );
}
