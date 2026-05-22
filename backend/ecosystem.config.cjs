/** PM2 配置：在 backend 目录执行 pm2 start ecosystem.config.cjs */
module.exports = {
  apps: [
    {
      name: "personal-blog-api",
      script: "src/server.js",
      cwd: __dirname,
      env: {
        NODE_ENV: "production",
        PORT: 3001,
      },
      env_file: ".env",
      autorestart: true,
      max_restarts: 10,
    },
  ],
};
