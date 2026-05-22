import { useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api/http-client.js";
import { useFetch } from "../hooks/useFetch.js";
import LoadingSpinner from "../components/common/LoadingSpinner.jsx";
import ErrorMessage from "../components/common/ErrorMessage.jsx";
import ContentBlocks from "../components/content/ContentBlocks.jsx";

export default function PostDetailPage() {
  const { slug } = useParams();
  const fetchPost = useCallback(() => api.getPost(slug), [slug]);
  const { data: post, loading, error } = useFetch(fetchPost);

  if (loading) return <LoadingSpinner label="加载文章…" />;
  if (error) {
    return (
      <div className="container page">
        <ErrorMessage message={error} />
        <Link to="/" className="btn btn--ghost" style={{ marginTop: "1rem" }}>
          ← 返回首页
        </Link>
      </div>
    );
  }

  return (
    <article className="container page post-detail">
      <Link to="/" className="post-detail__back">
        ← 全部文章
      </Link>
      {post.coverImage && (
        <figure className="post-detail__cover">
          <img src={post.coverImage} alt="" />
        </figure>
      )}
      {post.mediaUrl && post.mediaType === "video" && (
        <figure className="post-detail__cover">
          <video src={post.mediaUrl} controls playsInline />
        </figure>
      )}
      <header className="post-detail__header">
        <div className="post-detail__meta">
          <time dateTime={post.publishedAt}>{post.publishedAt}</time>
          <span className="post-card__dot" aria-hidden="true" />
          <span>{post.readMinutes} 分钟阅读</span>
        </div>
        <h1 className="post-detail__title">{post.title}</h1>
        <div className="post-detail__tags">
          {post.tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
      </header>
      <div className="post-detail__body">
        <ContentBlocks content={post.content} />
      </div>
    </article>
  );
}
