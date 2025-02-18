import { create } from "zustand";
import { getDataRequest } from "@/lib/api";
import { BehaviorSubject } from "rxjs";

const productionSubject = new BehaviorSubject({
  dataAccumulatedProgress: [],
  dataChartToness: [],
  dataRangeTruck: [],
  dataRangeScoop: [],

  truckLoading: false,
});

export const useMonthStore = create((set) => ({
  ...productionSubject.getValue(),

  subscribeToUpdates: () => {
    productionSubject.subscribe((newData) => set(newData));
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

  subscribeToSocketUpdates: (socket) => {
    socket.on("monthly-progress", (newData) => {
       if (!newData || Object.keys(newData).length === 0) {
        console.log("Datos vacíos");
      } else {
        set({ dataAccumulatedProgress: newData });
        productionSubject.next({
          ...productionSubject.getValue(),
          dataAccumulatedProgress: newData,
        });
      }
    });
    socket.on("monthly-chart-tonnes", (newData) => {
       if (!newData || Object.keys(newData).length === 0) {
        console.log("Datos vacíos");
      } else {
        set({ dataChartToness: newData });
        productionSubject.next({
          ...productionSubject.getValue(),
          dataChartToness: newData,
        });
      }
    });
    socket.on("monthly-average-journals", (newData) => {
     
      if (!newData || Object.keys(newData).length === 0) {
        console.log("Datos vacíos");
      } else {
        if(newData.equipment === "truck"){
          console.log("truck");
          set({ dataRangeTruck: newData });
          productionSubject.next({
            ...productionSubject.getValue(),
            dataRangeTruck: newData,
          });
        }else{
          console.log("scoop");
          set({ dataRangeScoop: newData });
          productionSubject.next({
            ...productionSubject.getValue(),
            dataRangeScoop: newData,
          });
        }

       
      }
    });
  },
}));

 // set({ dataChartToness: newData });
        // productionSubject.next({
        //   ...productionSubject.getValue(),
        //   dataChartToness: newData,
        // });