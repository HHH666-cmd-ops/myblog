import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="container page not-found">
      <p className="not-found__code">404</p>
      <h1 className="not-found__title">页面不存在</h1>
      <p className="not-found__desc">你访问的地址可能已移动或输入有误。</p>
      <Link to="/" className="btn btn--primary">
        返回首页
      </Link>
    </div>
  );
}
