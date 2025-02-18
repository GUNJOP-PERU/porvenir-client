import { create } from "zustand";
import { getDataRequest } from "@/lib/api";
import { BehaviorSubject } from "rxjs";

const productionSubject = new BehaviorSubject({
  scoopParetoProgress: [],
  scoopParetoNoProductive: [],
  scoopParetoActivitiesChart: [],
  scoopImpactDiagram: [],

  truckLoading: false,
});

export const useParetoScoopStore = create((set) => ({
  ...productionSubject.getValue(),

  subscribeToUpdates: () => {
    productionSubject.subscribe((newData) => set(newData));
  },

  fetchParetoScoop: async () => {
    try {
      const results = await Promise.allSettled([
        getDataRequest("dashboard/pareto/progress-monthly?equipment=scoop"),
        getDataRequest(
          "dashboard/pareto/no-productive-activities?equipment=scoop"
        ),
        getDataRequest(
          "dashboard/pareto/scoop/no-productive-activities-chart?quantity=7"
        ),
        getDataRequest("dashboard/pareto/scoop/impact-diagram?quantity=7"),
      ]);

      const [progress, noProductive, activities, impact] = results;

      set((state) => ({
        ...state,
        scoopParetoProgress:
          progress.status === "fulfilled"
            ? progress.value.data
            : state.scoopParetoProgress,
        scoopParetoNoProductive:
          noProductive.status === "fulfilled"
            ? noProductive.value.data
            : state.scoopParetoNoProductive,
        scoopParetoActivitiesChart:
          activities.status === "fulfilled"
            ? activities.value.data
            : state.scoopParetoActivitiesChart,
        scoopImpactDiagram:
          impact.status === "fulfilled"
            ? impact.value.data
            : state.scoopImpactDiagram,
      }));
    } catch (error) {
      console.error("Error cargando algunos datos de Pareto Scoop", error);
    }
  },

  subscribeToSocketUpdates: (socket) => {
    socket.on("pareto-scoop-progress-monthly", (newData) => {

       if (!newData || Object.keys(newData).length === 0) {
        console.log("Datos vacíos");
      } else {
        set({ scoopParetoProgress: newData });
        productionSubject.next({
          ...productionSubject.getValue(),
          scoopParetoProgress: newData,
        });
      }
    });
    socket.on("pareto-scoop-no-productive-activities", (newData) => {
     
      if (!newData || Object.keys(newData).length === 0) {
        console.log("Datos vacíos");
      } else {
        set({ scoopParetoNoProductive: newData });
        productionSubject.next({
          ...productionSubject.getValue(),
          scoopParetoNoProductive: newData,
        });
      }
    });
    socket.on("pareto-scoop-improductive-activities", (newData) => {
    
       if (!newData || Object.keys(newData).length === 0) {
        console.log("Datos vacíos");
      } else {
        set({ scoopParetoActivitiesChart: newData });
        productionSubject.next({
          ...productionSubject.getValue(),
          scoopParetoActivitiesChart: newData,
        });
      }
    });
    socket.on("pareto-scoop-impact-diagram", (newData) => {
     
       if (!newData || Object.keys(newData).length === 0) {
        console.log("Datos vacíos");
      } else {
        set({ scoopImpactDiagram: newData });
        productionSubject.next({
          ...productionSubject.getValue(),
          scoopImpactDiagram: newData,
        });
      }
    });
  },
}));
