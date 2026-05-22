export function slugify(text) {
  return String(text)
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^\w\u4e00-\u9fa5-]+/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

export function estimateReadMinutes(content) {
  const chars = String(content || "").replace(/\s/g, "").length;
  return Math.max(1, Math.ceil(chars / 400));
}
