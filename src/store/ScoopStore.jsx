import { create } from "zustand";
import { getDataRequest } from "@/lib/api";

export const useScoopStore = create((set) => ({
  scoopProgressDay: [],

  fetchDataScoop: async () => {
    try {
      const data = await getDataRequest("dashboard/scoop/progress-day");
      set({ scoopProgressDay: data.data });
    } catch (error) {
      console.error("Error cargando datos de Scoop", error);
    }
  },

  subscribeToSocketUpdates: (socket) => {
    socket.on("scoop-progress", (newData) => {
      console.log("Scoop Progress:", newData);
      set({ scoopProgressDay: newData });
    });
  },
}));
