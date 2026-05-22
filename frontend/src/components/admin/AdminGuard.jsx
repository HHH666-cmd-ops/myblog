import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getAdminToken } from "../../api/admin-client.js";

export default function AdminGuard() {
  const location = useLocation();
  const token = getAdminToken();

  if (!token) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
