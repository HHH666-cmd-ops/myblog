import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { adminApi } from "../../api/admin-client.js";

const navClass = ({ isActive }) =>
  isActive ? "admin-nav__link admin-nav__link--active" : "admin-nav__link";

export default function AdminLayout() {
  const navigate = useNavigate();

  function handleLogout() {
    adminApi.logout();
    navigate("/admin/login", { replace: true });
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">
          <Link to="/admin">博客后台</Link>
        </div>
        <nav className="admin-nav">
          <NavLink to="/admin" end className={navClass}>
            文章管理
          </NavLink>
          <NavLink to="/admin/profile" className={navClass}>
            个人资料
          </NavLink>
          <NavLink to="/admin/posts/new" className={navClass}>
            新建文章
          </NavLink>
        </nav>
        <div className="admin-sidebar__footer">
          <a href="/" target="_blank" rel="noreferrer" className="admin-nav__link">
            查看网站 ↗
          </a>
          <button type="button" className="btn btn--ghost" onClick={handleLogout}>
            退出登录
          </button>
        </div>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
