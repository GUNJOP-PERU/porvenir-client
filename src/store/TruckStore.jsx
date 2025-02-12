import { create } from "zustand";
import { getDataRequest } from "@/lib/api";
import { BehaviorSubject } from "rxjs";

const productionSubject = new BehaviorSubject({
  progressDay: [],
  heatmap: [],
  truckJobCycle: [],
  chartProductivity: [],
  dataFleet: [],
  truckLoading: false,
});

export const useTruckStore = create((set) => ({
  ...productionSubject.getValue(),

  subscribeToUpdates: () => {
    productionSubject.subscribe((newData) => set(newData));
  },

  fetchDataTruck: async () => {
    try {
      const [progress, heatmap, truckJob, chart, fleet] = await Promise.all([
        getDataRequest("dashboard/truck/progress-day"),
        getDataRequest("dashboard/truck/heatmap"),
        getDataRequest("dashboard/truck/job-cycle"),
        getDataRequest("dashboard/truck/chart-productivity"),
        getDataRequest("dashboard/truck/chart-fleet"),
      ]);

      set({
        progressDay: progress.data,
        heatmap: heatmap.data.origins_destinies_tonnages,
        truckJobCycle: truckJob.data,
        chartProductivity: chart.data,
        dataFleet: fleet.data,
      });
    } catch (error) {
      console.error("Error cargando datos iniciales", error);
    } finally {
    }
  },

  subscribeToSocketUpdates: (socket) => {
    socket.on("truck-progress-day", (newData) => {
      if (
        !newData ||
        (typeof newData === "object" && Object.keys(newData).length === 0)
      ) {
        console.log("Datos vacíos");
      } else {
        set({ progressDay: newData });
        productionSubject.next({
          ...productionSubject.getValue(),
          progressDay: newData,
        });
      }
    });

    socket.on("truck-heatmap", (newData) => {
      if (!newData || Object.keys(newData).length === 0) {
        console.log("Datos vacíos");
        return;
      }
      set((state) => {
        const index = state.heatmap.findIndex(
          (entry) =>
            entry.origin === newData.origin && entry.destiny === newData.destiny
        );

        if (index !== -1) {
          const updatedHeatmap = [...state.heatmap];
          updatedHeatmap[index] = {
            ...updatedHeatmap[index],
            value: newData.value,
          };
          return { heatmap: updatedHeatmap };
        } else {
          return { heatmap: [...state.heatmap, newData] };
        }
      });

      productionSubject.next({
        ...productionSubject.getValue(),
        heatmap: newData,
      });
    });

    socket.on("truck-job-cycle", (newData) => {
      if (!newData || Object.keys(newData).length === 0) {
        console.log("Datos vacíos");
        return;
      }
      set({ truckJobCycle: newData });
      productionSubject.next({
        ...productionSubject.getValue(),
        truckJobCycle: newData,
      });
    });

    socket.on("truck-chart-productivity", (newData) => {
      if (!newData || Object.keys(newData).length === 0) {
        console.log("Datos vacíos");
        return;
      }
      set({ chartProductivity: newData });
      productionSubject.next({
        ...productionSubject.getValue(),
        chartProductivity: newData,
      });
    });

    socket.on("truck-chart-fleet", (newData) => {
      if (!newData || Object.keys(newData).length === 0) {
        console.log("Datos vacíos");
        return;
      }
      set({ dataFleet: newData });
      productionSubject.next({
        ...productionSubject.getValue(),
        dataFleet: newData,
      });
    });
  },
}));
