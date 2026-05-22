import { BrowserRouter, Routes, Route } from "react-router-dom";
import PageLayout from "../components/layout/PageLayout.jsx";
import HomePage from "../pages/HomePage.jsx";
import PostDetailPage from "../pages/PostDetailPage.jsx";
import AboutPage from "../pages/AboutPage.jsx";
import NotFoundPage from "../pages/NotFoundPage.jsx";
import AdminLoginPage from "../pages/admin/AdminLoginPage.jsx";
import AdminLayout from "../components/admin/AdminLayout.jsx";
import AdminGuard from "../components/admin/AdminGuard.jsx";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage.jsx";
import AdminPostEditPage from "../pages/admin/AdminPostEditPage.jsx";
import AdminProfilePage from "../pages/admin/AdminProfilePage.jsx";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PageLayout />}>
          <Route index element={<HomePage />} />
          <Route path="posts/:slug" element={<PostDetailPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminGuard />}>
          <Route element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="profile" element={<AdminProfilePage />} />
            <Route path="posts/:id" element={<AdminPostEditPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
