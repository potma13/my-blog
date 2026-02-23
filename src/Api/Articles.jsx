import axios from 'axios';

const API_URL = 'https://realworld.habsida.net/api';

export const getArticles = (limit = 10, offset = 0, token = null) => {
  const config = {
    params: { limit, offset },
  };
  if (token) {
    config.headers = {
      Authorization: `Token ${token}`,
    };
  }
  return axios.get(`${API_URL}/articles`, config);
};

export const getArticleBySlug = (slug, token = null) => {
  const config = {};
  if (token) {
    config.headers = {
      Authorization: `Token ${token}`,
    };
  }
  return axios.get(`${API_URL}/articles/${slug}`, config);
};

export const deleteArticle = (slug, token) =>
  axios.delete(`${API_URL}/articles/${slug}`, {
    headers: {
      Authorization: `Token ${token}`,
    },
  });

export const updateArticle = (slug, data, token) =>
  axios.put(
    `${API_URL}/articles/${slug}`,
    { article: data },
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );

export const createArticle = (data, token) =>
  axios.post(
    `${API_URL}/articles`,
    { article: { ...data, tagList: [] } },
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );

export const favoriteArticle = (slug, token) =>
  axios.post(
    `${API_URL}/articles/${slug}/favorite`,
    {},
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );

export const unfavoriteArticle = (slug, token) =>
  axios.delete(
    `${API_URL}/articles/${slug}/favorite`,
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );