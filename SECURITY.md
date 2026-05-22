# 安全与隐私说明

## 切勿公开的文件

- `backend/.env` — 管理后台密码、端口等
- `backend/src/data/sessions.json` — 登录 token
- `backend/uploads/*` — 上传的媒体文件（除 `.gitkeep`）

## 仓库内为示例数据

- `backend/src/data/seed-data.json` — 姓名、邮箱等为占位符，请改成你自己的或部署后通过 `/admin` 修改
- `backend/.env.example` — 无真实密码

## Git 远程地址

本地 `.git/config` 已改为占位符 `YOUR_USERNAME/YOUR_REPO`。推送前请执行：

```bash
git remote set-url origin https://github.com/你的用户名/你的仓库.git
```

## 若曾误提交密码或服务器 IP

1. 立即在服务器修改 `ADMIN_PASSWORD`
2. 从 Git 历史中移除敏感文件（如 `git filter-repo`）或作废旧仓库重新推送
3. 删除 `backend/src/data/sessions.json` 内容并重启后端
4. 勿打包上传整个 `.git` 目录给他人，除非已确认历史中无 `.env` 或真实 IP
