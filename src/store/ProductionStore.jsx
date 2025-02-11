import { getDataRequest } from "@/lib/api";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { BehaviorSubject } from "rxjs";

const productionSubject = new BehaviorSubject({

  //Month
  dataAccumulatedProgress: [],
  dataChartToness: [],
  dataRangeTruck: [],
  dataRangeScoop: [],

  //Scoop
  scoopProgressDay: [],
  scoopTonnagHour: [],
  scoopActivityHour: [],
  scoopEvents: [],
  //  dataFleet: [],

  //Pareto Scoop
  scoopParetoProgress: [],

  scoopParetoNoProductive: [],
  scoopParetoActivitiesChart: [],
  scoopImpactDiagram: [],

  //Pareto Truck
  truckParetoProgress: [],
  truckParetoNoProductive: [],
  truckParetoActivitiesChart: [],
  truckImpactDiagram: [],

  //Produccion / Utilizacion y Velocidad
  progressVelocity: [],
  chartUtility: [],
  velocityParrilla: [],
  velocityCancha: [],
});

export const useProductionStore = create((set, get) => ({
  ...productionSubject.getValue(),

  subscribeToUpdates: () => {
    productionSubject.subscribe((newData) => set(newData));
  },
  updateProductionData: (key, newData) => {
    productionSubject.next({
      ...productionSubject.getValue(),
      [key]: newData,
    });
  },
  
  fetchDataScoop: async () => {
    try {
      const [progress, tonnagHour, activityHour, events] = await Promise.all([
        getDataRequest("dashboard/scoop/progress-day"),
        getDataRequest("dashboard/scoop/tonnage-per-hour"),
        getDataRequest("dashboard/scoop/activities-per-hour"),
        getDataRequest("dashboard/scoop/events"),
      ]);

      set({
        scoopProgressDay: progress.data,
        scoopTonnagHour: tonnagHour.data,
        scoopActivityHour: activityHour.data,
        scoopEvents: events.data,
      });
    } catch (error) {
      console.error("Error cargando datos iniciales", error);
    }
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
        scoopParetoProgress:progress.status === "fulfilled" ? progress.value.data : state.scoopParetoProgress,
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
  fetchDataMonth: async () => {
    try {
      const [accumulated, tonnes, rangeTruck, rangeScoop] = await Promise.all([
        getDataRequest("dashboard/monthly/accumulated-progress"),
        getDataRequest("dashboard/monthly/chart-tonnes"),
        getDataRequest("dashboard/monthly/average-journals?equipment=truck"),
        getDataRequest("dashboard/monthly/average-journals?equipment=scoop"),
      ]);

      set((state) => ({
        ...state,
        dataAccumulatedProgress: accumulated.data,
        dataChartToness: tonnes.data,
        dataRangeTruck: rangeTruck.data,
        dataRangeScoop: rangeScoop.data,
      }));
    } catch (error) {
      console.error("Error cargando datos iniciales", error);
    }
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
    socket.on("truck-heatmap", (newData) => {
      console.log("HeatMap recibido:", newData);
      
      // 🔄 Actualiza heatmap entrada por entrada
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

      // ✅ También actualiza el BehaviorSubject
      productionSubject.next({
        ...productionSubject.getValue(),
        heatmap: newData,
      });
    });

    socket.on("progress-shift", (newData) => {
      console.log("Progress Shift recibido:", newData);
      set({ dataGuage: newData });

      productionSubject.next({
        ...productionSubject.getValue(),
        dataGuage: newData,
      });
    });
  },
}));
