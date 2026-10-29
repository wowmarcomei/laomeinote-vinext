// 构建后将百分号编码的目录/文件名还原为 UTF-8（与原站 Hugo 输出一致，
// 静态服务器/Workers 按解码后的路径查找文件）
import fs from "node:fs";
import path from "node:path";

const root = path.join(process.cwd(), "dist", "client");
let renamed = 0;

function walk(dir: string) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    if (entry.name.includes("%")) {
      let decoded: string;
      try {
        decoded = decodeURIComponent(entry.name);
      } catch {
        continue;
      }
      const target = path.join(dir, decoded);
      if (decoded !== entry.name && !fs.existsSync(target)) {
        fs.renameSync(full, target);
        renamed++;
      }
    }
  }
}

walk(root);
console.log(`路径还原完成: ${renamed} 个文件/目录`);
