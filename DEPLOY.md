# 宝塔部署与「后端打不开」排查

将下文中的 `<站点目录>` 替换为你在宝塔里为该网站设置的根目录名（多为域名或主机名文件夹）。

## 管理后台地址

| 地址 | 说明 |
|------|------|
| `http://<你的域名>/admin` | **管理后台**（需先构建前端并配置反代） |
| `http://<你的域名>:3001/api/health` | 外网常 **超时**（3001 未对公网开放） |
| `http://<你的域名>/api/health` | **应返回 JSON**（需反代 + 后端在跑） |

在 `backend/.env` 设置：

```env
ADMIN_PASSWORD=你的强密码
```

上传的图片/视频通过 `/api/uploads/...` 访问，与 `/api` 使用同一条反代即可。

后端 API 路径示例：

- `GET /api/health` — 健康检查
- `GET /api/posts` — 文章列表
- `POST /api/admin/login` — 后台登录

---

## 三步修好（按顺序做）

### 第 1 步：在服务器上启动后端

宝塔 **终端**（先进入项目根目录）：

```bash
# 若 node 不在 PATH，先设置：export NODE_BIN_DIR=/你的/node/bin目录
cd /www/wwwroot/<站点目录>/personal-blog
bash scripts/start-backend.sh
```

或：

```bash
# 若 node 不在 PATH，先设置：export NODE_BIN_DIR=/你的/node/bin目录
cd /www/wwwroot/<站点目录>/personal-blog/backend
npm install
node src/server.js
```

看到端口启动日志后，**在同一终端**测试：

```bash
curl http://localhost:3001/api/health
```

应输出：`{"success":true,"message":"API 运行正常"}`  

若这里失败 → 先解决 Node/依赖，不要配反代。

---

### 第 2 步：配置 Nginx 反代 `/api`（关键）

浏览器访问的是 **80 端口 Nginx**，不会自动连到 3001。

**宝塔面板：**

1. **网站** → 你的站点 → **反向代理** → **添加反向代理**
2. 填写：
   - **代理名称**：`blog-api`（随意）
   - **代理目录**：`/api`
   - **目标 URL**：`http://localhost:3001`
   - 发送域名：`$host`
3. 保存

**或用配置文件**（网站 → 配置文件），在 `server { }` 内加入 `deploy/nginx-api-proxy.conf` 中的 `location /api/` 段。

保存后 **重载 Nginx**。

---

### 第 3 步：用正确地址在浏览器测试

在浏览器打开（不要加 `:3001`）：

**`http://<你的域名>/api/health`**

- 成功：页面显示 JSON  
- 仍是 nginx 404：反代未生效，检查代理目录是否为 `/api`  
- 502 Bad Gateway：后端没跑，回到第 1 步  

首页：**`http://<你的域名>`** — 文章列表应能加载。

---

## 让后端一直运行（关 SSH 也不停）

### 方式 A：宝塔 Node 项目（推荐）

1. **网站** → **Node 项目** → **添加 Node 项目**
2. 项目目录：`/www/wwwroot/<站点目录>/personal-blog/backend`
3. 启动文件：`src/server.js`
4. 端口：`3001`
5. Node 版本：**16 或 18**（按面板可选版本）
6. 点击 **启动**

### 方式 B：PM2

```bash
npm install -g pm2
cd /www/wwwroot/<站点目录>/personal-blog/backend
pm2 start ecosystem.config.cjs
pm2 save
pm2 list
```

---

## 为什么 `:3001` 在浏览器里超时？

云服务器 **安全组 / 宝塔防火墙** 通常只开放 **80、443**，**3001 不对公网开放** 是正常现象。

正确做法：

- 服务器上测试：`curl http://localhost:3001/api/health`
- 外网访问：`http://<你的域名>/api/...`（Nginx 反代到 3001）

不必强行对外开放 3001。

---

## 网站目录设置（前端）

| 项 | 正确值 |
|----|--------|
| 网站目录 | `/www/wwwroot/<站点目录>` |
| 运行目录 | `/personal-blog/frontend/dist` |

前端在本机构建后上传 `dist`，或在服务器 `frontend` 里 `rm -rf node_modules && npm install && npm run build`（不要从 Windows 拷贝 node_modules）。

---

## 故障对照表

| 现象 | 原因 | 处理 |
|------|------|------|
| `/admin` 404 | 前端未重新 build 或未覆盖 `web/` | 见下方「管理后台 404」 |
| `:3001` 超时 | 端口未对公网开放 | 用 `http://<你的域名>/api/health` |
| `/api/health` nginx 404 | 未配反代 | 第 2 步 |
| `/api/health` 502 | 后端未启动 | 第 1 步 + PM2/Node 项目 |
| esbuild 红字 | node_modules 平台不对 | 删 node_modules 后在服务器 npm install |
| `crypto.getRandomValues` | Node 16 构建失败 | 用 Vite 5 + `build.mjs`，或在电脑 build 后上传 dist |

---

## 一键自检命令（服务器终端）

```bash
# 若 node 不在 PATH，先设置：export NODE_BIN_DIR=/你的/node/bin目录
cd /www/wwwroot/<站点目录>/personal-blog
curl -s http://localhost:3001/api/health
curl -s http://localhost/api/health
```

第一条必须成功；第二条成功说明反代正常。

---

## 管理后台 `/admin` 仍 404

**原因：** `npm run build` 失败，或 `dist` 未发布到网站目录。

**在服务器项目根目录执行：**

```bash
# 若 node 不在 PATH，先设置：export NODE_BIN_DIR=/你的/node/bin目录
cd /www/wwwroot/<站点目录>/personal-blog
bash scripts/deploy-frontend-server.sh
```

若 build 失败：在电脑 `cd frontend && npm run build`，再把 `frontend/dist` 上传到服务器 `personal-blog/frontend/dist/`（及站点下的 `web/` 目录，若使用）。

保存后浏览器 **Ctrl+F5** 打开 `/admin`。
