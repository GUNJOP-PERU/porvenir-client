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

  fetchTruckProgressDay: async () => {
    try {
      const progress = await getDataRequest("dashboard/truck/progress-day");
      set((state) => ({
        ...state,
        progressDay: progress.data,
      }));
    } catch (error) {
      console.error("Error cargando Progress Day", error);
    }
  },
  fetchTruckHeatmap: async () => {
    try {
      const heatmap = await getDataRequest("dashboard/truck/heatmap");
      set((state) => ({
        ...state,
        heatmap: heatmap.data,
      }));
    } catch (error) {
      console.error("Error cargando Heatmap", error);
    }
  },
  fetchTruckJobCycle: async () => {
    try {
      const truckJob = await getDataRequest("dashboard/truck/job-cycle");
      set((state) => ({
        ...state,
        truckJobCycle: truckJob.data,
      }));
    } catch (error) {
      console.error("Error cargando Job Cycle", error);
    }
  },
  fetchTruckChartProductivity: async () => {
    try {
      const chart = await getDataRequest("dashboard/truck/chart-productivity");
      set((state) => ({
        ...state,
        chartProductivity: chart.data,
      }));
    } catch (error) {
      console.error("Error cargando Chart Productivity", error);
    }
  },
  fetchTruckFleetData: async () => {
    try {
      const fleet = await getDataRequest("dashboard/truck/chart-fleet");
      set((state) => ({
        ...state,
        dataFleet: fleet.data,
      }));
    } catch (error) {
      console.error("Error cargando Fleet Data", error);
    }
  },

  subscribeToSocketUpdates: (socket) => {
    socket.on("truck-progress-day", (newData) => {
      if (!newData || Object.keys(newData).length === 0) {
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
      } else {
        set({ heatmap: newData });
        productionSubject.next({
          ...productionSubject.getValue(),
          heatmap: newData,
        });
      }
      // set((state) => {
      //   const index = state.heatmap.findIndex(
      //     (entry) =>
      //       entry.origin === newData.origin && entry.destiny === newData.destiny
      //   );

      //   if (index !== -1) {
      //     const updatedHeatmap = [...state.heatmap];
      //     updatedHeatmap[index] = {
      //       ...updatedHeatmap[index],
      //       value: newData.value,
      //     };
      //     return { heatmap: updatedHeatmap };
      //   } else {
      //     return { heatmap: [...state.heatmap, newData] };
      //   }
      // });

      // productionSubject.next({
      //   ...productionSubject.getValue(),
      //   heatmap: newData,
      // });
    });

    socket.on("truck-job-cycle", (newData) => {
      if (!newData || Object.keys(newData).length === 0) {
        console.log("Datos vacíos");
      }else{
        set({ truckJobCycle: newData });
        productionSubject.next({
          ...productionSubject.getValue(),
          truckJobCycle: newData,
        });
      }
    });

    socket.on("truck-chart-productivity", (newData) => {
      if (!newData || Object.keys(newData).length === 0) {
        console.log("Datos vacíos");
     
      }else{

        set({ chartProductivity: newData });
        productionSubject.next({
          ...productionSubject.getValue(),
          chartProductivity: newData,
        });
      }
    });

    socket.on("truck-chart-fleet", (newData) => {
      if (!newData || Object.keys(newData).length === 0) {
        console.log("Datos vacíos");
       
      }else{

        set({ dataFleet: newData });
        productionSubject.next({
          ...productionSubject.getValue(),
          dataFleet: newData,
        });
      }
    });
  },
}));
