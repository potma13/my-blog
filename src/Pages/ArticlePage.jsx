import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { getArticleBySlug } from '../Api/Articles';
import Loader from '../Components/Loader';
import { FaUser, FaHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import useAuthStore from '../Store/AuthStore';
import ConfirmModal from '../Components/ConfirmModal';
import { deleteArticle } from '../Api/Articles';
import { useNavigate } from 'react-router-dom';

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

  useEffect(() => {
    let isMounted = true;

    const fetchArticle = async () => {
      try {
        const { data } = await getArticleBySlug(slug);
        if (isMounted) {
          setArticle(data.article);
        }
      } catch (err) {
        console.error('Error404 loading article:', err);
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
  }, [slug]);

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
                <Link
                  to={`/articles/${article.slug}/edit`}
                  className="edit-btn"
                >
                  Edit
                </Link>

                <button
                  onClick={() => setShowModal(true)}
                  className="delete-btn"
                >
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