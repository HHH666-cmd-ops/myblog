import { Outlet } from "react-router-dom";
import SiteHeader from "./SiteHeader.jsx";
import SiteFooter from "./SiteFooter.jsx";

export default function PageLayout() {
  return (
    <div className="page-layout">
      <div className="page-layout__glow" aria-hidden="true" />
      <SiteHeader />
      <main className="page-layout__main">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}
