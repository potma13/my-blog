import axios from 'axios';

const API_URL = 'https://realworld.habsida.net/api';

export const registerUser = ({ username, email, password }) =>
  axios.post(`${API_URL}/users`, {
    user: {
      username,
      email,
      password,
    },
  });

export const loginUser = ({ email, password }) =>
  axios.post(`${API_URL}/users/login`, {
    user: {
      email,
      password,
    },
  });

export const getCurrentUser = (token) =>
  axios.get(`${API_URL}/user`, {
    headers: {
      Authorization: `Token ${token}`,
    },
  });

export const updateUser = (token, data) =>
  axios.put(
    `${API_URL}/user`,
    data,
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );