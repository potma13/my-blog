import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuth: false,

      login: (user) =>
        set({
          user,
          token: user.token,
          isAuth: true,
        }),

      logout: () =>
        set({
          user: null,
          token: null,
          isAuth: false,
        }),

      hydrate: (user) =>
        set({
          user,
          token: user.token,
          isAuth: true,
        }),
    }),
    {
      name: 'auth-storage', 
    }
  )
);

export default useAuthStore;