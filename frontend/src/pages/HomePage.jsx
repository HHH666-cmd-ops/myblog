import { useCallback } from "react";
import { api } from "../api/http-client.js";
import { useFetch } from "../hooks/useFetch.js";
import PostList from "../components/posts/PostList.jsx";
import LoadingSpinner from "../components/common/LoadingSpinner.jsx";
import ErrorMessage from "../components/common/ErrorMessage.jsx";

export default function HomePage() {
  const fetchPosts = useCallback(() => api.getPosts(), []);
  const { data: posts, loading, error } = useFetch(fetchPosts);

  return (
    <div className="container page">
      <section className="hero">
        <p className="hero__eyebrow">Personal Blog</p>
        <h1 className="hero__title">
          记录学习，
          <br />
          <em>沉淀思考</em>
        </h1>
        <p className="hero__desc">
          全栈学生作品：前端 React 展示，后端 Express 提供数据接口。内容不多，但结构清晰、可扩展。
        </p>
      </section>

      <section className="section">
        <div className="section__head">
          <h2 className="section__title">最新文章</h2>
          <span className="section__count">{posts ? `${posts.length} 篇` : "—"}</span>
        </div>

        {loading && <LoadingSpinner />}
        {error && (
          <ErrorMessage
            message={`无法加载文章：${error}。请确认后端已启动（端口 3001）。`}
          />
        )}
        {posts && <PostList posts={posts} />}
      </section>
    </div>
  );
}
