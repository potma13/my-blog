import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAuthStore from '../Store/AuthStore';
import ArticleForm from '../Components/ArticleForm';
import Loader from '../Components/Loader';
import { getArticleBySlug, updateArticle } from '../Api/Articles';

function EditArticle() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchArticle = async () => {
      try {
        const { data } = await getArticleBySlug(slug);

        if (!isMounted) return;

        if (data.article.author.username !== user?.username) {
          navigate('/');
          return;
        }

        setArticle(data.article);
      } catch (err) {
        console.error(err);
        navigate('/');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchArticle();

    return () => {
      isMounted = false;
    };
  }, [slug, user, navigate]);

  const handleUpdate = async (formData) => {
    try {
      const { data } = await updateArticle(slug, formData, token);
      navigate(`/articles/${data.article.slug}`);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <Loader />;
  if (!article) return null;

  return (
    <main className="newpost-container">
      <h1 className="newpost-title">Edit Article</h1>

      <ArticleForm
        defaultValues={{
          title: article.title,
          description: article.description,
          body: article.body,
        }}
        onSubmit={handleUpdate}
        buttonText="Update Article"
      />
    </main>
  );
}

export default EditArticle;