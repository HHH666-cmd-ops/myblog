const TOKEN_KEY = "blog_admin_token";

export function getAdminToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAdminToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAdminToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function parseResponse(response) {
  const json = await response.json();
  if (!response.ok || !json.success) {
    throw new Error(json.message || "请求失败");
  }
  return json.data ?? json;
}

async function adminRequest(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  const token = getAdminToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  if (options.body && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`/api/admin${path}`, {
    ...options,
    headers,
  });
  return parseResponse(response);
}

export const adminApi = {
  async login(password) {
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await parseResponse(response);
    setAdminToken(data.token);
    return data;
  },

  logout() {
    const token = getAdminToken();
    clearAdminToken();
    if (token) {
      fetch("/api/admin/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
  },

  getProfile: () => adminRequest("/profile"),
  updateProfile: (body) =>
    adminRequest("/profile", { method: "PUT", body: JSON.stringify(body) }),

  getPosts: () => adminRequest("/posts"),
  getPost: (id) => adminRequest(`/posts/${id}`),
  createPost: (body) =>
    adminRequest("/posts", { method: "POST", body: JSON.stringify(body) }),
  updatePost: (id, body) =>
    adminRequest(`/posts/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deletePost: (id) => adminRequest(`/posts/${id}`, { method: "DELETE" }),

  async uploadFile(file) {
    const formData = new FormData();
    formData.append("file", file);
    return adminRequest("/upload", { method: "POST", body: formData });
  },
};
