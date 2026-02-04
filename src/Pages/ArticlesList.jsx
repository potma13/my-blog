import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getArticles } from '../Api/Articles.jsx';
import Pagination from '../Components/Pagination.jsx';
import Loader from '../Components/Loader.jsx';

const LIMIT = 3;

function ArticlesList() {
  const [articles, setArticles] = useState([]);
  const [articlesCount, setArticlesCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    getArticles(LIMIT, (page - 1) * LIMIT)
      .then(({ data }) => {
        setArticles(data.articles);
        setArticlesCount(data.articlesCount);
      })
      .finally(() => setLoading(false));
  }, [page]);

  if (loading) return <Loader />;

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

      <div className="banner">
        <h1>Realworld Blog</h1>
        <p>A place to share your knowledge.</p>
      </div>

      <main className="container main">
        {articles.map((article) => (
          <div key={article.slug} className="article-card">
            <div className="article-meta">
              <div>
                <div className="author">{article.author.username}</div>
                <div className="date">
                  {new Date(article.createdAt).toDateString()}
                </div>
              </div>

              <button className="like-btn" disabled>
                ♥ {article.favoritesCount}
              </button>
            </div>

            <Link to={`/articles/${article.slug}`}>
              <h2 className="article-title">{article.title}</h2>
              <p className="article-desc">{article.description}</p>
            </Link>

            <div className="tags">
              {article.tagList.map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}

        <Pagination
          total={articlesCount}
          limit={LIMIT}
          current={page}
          onChange={setPage}
        />
      </main>
    </>
  );
}

export default ArticlesList;