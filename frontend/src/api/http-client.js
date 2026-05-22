const API_BASE = "/api";

async function request(path) {
  const response = await fetch(`${API_BASE}${path}`);
  const json = await response.json();

  if (!response.ok || !json.success) {
    throw new Error(json.message || "请求失败");
  }

  return json.data;
}

export const api = {
  getHealth: () => request("/health"),
  getProfile: () => request("/profile"),
  getPosts: () => request("/posts"),
  getPost: (slug) => request(`/posts/${slug}`),
};
