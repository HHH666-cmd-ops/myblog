import * as dataStore from "./data-store.service.js";

export async function getAllPosts() {
  return dataStore.getAllPosts();
}

export async function getPostBySlug(slug) {
  return dataStore.getPostBySlug(slug);
}
