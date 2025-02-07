import { getDataRequest } from "@/lib/api";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useProductionStore = create((set, get) => ({
  //Gauge
  dataGuage: [],
  //Truck
  progressDay: [],
  heatmap: [],
  truckJobCycle: [],
  chartProductivity: [],
  dataFleet: [],
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
  scoopParetoProductive: [],
  scoopParetoNoProductive: [],
  scoopParetoActivitiesChart: [],

  //Pareto Truck
  truckParetoProgress: [],
  truckParetoProductive: [],
  truckParetoNoProductive: [],
  truckParetoActivitiesChart: [],

  //Produccion / Utilizacion y Velocidad
  progressVelocity: [],
  chartUtility: [],


  setProductionData: (key, value) =>
    set((state) => ({ ...state, [key]: value })),

  fetchDataGauge: async () => {
    try {
      const accumulated = await getDataRequest("dashboard/progress-shift");
      set({
        dataGuage: accumulated.data,
      });
    } catch (error) {
      console.error("Error cargando datos de acumulado", error);
    }
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
    }
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
      const [progress, noProductive,activities] = await Promise.all([
        getDataRequest("dashboard/pareto/progress-monthly?equipment=scoop"),
        getDataRequest(
          "dashboard/pareto/no-productive-activities?equipment=scoop"
        ),
        getDataRequest(
          "dashboard/pareto/scoop/no-productive-activities-chart?quantity=10"
        ),
      ]);

      set((state) => ({
        ...state,
        scoopParetoProgress: progress.data,
        scoopParetoNoProductive: noProductive.data,
        scoopParetoActivitiesChart: activities.data,
      }));
    } catch (error) {
      console.error("Error cargando datos iniciales", error);
    }
  },
  fetchParetoTruck: async () => {
    try {
      const [progress, noProductive,activities] = await Promise.all([
        getDataRequest("dashboard/pareto/progress-monthly?equipment=truck"),
        getDataRequest(
          "dashboard/pareto/no-productive-activities?equipment=truck"
        ),
        getDataRequest(
          "dashboard/pareto/truck/no-productive-activities-chart?quantity=10"
        ),
      ]);

      set((state) => ({
        ...state,
        truckParetoProgress: progress.data,
        truckParetoNoProductive: noProductive.data,
        truckParetoActivitiesChart: activities.data,
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
      const [progress, utility] = await Promise.all([
        getDataRequest("dashboard/production/progress-velocity"),
        getDataRequest("dashboard/production/chart-utility"),
        
      ]);

      set((state) => ({
        ...state,
        progressVelocity: progress.data,
        chartUtility: utility.data,
       
      }));
    } catch (error) {
      console.error("Error cargando datos iniciales", error);
    }
  },
}));
