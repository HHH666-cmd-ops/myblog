import * as authService from "../services/auth.service.js";

export async function requireAdmin(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : "";
    const valid = await authService.verifyToken(token);
    if (!valid) {
      return res.status(401).json({ success: false, message: "请先登录管理后台" });
    }
    req.adminToken = token;
    next();
  } catch (error) {
    next(error);
  }
}
