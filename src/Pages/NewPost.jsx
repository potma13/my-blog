import { useNavigate } from 'react-router-dom';
import useAuthStore from '../Store/AuthStore';
import axios from 'axios';
import ArticleForm from '../Components/ArticleForm';
import '../Styles/NewPost.css';
import { useEffect, useState } from 'react';
import Loader from '../Components/Loader';

const API_URL = 'https://realworld.habsida.net/api';

function NewPost() {
  const navigate = useNavigate();
  const token = useAuthStore((s) => s.token);
  const [initialLoading, setInitialLoading] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => setInitialLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  if (initialLoading) {
    return <Loader />;
  }

  const handleCreate = async (data) => {
    try {
      const response = await axios.post(
        `${API_URL}/articles`,
        {
          article: {
            ...data,
            tagList: [],
          },
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

    navigate(`/articles/${response.data.article.slug}`);
    } catch (err) {
    console.error(err);
    }
  };

  return (
    <main className="newpost-container">
      <h1 className="newpost-title">Create New Article</h1>

      <ArticleForm
        onSubmit={handleCreate}
        buttonText="Publish Article"
      />
    </main>
  );
}

export default NewPost;