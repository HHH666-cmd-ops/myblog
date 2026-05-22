import * as postsService from "../services/posts.service.js";

export async function listPosts(req, res, next) {
  try {
    const posts = await postsService.getAllPosts();
    const summary = posts.map(
      ({
        id,
        slug,
        title,
        summary,
        tags,
        publishedAt,
        readMinutes,
        coverImage,
      }) => ({
        id,
        slug,
        title,
        summary,
        tags,
        publishedAt,
        readMinutes,
        coverImage: coverImage || null,
      })
    );
    res.json({ success: true, data: summary });
  } catch (error) {
    next(error);
  }
}

export async function getPost(req, res, next) {
  try {
    const post = await postsService.getPostBySlug(req.params.slug);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "文章不存在",
      });
    }
    res.json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
}
