import { useCallback, useEffect, useState } from "react";
import { adminApi } from "../../api/admin-client.js";
import { useFetch } from "../../hooks/useFetch.js";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import ErrorMessage from "../../components/common/ErrorMessage.jsx";

export default function AdminProfilePage() {
  const fetchProfile = useCallback(() => adminApi.getProfile(), []);
  const { data: profile, loading, error } = useFetch(fetchProfile);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!profile) return;
    setForm({
      name: profile.name || "",
      title: profile.title || "",
      bio: profile.bio || "",
      email: profile.email || "",
      github: profile.github || "",
      location: profile.location || "",
      skills: (profile.skills || []).join(", "),
    });
  }, [profile]);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      await adminApi.updateProfile(form);
      setMessage("已保存，刷新关于页即可看到更新");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <LoadingSpinner label="加载资料…" />;
  if (error) return <ErrorMessage message={error} />;
  if (!form) return null;

  return (
    <div className="admin-page">
      <header className="admin-page__header">
        <h1>个人资料</h1>
      </header>

      <form className="admin-card admin-form" onSubmit={handleSubmit}>
        <label className="admin-field">
          <span>姓名</span>
          <input value={form.name} onChange={(e) => updateField("name", e.target.value)} />
        </label>
        <label className="admin-field">
          <span>头衔</span>
          <input value={form.title} onChange={(e) => updateField("title", e.target.value)} />
        </label>
        <label className="admin-field">
          <span>简介</span>
          <textarea
            rows={4}
            value={form.bio}
            onChange={(e) => updateField("bio", e.target.value)}
          />
        </label>
        <label className="admin-field">
          <span>邮箱</span>
          <input value={form.email} onChange={(e) => updateField("email", e.target.value)} />
        </label>
        <label className="admin-field">
          <span>GitHub 链接</span>
          <input value={form.github} onChange={(e) => updateField("github", e.target.value)} />
        </label>
        <label className="admin-field">
          <span>所在地</span>
          <input
            value={form.location}
            onChange={(e) => updateField("location", e.target.value)}
          />
        </label>
        <label className="admin-field">
          <span>技能（逗号分隔）</span>
          <input value={form.skills} onChange={(e) => updateField("skills", e.target.value)} />
        </label>

        {message && (
          <p className={message.includes("已保存") ? "admin-success" : "admin-error"}>{message}</p>
        )}

        <button type="submit" className="btn btn--primary" disabled={saving}>
          {saving ? "保存中…" : "保存资料"}
        </button>
      </form>
    </div>
  );
}
