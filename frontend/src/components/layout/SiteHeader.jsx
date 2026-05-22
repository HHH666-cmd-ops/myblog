import { NavLink } from "react-router-dom";

const navClass = ({ isActive }) =>
  isActive ? "site-header__link site-header__link--active" : "site-header__link";

export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <NavLink to="/" className="site-header__brand">
          <span className="site-header__mark" aria-hidden="true" />
          <span>
            <span className="site-header__title">个人博客</span>
            <span className="site-header__subtitle">Student · Developer</span>
          </span>
        </NavLink>
        <nav className="site-header__nav" aria-label="主导航">
          <NavLink to="/" end className={navClass}>
            文章
          </NavLink>
          <NavLink to="/about" className={navClass}>
            关于
          </NavLink>
          <NavLink to="/admin" className={navClass}>
            管理
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
