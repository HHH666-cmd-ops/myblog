import express from "express";
import cors from "cors";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { appConfig } from "./config/app-config.js";
import apiRoutes from "./routes/index.js";
import { notFoundHandler } from "./middleware/not-found-handler.js";
import { errorHandler } from "./middleware/error-handler.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const frontendDistPath = join(__dirname, "../../frontend/dist");
const uploadsPath = join(__dirname, "../uploads");

const app = express();

app.use(
  cors({
    origin: appConfig.corsOrigin,
  })
);
app.use(express.json({ limit: "2mb" }));

app.use("/api/uploads", express.static(uploadsPath));
app.use("/api", apiRoutes);

const hasFrontendBuild = existsSync(join(frontendDistPath, "index.html"));

if (hasFrontendBuild) {
  app.use(express.static(frontendDistPath));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) {
      return next();
    }
    res.sendFile(join(frontendDistPath, "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.type("html").send(`
      <!DOCTYPE html>
      <html lang="zh-CN"><head><meta charset="utf-8"><title>个人博客 API</title></head>
      <body style="font-family:sans-serif;padding:2rem;line-height:1.6">
        <h1>后端 API 已运行</h1>
        <p>前端尚未构建。请在服务器执行：</p>
        <pre>cd frontend && npm install && npm run build</pre>
        <p>然后重启后端，或访问 <a href="/api/health">/api/health</a> 检查接口。</p>
      </body></html>
    `);
  });
}

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(appConfig.port, () => {
  console.log(`博客服务已启动，端口 ${appConfig.port}`);
  console.log(`API 路径: /api（本机可用 http://localhost:${appConfig.port}/api）`);
  console.log(
    appConfig.adminPassword
      ? "管理密码: 已从 .env 加载"
      : "管理密码: 未配置（请在 backend/.env 设置 ADMIN_PASSWORD）"
  );
  if (hasFrontendBuild) {
    console.log("已托管前端构建目录 frontend/dist");
  } else {
    console.warn("未找到 frontend/dist，仅提供 API（请先 npm run build）");
  }
});
