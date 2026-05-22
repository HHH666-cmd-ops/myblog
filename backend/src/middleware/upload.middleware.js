import multer from "multer";
import { existsSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, extname } from "node:path";
import { appConfig } from "../config/app-config.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const uploadsDir = join(__dirname, "../../uploads");

if (!existsSync(uploadsDir)) {
  mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const safeBase = file.originalname
      .replace(/[^\w.\u4e00-\u9fa5-]/g, "_")
      .slice(0, 60);
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, `${unique}-${safeBase}`);
  },
});

const allowed = {
  image: [".jpg", ".jpeg", ".png", ".gif", ".webp"],
  video: [".mp4", ".webm", ".mov"],
};

function fileFilter(req, file, cb) {
  const ext = extname(file.originalname).toLowerCase();
  const isImage = allowed.image.includes(ext);
  const isVideo = allowed.video.includes(ext);
  if (!isImage && !isVideo) {
    return cb(new Error("仅支持图片（jpg/png/gif/webp）或视频（mp4/webm/mov）"));
  }
  req.uploadKind = isVideo ? "video" : "image";
  cb(null, true);
}

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: appConfig.uploadMaxMb * 1024 * 1024 },
});
