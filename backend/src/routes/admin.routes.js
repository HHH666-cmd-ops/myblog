import { Router } from "express";
import * as adminController from "../controllers/admin.controller.js";
import { requireAdmin } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

const router = Router();

router.post("/login", adminController.login);

router.use(requireAdmin);

router.post("/logout", adminController.logout);
router.get("/profile", adminController.getProfile);
router.put("/profile", adminController.updateProfile);

router.get("/posts", adminController.listPosts);
router.get("/posts/:id", adminController.getPost);
router.post("/posts", adminController.createPost);
router.put("/posts/:id", adminController.updatePost);
router.delete("/posts/:id", adminController.deletePost);

router.post("/upload", upload.single("file"), adminController.uploadMedia);

export default router;
