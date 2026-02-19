import axios from 'axios';

const API_URL = 'https://realworld.habsida.net/api';

export const getArticles = (limit = 10, offset = 0) =>
  axios.get(`${API_URL}/articles`, {
    params: { limit, offset },
  });

export const getArticleBySlug = (slug) =>
  axios.get(`${API_URL}/articles/${slug}`);

export const deleteArticle = (slug, token) =>
  axios.delete(`${API_URL}/articles/${slug}`, {
    headers: {
      Authorization: `Token ${token}`,
    },
  });