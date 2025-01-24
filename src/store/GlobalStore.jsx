import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useGlobalStore = create(
  persist(
    (set, get) => ({
      dataGenerate: [],
      dataGenerateWeek: [],
      dataGenerateDay: [],
      dataUsers: [],
      setDataGenerate: (data) =>
        set({
          dataGenerate: [...get().dataGenerate, data],
        }),
      setDataGenerateWeek: (data) =>
        set({
          dataGenerateWeek: [...get().dataGenerateWeek, data],
        }),
      setDataGenerateDay: (data) =>
        set({
          dataGenerateDay: [...get().dataGenerateDay, data],
        }),
    }),
    {
      name: "PruebaPlan",
    }
  )
);

