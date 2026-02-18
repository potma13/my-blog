import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import useAuthStore from '../Store/AuthStore';
import ArticleForm from '../Components/ArticleForm';
import Loader from '../Components/Loader';

const API_URL = 'https://realworld.habsida.net/api';

function EditArticle() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const token = useAuthStore((s) => s.token);

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_URL}/articles/${slug}`)
      .then(({ data }) => {
        setArticle(data.article);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const handleUpdate = async (data) => {
    const response = await axios.put(
      `${API_URL}/articles/${slug}`,
      { article: data },
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );

    navigate(`/articles/${response.data.article.slug}`);
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