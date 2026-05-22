import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { adminApi } from "../../api/admin-client.js";
import MediaUploader from "../../components/admin/MediaUploader.jsx";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";

const emptyForm = {
  title: "",
  slug: "",
  summary: "",
  content: "",
  tags: "",
  publishedAt: new Date().toISOString().slice(0, 10),
  readMinutes: "",
  coverImage: "",
  mediaUrl: "",
  mediaType: "",
};

export default function AdminPostEditPage() {
  const { id } = useParams();
  const isNew = id === "new";
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadPost = useCallback(async () => {
    if (isNew) return;
    setLoading(true);
    try {
      const post = await adminApi.getPost(id);
      setForm({
        title: post.title || "",
        slug: post.slug || "",
        summary: post.summary || "",
        content: post.content || "",
        tags: (post.tags || []).join(", "),
        publishedAt: post.publishedAt || "",
        readMinutes: post.readMinutes || "",
        coverImage: post.coverImage || "",
        mediaUrl: post.mediaUrl || "",
        mediaType: post.mediaType || "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id, isNew]);

  useEffect(() => {
    loadPost();
  }, [loadPost]);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function appendToContent(snippet) {
    setForm((prev) => ({
      ...prev,
      content: prev.content ? `${prev.content}\n\n${snippet}` : snippet,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    const payload = {
      ...form,
      readMinutes: form.readMinutes ? Number(form.readMinutes) : undefined,
      coverImage: form.coverImage || null,
      mediaUrl: form.mediaUrl || null,
      mediaType: form.mediaType || null,
    };

    try {
      if (isNew) {
        await adminApi.createPost(payload);
      } else {
        await adminApi.updatePost(id, payload);
      }
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <LoadingSpinner label="加载文章…" />;

  return (
    <div className="admin-page">
      <header className="admin-page__header">
        <h1>{isNew ? "新建文章" : "编辑文章"}</h1>
        <Link to="/admin" className="btn btn--ghost">
          ← 返回列表
        </Link>
      </header>

      <form className="admin-card admin-form" onSubmit={handleSubmit}>
        <label className="admin-field">
          <span>标题 *</span>
          <input
            value={form.title}
            onChange={(e) => updateField("title", e.target.value)}
            required
          />
        </label>

        <label className="admin-field">
          <span>URL 别名（slug，留空则根据标题自动生成）</span>
          <input
            value={form.slug}
            onChange={(e) => updateField("slug", e.target.value)}
            placeholder="例如 my-first-post"
          />
        </label>

        <label className="admin-field">
          <span>摘要</span>
          <textarea
            rows={2}
            value={form.summary}
            onChange={(e) => updateField("summary", e.target.value)}
          />
        </label>

        <div className="admin-field">
          <span>封面图</span>
          <div className="admin-media-row">
            <input
              value={form.coverImage}
              onChange={(e) => updateField("coverImage", e.target.value)}
              placeholder="/api/uploads/xxx.jpg"
            />
            <MediaUploader
              label="上传封面"
              accept="image/*"
              onUploaded={(r) => updateField("coverImage", r.url)}
            />
          </div>
          {form.coverImage && (
            <img src={form.coverImage} alt="" className="admin-preview" />
          )}
        </div>

        <div className="admin-field">
          <span>正文 *（段落之间空一行；可插入图片/视频）</span>
          <div className="admin-toolbar">
            <MediaUploader
              label="插入图片"
              accept="image/*"
              onUploaded={(r) => appendToContent(`![](${r.url})`)}
            />
            <MediaUploader
              label="插入视频"
              accept="video/*"
              onUploaded={(r) => {
                updateField("mediaUrl", r.url);
                updateField("mediaType", "video");
                appendToContent(`[video](${r.url})`);
              }}
            />
          </div>
          <textarea
            rows={14}
            value={form.content}
            onChange={(e) => updateField("content", e.target.value)}
            required
            placeholder={"第一段文字\n\n第二段文字\n\n![](/api/uploads/photo.jpg)"}
          />
        </div>

        <label className="admin-field">
          <span>标签（逗号分隔）</span>
          <input
            value={form.tags}
            onChange={(e) => updateField("tags", e.target.value)}
            placeholder="全栈, React"
          />
        </label>

        <div className="admin-form__row">
          <label className="admin-field">
            <span>发布日期</span>
            <input
              type="date"
              value={form.publishedAt}
              onChange={(e) => updateField("publishedAt", e.target.value)}
            />
          </label>
          <label className="admin-field">
            <span>阅读分钟（留空自动估算）</span>
            <input
              type="number"
              min={1}
              value={form.readMinutes}
              onChange={(e) => updateField("readMinutes", e.target.value)}
            />
          </label>
        </div>

        {error && <p className="admin-error">{error}</p>}

        <div className="admin-form__actions">
          <button type="submit" className="btn btn--primary" disabled={saving}>
            {saving ? "保存中…" : "保存文章"}
          </button>
        </div>
      </form>
    </div>
  );
}
