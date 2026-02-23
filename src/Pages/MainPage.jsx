import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getArticles, favoriteArticle, unfavoriteArticle } from '../Api/Articles';
import Pagination from '../Components/Pagination';
import Loader from '../Components/Loader';
import { FaUser, FaHeart, FaRegHeart } from 'react-icons/fa';
import useAuthStore from '../Store/AuthStore';

const LIMIT = 3;

function ArticlesList() {
  const [articles, setArticles] = useState([]);
  const [articlesCount, setArticlesCount] = useState(0);
  const [page, setPage] = useState(1);
  const token = useAuthStore((s) => s.token);
  const isAuth = useAuthStore((s) => s.isAuth);

  const [initialLoading, setInitialLoading] = useState(true);
  const [likingSlug, setLikingSlug] = useState(null);

  const handleLike = async (article, e) => {
    e.preventDefault();
    if (!isAuth) return;

    setLikingSlug(article.slug);
    try {
      let response;
      if (article.favorited) {
        response = await unfavoriteArticle(article.slug, token);
      } else {
        response = await favoriteArticle(article.slug, token);
      }
      
      const updatedArticle = response.data.article;
      
      setArticles(prevArticles =>
        prevArticles.map(a =>
          a.slug === article.slug ? updatedArticle : a
        )
      );
    } catch (err) {
      console.error('Error liking article:', err);
    } finally {
      setLikingSlug(null);
    }
  };

  useEffect(() => {
    let isMounted = true;

    getArticles(LIMIT, (page - 1) * LIMIT, token)
      .then(({ data }) => {
        if (!isMounted) return;
        setArticles(data.articles);
        setArticlesCount(data.articlesCount);
      })
      .finally(() => {
        if (!isMounted) return;
        setInitialLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [page, token]);

  if (initialLoading) {
    return <Loader />;
  }

  const popularTags = ['one', 'something', 'chinese', 'english', 'french'];

  return (
    <>
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
                    <div className="author">
                      {article.author.username}
                    </div>
                    <div className="date">
                      {new Date(article.createdAt).toDateString()}
                    </div>
                  </div>
                </div>

                <button
                  className={`like-btn ${article.favorited ? 'liked' : ''}`}
                  onClick={(e) => handleLike(article, e)}
                  disabled={!isAuth || likingSlug === article.slug}
                >
                  {article.favorited ? <FaHeart /> : <FaRegHeart />}
                  {article.favoritesCount}
                </button>
              </div>

              <Link to={`/articles/${article.slug}`}>
                <h2 className="article-title">{article.title}</h2>
                <p className="article-desc">{article.description}</p>
              </Link>

              <div className="tags">
                {article.tagList
                  .filter(Boolean)
                  .map(tag => (
                    <span
                      key={`${article.slug}-${tag}`}
                      className="tag"
                    >
                      {tag}
                    </span>
                  ))}
              </div>
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