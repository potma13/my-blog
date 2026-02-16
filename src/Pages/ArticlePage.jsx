import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { getArticleBySlug } from '../Api/Articles.jsx';
import Loader from '../Components/Loader.jsx';
import { FaUser, FaHeart } from 'react-icons/fa';

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
      <div className="article-banner">
        <div className="article-banner-inner">
          <h1>{article.title}</h1>

          <div className="article-meta-row">
            <div className="author-row">
              <FaUser className="author-icon" />
              <div>
                <div className="article-author">
                  {article.author.username}
                </div>
                <div className="article-date">
                  {new Date(article.createdAt).toDateString()}
                </div>
              </div>
            </div>
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

        <div className="article-footer">
          <div className="article-footer-meta">
            <FaUser className="author-icon" />

            <div>
              <div className="article-author">
                {article.author.username}
              </div>
              <div className="article-date">
                {new Date(article.createdAt).toDateString()}
              </div>
            </div>
          </div>

          <button className="favorite-btn">
            <FaHeart /> Favorite article ({article.favoritesCount})
          </button>
        </div>
      </div>
    </>
  );
}

export default ArticlePage;