import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      token: "",
      profile: [],
      mining: null,
      isAuth: false,
      isCollapsed: false,

      setToken: (token) => set({ token,isAuth: !!token, }),
      setProfile: (profile) => set({ profile }),
      setMining: (mining) => set({ mining }),
      setIsCollapsed: (isCollapsed) => set({ isCollapsed }),
      logout: () => {
        set({
          token: "",
          profile: [],
          mining: null,
          isAuth:false,
          isCollapsed: false,
        });
      },
    }),
    { name: "Undis-Plan-Auth-2344565" }
  )
);
