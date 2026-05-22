export default function LoadingSpinner({ label = "加载中…" }) {
  return (
    <div className="loading-spinner" role="status" aria-live="polite">
      <span className="loading-spinner__ring" aria-hidden="true" />
      <span className="loading-spinner__text">{label}</span>
    </div>
  );
}
