import { create } from 'zustand';

const TOKEN_KEY = 'auth_token';

const tokenFromStorage = localStorage.getItem(TOKEN_KEY);

const useAuthStore = create((set) => ({
  user: null,
  token: tokenFromStorage,
  isAuth: !!tokenFromStorage,

  login: (user) => {
    localStorage.setItem(TOKEN_KEY, user.token);

    set({
      user,
      token: user.token,
      isAuth: true,
    });
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);

    set({
      user: null,
      token: null,
      isAuth: false,
    });
  },

  hydrate: (user) =>
    set({
      user,
      token: user.token,
      isAuth: true,
    }),
}));

export default useAuthStore;