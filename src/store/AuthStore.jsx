import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      token: "",
      profile: [],
      settings: {},
      type: "user",
      mining: null,
      isAuth: true,
      isCollapsed: false,

      setToken: (token) => set({ token,isAuth: !!token, }),
      setProfile: (profile) => set({ profile: profile, type: profile.type }),
      setSetting: (key, value) =>
        set((state) => ({
          settings: { ...state.settings, [key]: value },
        })),
      setMining: (mining) => set({ mining }),
      setIsCollapsed: (isCollapsed) => set({ isCollapsed }),
      logout: () => {
        set({
          token: "",
          profile: [],
          settings: {},
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
