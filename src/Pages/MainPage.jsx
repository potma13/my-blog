import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getArticles } from '../Api/Articles.jsx';
import Pagination from '../Components/Pagination.jsx';
import Loader from '../Components/Loader.jsx';
import { FaPen, FaCog, FaUser, FaHeart } from 'react-icons/fa';

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

  const popularTags = ['one', 'something', 'chinese', 'english', 'french'];

  return (
    <>
      <header className="header">
        <div className="container header-inner">
          <span className="logo">Realworld Blog</span>
          <nav className="nav">
            <span>Home</span>
            <span><FaPen />New Post</span>
            <span><FaCog />Settings</span>
            <span><FaUser />Account</span>
          </nav>
        </div>
      </header>

      <div className="banner">
        <h1>Realworld Blog</h1>
        <p>A place to share your knowledge.</p>
      </div>

      <main className="container">

        <div className="popular-tags">
          <p className="popular-tags-title">Popular tags</p>
          <div className="popular-tags-list">
            {popularTags.map(tag => (
              <span key={tag} className="popular-tag">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="articles-list">    
          {articles.map(article => (
            <div key={article.slug} className="article-card">
              <div className="article-meta">
                <div className="author-row">
                  <FaUser className="author-icon" />
                  <div>
                    <div className="author">{article.author.username}</div>
                    <div className="date">
                      {new Date(article.createdAt).toDateString()}
                    </div>
                  </div>
                </div>

                <button className="like-btn">
                  <FaHeart /> {article.favoritesCount}
                </button>
              </div>

              <Link to={`/articles/${article.slug}`}>
                <h2 className="article-title">{article.title}</h2>
                <p className="article-desc">{article.description}</p>
              </Link>

              {article.tagList
                .filter(tag => tag)
                .map(tag => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
              ))}
            </div>
          ))}
        </div>
        
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