import { Router } from "express";
import postsRoutes from "./posts.routes.js";
import profileRoutes from "./profile.routes.js";
import adminRoutes from "./admin.routes.js";

const router = Router();

router.get("/health", (req, res) => {
  res.json({ success: true, message: "API 运行正常" });
});

router.use("/posts", postsRoutes);
router.use("/profile", profileRoutes);
router.use("/admin", adminRoutes);

export default router;
