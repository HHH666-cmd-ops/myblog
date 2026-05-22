import { useState } from "react";
import { adminApi } from "../../api/admin-client.js";

export default function MediaUploader({ label, accept, onUploaded, disabled }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleChange(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || disabled) return;

    setUploading(true);
    setError("");
    try {
      const result = await adminApi.uploadFile(file);
      onUploaded(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="media-uploader">
      <label className="btn btn--ghost media-uploader__label">
        {uploading ? "上传中…" : label}
        <input
          type="file"
          accept={accept}
          onChange={handleChange}
          disabled={disabled || uploading}
          hidden
        />
      </label>
      {error && <p className="media-uploader__error">{error}</p>}
    </div>
  );
}
