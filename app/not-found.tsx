import Shell from "../components/Shell";

export default function NotFound() {
  return (
    <Shell type="page" kind="404">
      <main className="main">
        <div className="notfound">
          <h1 className="notfound__title">404</h1>
          <p className="notfound__text">页面不存在，返回 <a href="/">首页</a></p>
        </div>
      </main>
    </Shell>
  );
}
