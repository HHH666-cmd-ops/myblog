# 个人博客（前后端分离）

学生向全栈练习项目：前端 React + Vite，后端 Express REST API。目录分层清晰，命名规范，适合作为作品集展示。

## 项目结构

```
personal-blog/
├── README.md                 # 本说明
├── .gitignore
├── backend/                  # 后端 API
│   ├── package.json
│   ├── .env.example
│   └── src/
│       ├── server.js         # 服务入口
│       ├── config/
│       │   └── app-config.js
│       ├── routes/           # 路由
│       ├── controllers/      # 控制器
│       ├── services/         # 业务逻辑
│       ├── middleware/       # 中间件
│       └── data/
│           └── seed-data.json
└── frontend/                 # 前端 SPA
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── api/
        ├── router/
        ├── pages/
        ├── components/
        ├── hooks/
        └── styles/
```

## 快速开始

需要已安装 [Node.js](https://nodejs.org/)（建议 18+）。

### 1. 启动后端

```bash
cd backend
npm install
npm run dev
```

API 地址：`http://localhost:3001/api`

| 接口 | 说明 |
|------|------|
| `GET /api/health` | 健康检查 |
| `GET /api/posts` | 文章列表 |
| `GET /api/posts/:slug` | 文章详情 |
| `GET /api/profile` | 个人资料 |
| `POST /api/admin/login` | 管理后台登录 |
| `GET/PUT /api/admin/profile` | 管理个人资料 |
| `CRUD /api/admin/posts` | 管理文章 |
| `POST /api/admin/upload` | 上传图片/视频 |

### 2. 启动前端

新开一个终端：

```bash
cd frontend
npm install
npm run dev
```

浏览器打开：`http://localhost:5173`

前端通过 Vite 代理将 `/api` 转发到后端，无需额外配置 CORS（开发环境）。

## 管理后台（推荐）

1. 在 `backend/.env` 设置 `ADMIN_PASSWORD=你的强密码`
2. 启动前后端后访问 **`http://localhost:5173/admin`**（生产环境：`http://你的域名/admin`）
3. 登录后可：
   - 新建/编辑/删除文章
   - 上传封面、正文插图、视频
   - 修改「关于」页个人资料

正文插图格式（上传后会自动插入）：

```markdown
![](/api/uploads/xxx.jpg)
[video](/api/uploads/xxx.mp4)
```

数据保存在 `backend/src/data/seed-data.json`，上传文件在 `backend/uploads/`。

仍可直接编辑 `seed-data.json`（与后台二选一或混用）。

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | React 18、React Router、Vite |
| 后端 | Node.js、Express |
| 数据 | JSON 文件（可后续换 SQLite / MongoDB） |

## 服务器部署（宝塔等）

访问公网 **白屏**时，请阅读 **[DEPLOY.md](./DEPLOY.md)**。

要点：必须先 `cd frontend && npm run build`，再启动 `backend`；生产环境由后端托管 `frontend/dist`，或通过 Nginx 指向 `dist` 并反代 `/api`。

## 公开上传前（隐私检查）

上传 GitHub / 公网前请确认：

| 不要提交 | 说明 |
|----------|------|
| `backend/.env` | 含 `ADMIN_PASSWORD`，仅保留 `.env.example` |
| `backend/src/data/sessions.json` | 登录会话（已在 `.gitignore`） |
| `backend/uploads/` 内真实文件 | 用户上传的图片/视频 |
| 真实邮箱、电话、密码 | 改 `seed-data.json` 为示例或上线后在后台改 |

复制环境变量：`cp backend/.env.example backend/.env`，再在本地填写密码，**勿 push `.env`**。

推送 GitHub 前设置远程地址：

```bash
git remote set-url origin https://github.com/你的用户名/你的仓库.git
```

## 后续可扩展

- 数据库持久化（MySQL / SQLite）
- 多用户与更完善的权限
- 富文本编辑器
