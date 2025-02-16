import { create } from "zustand";
import { getDataRequest } from "@/lib/api";
import { BehaviorSubject } from "rxjs";

const productionSubject = new BehaviorSubject({
  truckParetoProgress: [],
  truckParetoNoProductive: [],
  truckParetoActivitiesChart: [],
  truckImpactDiagram: [],

  truckLoading: false,
});

export const useParetoTruckStore = create((set) => ({
  ...productionSubject.getValue(),

  subscribeToUpdates: () => {
    productionSubject.subscribe((newData) => set(newData));
  },

  fetchParetoTruck: async () => {
    try {
      const [progress, noProductive, activities, impact] = await Promise.all([
        getDataRequest("dashboard/pareto/progress-monthly?equipment=truck"),
        getDataRequest(
          "dashboard/pareto/no-productive-activities?equipment=truck"
        ),
        getDataRequest(
          "dashboard/pareto/truck/no-productive-activities-chart?quantity=7"
        ),
        getDataRequest("dashboard/pareto/truck/impact-diagram?quantity=7"),
      ]);

      set((state) => ({
        ...state,
        truckParetoProgress: progress.data,
        truckParetoNoProductive: noProductive.data,
        truckParetoActivitiesChart: activities.data,
        truckImpactDiagram: impact.data,
      }));
    } catch (error) {
      console.error("Error cargando datos iniciales", error);
    }
  },

  subscribeToSocketUpdates: (socket) => {
    socket.on("pareto-truck-progress-monthly", (newData) => {
      if (!newData || Object.keys(newData).length === 0) {
        console.log("Datos vacíos");
      } else {
        set((state) => ({
          truckParetoProgress: {
            ...state.truckParetoProgress,
            ...newData, 
          },
        }));
        productionSubject.next({
          ...productionSubject.getValue(),
          truckParetoProgress: {
            ...productionSubject.getValue().truckParetoProgress,
            ...newData,
          },
        });
      }
    });
    socket.on("pareto-truck-no-productive-activities", (newData) => {
      // console.log("pareto-truck-no-productive-activities ", newData);
      if (!newData || Object.keys(newData).length === 0) {
        console.log("Datos vacíos");
      } else {
        set({ truckParetoNoProductive: newData });
        productionSubject.next({
          ...productionSubject.getValue(),
          truckParetoNoProductive: newData,
        });
      }
    });
    socket.on("pareto-truck-improductive-activities", (newData) => {
      if (!newData || Object.keys(newData).length === 0) {
        console.log("Datos vacíos");
      } else {
        set({ truckParetoActivitiesChart: newData });
        productionSubject.next({
          ...productionSubject.getValue(),
          truckParetoActivitiesChart: newData,
        });
      }
    });
    socket.on("pareto-truck-impact-diagram", (newData) => {
      if (!newData || Object.keys(newData).length === 0) {
        console.log("Datos vacíos");
      } else {
        set({ truckImpactDiagram: newData });
        productionSubject.next({
          ...productionSubject.getValue(),
          truckImpactDiagram: newData,
        });
      }
    });
  },
}));
