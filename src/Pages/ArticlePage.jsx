import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { FaUser, FaHeart, FaRegHeart } from 'react-icons/fa';
import Loader from '../Components/Loader';
import ConfirmModal from '../Components/ConfirmModal';
import useAuthStore from '../Store/AuthStore';
import { getArticleBySlug, favoriteArticle, unfavoriteArticle, deleteArticle } from '../Api/Articles';

function ArticlePage() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const navigate = useNavigate();
  
  const [showModal, setShowModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [liking, setLiking] = useState(false);

  const handleLike = async () => {
    if (!user || !article) return;
    
    setLiking(true);
    try {
      let response;
      if (article.favorited) {
        response = await unfavoriteArticle(article.slug, token);
      } else {
        response = await favoriteArticle(article.slug, token);
      }
      
      setArticle(response.data.article);
    } catch (err) {
      console.error('Error liking article:', err);
    } finally {
      setLiking(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchArticle = async () => {
      try {
        const { data } = await getArticleBySlug(slug, token);
        if (isMounted) {
          setArticle(data.article);
          console.log('Loaded article with favorited:', data.article.favorited);
        }
      } catch (err) {
        console.error('Error loading article:', err);
        if (isMounted) {
          setError('Такой статьи не существует');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    setLoading(true);
    setError(null);
    
    fetchArticle();

    return () => {
      isMounted = false;
    };
  }, [slug, token]);

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      await deleteArticle(slug, token);
      navigate('/');
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteLoading(false);
      setShowModal(false);
    }
  };

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
            {user?.username === article.author.username && (
              <div className="article-actions">
                <Link to={`/articles/${article.slug}/edit`} className="edit-btn">
                  Edit
                </Link>
                <button onClick={() => setShowModal(true)} className="delete-btn">
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="article-body">
        <ReactMarkdown>{article.body}</ReactMarkdown>

        <div className="article-tags">
          {article.tagList.map((tag) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>

        <div className="article-footer">
          <div className="article-footer-meta">
            <FaUser className="author-icon" />
            <div>
              <div className="article-author">{article.author.username}</div>
              <div className="article-date">
                {new Date(article.createdAt).toDateString()}
              </div>
            </div>
          </div>

          <button
            className={`favorite-btn ${article.favorited ? 'liked' : ''}`}
            onClick={handleLike}
            disabled={!user || liking}
          >
            {article.favorited ? <FaHeart /> : <FaRegHeart />}
            {article.favorited ? 'Unfavorite' : 'Favorite'} article ({article.favoritesCount})
          </button>
        </div>
      </div>
      
      {showModal && (
        <ConfirmModal
          onConfirm={handleDelete}
          onCancel={() => setShowModal(false)}
          loading={deleteLoading}
        />
      )}
    </>
  );
}

export default ArticlePage;