import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      token: "",
      profile: [],
      mining: null,
      isAuth: false,

      setToken: (token) => set({ token,isAuth: !!token, }),
      setProfile: (profile) => set({ profile }),
      setMining: (mining) => set({ mining }),
      logout: () => {
        set({
          token: "",
          profile: [],
          isAuth:false,
        });
      },
    }),
    { name: "Undis-Plan-Auth-2344565" }
  )
);
