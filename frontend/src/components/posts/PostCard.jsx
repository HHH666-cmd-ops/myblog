import { Link } from "react-router-dom";

export default function PostCard({ post }) {
  return (
    <article className="post-card">
      {post.coverImage && (
        <div className="post-card__cover">
          <img src={post.coverImage} alt="" loading="lazy" />
        </div>
      )}
      <div className="post-card__meta">
        <time dateTime={post.publishedAt}>{post.publishedAt}</time>
        <span className="post-card__dot" aria-hidden="true" />
        <span>{post.readMinutes} 分钟阅读</span>
      </div>
      <h2 className="post-card__title">
        <Link to={`/posts/${post.slug}`}>{post.title}</Link>
      </h2>
      <p className="post-card__summary">{post.summary}</p>
      <div className="post-card__tags">
        {post.tags.map((tag) => (
          <span key={tag} className="tag">
            {tag}
          </span>
        ))}
      </div>
      <Link to={`/posts/${post.slug}`} className="post-card__more">
        阅读全文 →
      </Link>
    </article>
  );
}
