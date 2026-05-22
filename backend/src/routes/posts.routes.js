import { Router } from "express";
import * as postsController from "../controllers/posts.controller.js";

const router = Router();

router.get("/", postsController.listPosts);
router.get("/:slug", postsController.getPost);

export default router;
