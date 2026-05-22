#!/bin/bash
# 在服务器项目根目录执行: bash scripts/deploy-frontend-server.sh
set -e

if [ -n "$NODE_BIN_DIR" ]; then
  export PATH="$NODE_BIN_DIR:$PATH"
fi

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
WEB="$(dirname "$ROOT")/web"

if ! command -v node >/dev/null 2>&1; then
  echo "错误: 找不到 node。请设置 NODE_BIN_DIR 或安装 Node.js"
  exit 1
fi

echo "==> 项目目录: $ROOT"
echo "==> 构建前端..."
cd "$ROOT/frontend"
rm -rf node_modules dist
npm install
npm run build

if [ ! -f dist/index.html ]; then
  echo "错误: dist/index.html 不存在，构建失败"
  exit 1
fi

echo "==> 发布到 web 目录: $WEB"
mkdir -p "$WEB"
rm -rf "$WEB"/*
cp -rf dist/* "$WEB/"
chown -R www:www "$WEB" 2>/dev/null || true

echo "==> 检查是否包含 admin 路由..."
if grep -rq "admin/login" "$WEB/assets/" 2>/dev/null; then
  echo "OK: 构建产物包含管理后台"
else
  echo "警告: 未在 assets 中找到 admin 字样，请检查构建日志"
fi

echo "完成。请浏览器访问你的站点 /admin 并 Ctrl+F5 强刷"
