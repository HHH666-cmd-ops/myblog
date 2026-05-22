import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataPath = join(__dirname, "../data/seed-data.json");

export async function loadData() {
  const raw = await readFile(dataPath, "utf-8");
  return JSON.parse(raw);
}

export async function saveData(data) {
  await writeFile(dataPath, `${JSON.stringify(data, null, 2)}\n`, "utf-8");
}

export async function getProfile() {
  const data = await loadData();
  return data.profile;
}

export async function updateProfile(profile) {
  const data = await loadData();
  data.profile = { ...data.profile, ...profile };
  await saveData(data);
  return data.profile;
}

export async function getAllPosts() {
  const data = await loadData();
  return [...data.posts].sort(
    (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
  );
}

export async function getPostBySlug(slug) {
  const data = await loadData();
  return data.posts.find((post) => post.slug === slug) ?? null;
}

export async function getPostById(id) {
  const data = await loadData();
  return data.posts.find((post) => post.id === id) ?? null;
}

export async function createPost(post) {
  const data = await loadData();
  if (data.posts.some((p) => p.slug === post.slug)) {
    const error = new Error("slug 已存在");
    error.statusCode = 409;
    throw error;
  }
  data.posts.push(post);
  await saveData(data);
  return post;
}

export async function updatePost(id, updates) {
  const data = await loadData();
  const index = data.posts.findIndex((p) => p.id === id);
  if (index === -1) {
    const error = new Error("文章不存在");
    error.statusCode = 404;
    throw error;
  }
  const nextSlug = updates.slug;
  if (
    nextSlug &&
    data.posts.some((p) => p.slug === nextSlug && p.id !== id)
  ) {
    const error = new Error("slug 已存在");
    error.statusCode = 409;
    throw error;
  }
  data.posts[index] = { ...data.posts[index], ...updates };
  await saveData(data);
  return data.posts[index];
}

export async function deletePost(id) {
  const data = await loadData();
  const index = data.posts.findIndex((p) => p.id === id);
  if (index === -1) {
    const error = new Error("文章不存在");
    error.statusCode = 404;
    throw error;
  }
  const [removed] = data.posts.splice(index, 1);
  await saveData(data);
  return removed;
}
