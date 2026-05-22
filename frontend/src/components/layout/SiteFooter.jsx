export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <p className="site-footer__copy">© {year} 个人博客 · 前后端分离练习项目</p>
        <p className="site-footer__meta">React + Vite · Express API</p>
      </div>
    </footer>
  );
}
