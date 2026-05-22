import { useCallback } from "react";
import { Link } from "react-router-dom";
import { adminApi } from "../../api/admin-client.js";
import { useFetch } from "../../hooks/useFetch.js";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import ErrorMessage from "../../components/common/ErrorMessage.jsx";

export default function AdminDashboardPage() {
  const fetchPosts = useCallback(() => adminApi.getPosts(), []);
  const { data: posts, loading, error, refetch } = useFetch(fetchPosts);

  async function handleDelete(id, title) {
    if (!window.confirm(`确定删除「${title}」？`)) return;
    try {
      await adminApi.deletePost(id);
      refetch();
    } catch (err) {
      alert(err.message);
    }
  }

  if (loading) return <LoadingSpinner label="加载文章列表…" />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="admin-page">
      <header className="admin-page__header">
        <h1>文章管理</h1>
        <Link to="/admin/posts/new" className="btn btn--primary">
          新建文章
        </Link>
      </header>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>标题</th>
              <th>日期</th>
              <th>标签</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {posts?.length ? (
              posts.map((post) => (
                <tr key={post.id}>
                  <td>
                    <strong>{post.title}</strong>
                    <div className="admin-table__sub">/{post.slug}</div>
                  </td>
                  <td>{post.publishedAt}</td>
                  <td>{post.tags?.join("、")}</td>
                  <td className="admin-table__actions">
                    <Link to={`/admin/posts/${post.id}`}>编辑</Link>
                    <a href={`/posts/${post.slug}`} target="_blank" rel="noreferrer">
                      预览
                    </a>
                    <button
                      type="button"
                      className="admin-table__danger"
                      onClick={() => handleDelete(post.id, post.title)}
                    >
                      删除
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4}>暂无文章，点击「新建文章」开始</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
