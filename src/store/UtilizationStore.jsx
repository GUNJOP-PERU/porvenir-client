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
    socket.on("production-progress-velocity", (newData) => {
      if (!newData || Object.keys(newData).length === 0) {
        console.log("Datos vacíos");
      } else {
        set({ progressVelocity: newData });
        productionSubject.next({
          ...productionSubject.getValue(),
          progressVelocity: newData,
        });
      }
    });
    socket.on("production-chart-utility", (newData) => {
      if (!newData || Object.keys(newData).length === 0) {
        console.log("Datos vacíos");
      } else {
        set({ chartUtility: newData });
        productionSubject.next({
          ...productionSubject.getValue(),
          chartUtility: newData,
        });
      }
    });
    socket.on("production-velocity-analysis", (newData) => {
     
      if (!newData || Object.keys(newData).length === 0) {
        console.log("Datos vacíos");
      } else {
        if (newData.destiny === "parrilla") {
       
          set({ velocityParrilla: newData });
          productionSubject.next({
            ...productionSubject.getValue(),
            velocityParrilla: newData,
          });
        } else {
         
          set({ velocityCancha: newData });
          productionSubject.next({
            ...productionSubject.getValue(),
            velocityCancha: newData,
          });
        }
      }
    });
  },
}));
