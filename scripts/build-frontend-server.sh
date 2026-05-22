#!/bin/bash
# 服务器上构建前端（Node 16 可用 build.mjs）
set -e

if [ -n "$NODE_BIN_DIR" ]; then
  export PATH="$NODE_BIN_DIR:$PATH"
fi

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
WEB="$(dirname "$ROOT")/web"

if ! command -v node >/dev/null 2>&1; then
  echo "错误: 找不到 node"
  exit 1
fi

cd "$ROOT/frontend"
rm -rf node_modules package-lock.json dist
npm install
npm run build

mkdir -p "$WEB"
rm -rf "$WEB"/*
cp -rf dist/* "$WEB/"
chown -R www:www "$WEB" 2>/dev/null || true

echo "构建完成。assets:"
ls -la dist/assets/
