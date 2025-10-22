import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      token: "",
      profile: [],
      type: "user",
      mining: null,
      isAuth: false,
      isCollapsed: false,

      setToken: (token) => set({ token,isAuth: !!token, }),
      setProfile: (profile) => set({ profile: profile, type: profile.type }),
      setMining: (mining) => set({ mining }),
      setIsCollapsed: (isCollapsed) => set({ isCollapsed }),
      logout: () => {
        set({
          token: "",
          profile: [],
          mining: null,
          isAuth:false,
          isCollapsed: false,
          type: "user",
        });
      },
    }),
    { name: "Undis-Plan-Auth-2344565" }
  )
);
