import { useCallback } from "react";
import { api } from "../api/http-client.js";
import { useFetch } from "../hooks/useFetch.js";
import LoadingSpinner from "../components/common/LoadingSpinner.jsx";
import ErrorMessage from "../components/common/ErrorMessage.jsx";

export default function AboutPage() {
  const fetchProfile = useCallback(() => api.getProfile(), []);
  const { data: profile, loading, error } = useFetch(fetchProfile);

  if (loading) return <LoadingSpinner label="加载资料…" />;
  if (error) {
    return (
      <div className="container page">
        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <div className="container page about-page">
      <section className="about-hero">
        <p className="hero__eyebrow">About</p>
        <h1 className="about-hero__name">{profile.name}</h1>
        <p className="about-hero__title">{profile.title}</p>
        <p className="about-hero__bio">{profile.bio}</p>
      </section>

      <section className="about-grid">
        <div className="about-card">
          <h2 className="about-card__label">联系</h2>
          <ul className="about-card__list">
            <li>
              <span>邮箱</span>
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
            </li>
            <li>
              <span>地区</span>
              <span>{profile.location}</span>
            </li>
            <li>
              <span>GitHub</span>
              <a href={profile.github} target="_blank" rel="noreferrer">
                访问主页
              </a>
            </li>
          </ul>
        </div>

        <div className="about-card">
          <h2 className="about-card__label">技能栈</h2>
          <div className="about-card__skills">
            {profile.skills.map((skill) => (
              <span key={skill} className="tag tag--outline">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="about-card about-card--wide">
          <h2 className="about-card__label">项目说明</h2>
          <p className="about-card__text">
            本仓库采用前后端分离，作者还在积极改进中。
          </p>
        </div>
      </section>
    </div>
  );
}
