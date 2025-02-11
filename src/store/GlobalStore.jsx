import { create } from "zustand";
import { BehaviorSubject } from "rxjs";
import { getDataRequest } from "@/lib/api";

const productionSubject = new BehaviorSubject({
  dataGuage: [],
});

export const useGlobalStore = create((set, get) => ({
  ...productionSubject.getValue(),

  subscribeToUpdates: () => {
    productionSubject.subscribe((newData) => set(newData));
  },

  fetchDataGauge: async () => {
    try {
      const accumulated = await getDataRequest("dashboard/progress-shift");
      set({ dataGuage: accumulated.data });

      // 🔹 Actualiza RXJS para que otros subscriptores reciban la data
      productionSubject.next({
        ...productionSubject.getValue(),
        dataGuage: accumulated.data,
      });
    } catch (error) {
      console.error("Error cargando datos de Gauge", error);
    }
  },

  subscribeToSocketUpdates: (socket) => {
    socket.on("progress-shift", (newData) => {
      set({ dataGuage: newData });
      productionSubject.next({
        ...productionSubject.getValue(),
        dataGuage: newData,
      });
    });
  },
}));
