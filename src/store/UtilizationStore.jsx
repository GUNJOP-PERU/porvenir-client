import { create } from "zustand";
import { getDataRequest } from "@/lib/api";
import { BehaviorSubject } from "rxjs";

const productionSubject = new BehaviorSubject({
  progressVelocity: [],
  chartUtility: [],
  velocityParrilla: [],
  velocityCancha: [],
  truckLoading: false,
});

export const useUtilizationStore = create((set) => ({
  ...productionSubject.getValue(),

  subscribeToUpdates: () => {
    productionSubject.subscribe((newData) => set(newData));
  },

  fetchDataUtilization: async () => {
    try {
      const [progress, utility, velocityP, velocityC] = await Promise.all([
        getDataRequest("dashboard/production/progress-velocity"),
        getDataRequest("dashboard/production/chart-utility"),
        getDataRequest("dashboard/production/velocity-analysis/parrilla"),
        getDataRequest("dashboard/production/velocity-analysis/cancha"),
      ]);

      set((state) => ({
        ...state,
        progressVelocity: progress.data,
        chartUtility: utility.data,
        velocityParrilla: velocityP.data,
        velocityCancha: velocityC.data,
      }));
    } catch (error) {
      console.error("Error cargando datos iniciales", error);
    }
  },

  subscribeToSocketUpdates: (socket) => {
    // socket.on("scoop-progress", (newData) => {
    //   console.log("Scoop Progress:", newData);
    //   set({ scoopProgressDay: newData });
    // });
  },
}));
