import Shell from "../components/Shell";
import ListPage from "../components/ListPage";
import { listProps } from "../lib/list";
import { withCanonical } from "../lib/seo";

export const metadata = withCanonical("/");

export default function HomePage() {
  return (
    <Shell type="page" kind="home">
      <ListPage {...listProps("/")} />
    </Shell>
  );
}
