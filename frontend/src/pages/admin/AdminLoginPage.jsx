import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminApi } from "../../api/admin-client.js";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      await adminApi.login(password);
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-login">
      <form className="admin-card admin-login__form" onSubmit={handleSubmit}>
        <h1>博客管理后台</h1>
        <p className="admin-login__hint">在服务器 backend/.env 中设置 ADMIN_PASSWORD 后使用</p>
        <label className="admin-field">
          <span>管理密码</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="请输入密码"
            autoComplete="current-password"
            required
          />
        </label>
        {error && <p className="admin-error">{error}</p>}
        <button type="submit" className="btn btn--primary" disabled={loading}>
          {loading ? "登录中…" : "登录"}
        </button>
        <p className="admin-login__back">
          <a href="/">← 返回网站首页</a>
        </p>
      </form>
    </div>
  );
}
