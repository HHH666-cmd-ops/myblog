import { Router } from "express";
import * as profileController from "../controllers/profile.controller.js";

const router = Router();

router.get("/", profileController.getProfile);

export default router;
