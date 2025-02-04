import { getDataRequest } from "@/lib/api";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useProductionStore = create(
 
    (set, get) => ({
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
      //  truckJobCycle: [],
      //  chartProductivity: [],
      //  dataFleet: [],

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
          const [progress, heatmap, truckJob, chart, fleet] = await Promise.all(
            [
              getDataRequest("dashboard/truck/progress-day"),
              getDataRequest("dashboard/truck/heatmap"),
              getDataRequest("dashboard/truck/job-cycle"),
              getDataRequest("dashboard/truck/chart-productivity"),
              getDataRequest("dashboard/truck/chart-fleet"),
            ]
          );

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
          const [progress, scoopTonnagHour] = await Promise.all(
            [
              getDataRequest("dashboard/scoop/progress-day"),
              getDataRequest("dashboard/scoop/tonnage-per-hour"),
             
            ]
          );

          set({
            scoopProgressDay: progress.data,
            scoopTonnagHour: scoopTonnagHour.data,
          });
        } catch (error) {
          console.error("Error cargando datos iniciales", error);
        }
      },
      fetchDataMonth: async () => {
        try {
          const [accumulated, tonnes, rangeTruck,rangeScoop] = await Promise.all([
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
    }
    
  )
);
