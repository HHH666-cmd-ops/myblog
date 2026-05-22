import crypto from "node:crypto";
import * as dataStore from "./data-store.service.js";
import { slugify, estimateReadMinutes } from "../utils/slugify.js";

function normalizeTags(tags) {
  if (Array.isArray(tags)) {
    return tags.map((t) => String(t).trim()).filter(Boolean);
  }
  if (typeof tags === "string") {
    return tags
      .split(/[,，]/)
      .map((t) => t.trim())
      .filter(Boolean);
  }
  return [];
}

function buildPostPayload(body, existing) {
  const title = String(body.title || existing?.title || "").trim();
  const summary = String(body.summary ?? existing?.summary ?? "").trim();
  const content = String(body.content ?? existing?.content ?? "").trim();
  let slug = String(body.slug || existing?.slug || "").trim();
  if (!slug && title) {
    slug = slugify(title);
  }
  if (!slug) {
    const error = new Error("请填写标题或 slug");
    error.statusCode = 400;
    throw error;
  }
  if (!title) {
    const error = new Error("标题不能为空");
    error.statusCode = 400;
    throw error;
  }

  const publishedAt =
    body.publishedAt ||
    existing?.publishedAt ||
    new Date().toISOString().slice(0, 10);

  const readMinutes =
    Number(body.readMinutes) > 0
      ? Number(body.readMinutes)
      : estimateReadMinutes(content);

  return {
    title,
    slug,
    summary,
    content,
    tags: normalizeTags(body.tags ?? existing?.tags),
    publishedAt,
    readMinutes,
    coverImage: body.coverImage ?? existing?.coverImage ?? null,
    mediaUrl: body.mediaUrl ?? existing?.mediaUrl ?? null,
    mediaType: body.mediaType ?? existing?.mediaType ?? null,
  };
}

export async function listPostsForAdmin() {
  return dataStore.getAllPosts();
}

export async function getPostForAdmin(id) {
  const post = await dataStore.getPostById(id);
  if (!post) {
    const error = new Error("文章不存在");
    error.statusCode = 404;
    throw error;
  }
  return post;
}

export async function createPost(body) {
  const payload = buildPostPayload(body);
  const post = {
    id: `post-${crypto.randomBytes(4).toString("hex")}`,
    ...payload,
  };
  return dataStore.createPost(post);
}

export async function updatePost(id, body) {
  const existing = await dataStore.getPostById(id);
  if (!existing) {
    const error = new Error("文章不存在");
    error.statusCode = 404;
    throw error;
  }
  const payload = buildPostPayload(body, existing);
  return dataStore.updatePost(id, payload);
}

export async function removePost(id) {
  return dataStore.deletePost(id);
}

export async function getProfile() {
  return dataStore.getProfile();
}

export async function updateProfile(body) {
  const allowed = ["name", "title", "bio", "email", "github", "location", "skills"];
  const updates = {};
  for (const key of allowed) {
    if (body[key] !== undefined) {
      updates[key] = body[key];
    }
  }
  if (updates.skills && typeof updates.skills === "string") {
    updates.skills = updates.skills
      .split(/[,，]/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return dataStore.updateProfile(updates);
}

export function buildPublicUploadUrl(filename) {
  return `/api/uploads/${filename}`;
}
