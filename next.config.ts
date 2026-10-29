import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 纯静态博客：全部页面构建期预渲染，Workers 只负责静态分发
  output: "export",
  trailingSlash: true,
};

export default nextConfig;
