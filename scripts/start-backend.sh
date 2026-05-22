#!/bin/bash
# 服务器上启动博客后端（在项目根目录执行: bash scripts/start-backend.sh）

set -e

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT/backend"

if [ -n "$NODE_BIN_DIR" ]; then
  export PATH="$NODE_BIN_DIR:$PATH"
fi

if ! command -v node >/dev/null 2>&1; then
  echo "错误: 找不到 node。请安装 Node.js 或设置环境变量 NODE_BIN_DIR 为 node 所在目录"
  exit 1
fi

echo "Node: $(node -v)"
echo "目录: $ROOT/backend"

if [ ! -d "node_modules" ]; then
  echo "正在 npm install..."
  npm install
fi

export NODE_ENV=production
export PORT="${PORT:-3001}"

echo "启动端口: $PORT"
exec node src/server.js
