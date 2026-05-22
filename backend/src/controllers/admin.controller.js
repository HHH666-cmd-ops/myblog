import * as authService from "../services/auth.service.js";
import * as adminService from "../services/admin.service.js";

export async function login(req, res, next) {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ success: false, message: "请输入密码" });
    }
    const data = await authService.login(password);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function logout(req, res, next) {
  try {
    await authService.logout(req.adminToken);
    res.json({ success: true, message: "已退出登录" });
  } catch (error) {
    next(error);
  }
}

export async function listPosts(req, res, next) {
  try {
    const posts = await adminService.listPostsForAdmin();
    res.json({ success: true, data: posts });
  } catch (error) {
    next(error);
  }
}

export async function getPost(req, res, next) {
  try {
    const post = await adminService.getPostForAdmin(req.params.id);
    res.json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
}

export async function createPost(req, res, next) {
  try {
    const post = await adminService.createPost(req.body);
    res.status(201).json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
}

export async function updatePost(req, res, next) {
  try {
    const post = await adminService.updatePost(req.params.id, req.body);
    res.json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
}

export async function deletePost(req, res, next) {
  try {
    await adminService.removePost(req.params.id);
    res.json({ success: true, message: "已删除" });
  } catch (error) {
    next(error);
  }
}

export async function getProfile(req, res, next) {
  try {
    const profile = await adminService.getProfile();
    res.json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const profile = await adminService.updateProfile(req.body);
    res.json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
}

export async function uploadMedia(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "请选择文件" });
    }
    const url = adminService.buildPublicUploadUrl(req.file.filename);
    res.json({
      success: true,
      data: {
        url,
        filename: req.file.filename,
        kind: req.uploadKind,
        originalName: req.file.originalname,
        size: req.file.size,
      },
    });
  } catch (error) {
    next(error);
  }
}
