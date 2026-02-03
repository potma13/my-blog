import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { getArticleBySlug } from '../Api/Articles.jsx';
import Loader from '../Pages/Loader.jsx';

function ArticlePage() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    getArticleBySlug(slug)
      .then(({ data }) => setArticle(data.article))
      .catch(() => setError('Ошибка загрузки'))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <Loader />;
  if (error) return <p>{error}</p>;
  if (!article) return null;

  return (
    <>
      <header className="header">
        <div className="container header-inner">
          <span className="logo">Realworld Blog</span>
          <nav className="nav">
            <span>Home</span>
            <span>New Post</span>
            <span>Settings</span>
            <span>Account</span>
          </nav>
        </div>
      </header>

      <div className="article-banner">
        <div className="article-banner-inner">
          <h1>{article.title}</h1>

          <div className="article-meta-row">
            <div>
              <div className="article-author">
                {article.author.username}
              </div>
              <div className="article-date">
                {new Date(article.createdAt).toDateString()}
              </div>
            </div>

            <button className="favorite-btn" disabled>
              ♥ Favorite article ({article.favoritesCount})
            </button>
          </div>
        </div>
      </div>

      <div className="article-body">
        <ReactMarkdown>{article.body}</ReactMarkdown>

        <div className="article-tags">
          {article.tagList.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}

export default ArticlePage;