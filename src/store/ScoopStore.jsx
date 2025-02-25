import { create } from "zustand";
import { getDataRequest } from "@/lib/api";
import { BehaviorSubject } from "rxjs";

const productionSubject = new BehaviorSubject({
  scoopProgressDay: [],
  scoopTonnagHour: [],
  scoopActivityHour: [],
  scoopEvents: [],

  truckLoading: false,
});

export const useScoopStore = create((set) => ({
  ...productionSubject.getValue(),

  subscribeToUpdates: () => {
    productionSubject.subscribe((newData) => set(newData));
  },

  fetchDataScoop: async () => {
    try {
      const [progress, tonnagHour, events] = await Promise.all([
        getDataRequest("dashboard/scoop/progress-day"),
        getDataRequest("dashboard/scoop/tonnage-per-hour"),
        // getDataRequest("dashboard/scoop/activities-per-hour"),
        getDataRequest("dashboard/scoop/events"),
      ]);

      set({
        scoopProgressDay: progress.data,
        scoopTonnagHour: tonnagHour.data,
        // scoopActivityHour: activityHour.data,
        scoopEvents: events.data,
      });
    } catch (error) {
      console.error("Error cargando datos iniciales", error);
    }
  },

  subscribeToSocketUpdates: (socket) => {
    socket.on("scoop-progress-day", (newData) => {
       if (!newData || Object.keys(newData).length === 0) {
        console.log("Datos vacíos");
      } else {
        set({ scoopProgressDay: newData });
        productionSubject.next({
          ...productionSubject.getValue(),
          scoopProgressDay: newData,
        });
      }
    });

    socket.on("scoop-tonnage-per-hour", (newData) => {
      if (!newData || Object.keys(newData).length === 0) {
        console.log("Datos vacíos");
      } else {
        set({ scoopTonnagHour: newData });
        productionSubject.next({
          ...productionSubject.getValue(),
          scoopTonnagHour: newData,
        });
      }
    });

    // socket.on("scoop-activities-per-hour", (newData) => {
    //   console.log("Datos vacíos",newData);
    //    if (!newData || Object.keys(newData).length === 0) {
    //     console.log("Datos vacíos");
    //   } else {
        
    //     set({ scoopActivityHour: newData });
    //     productionSubject.next({
    //       ...productionSubject.getValue(),
    //       scoopActivityHour: newData,
    //     });
    //   }
    // });

    socket.on("scoop-events-table", (newData) => {
       if (!newData || Object.keys(newData).length === 0) {
        console.log("Datos vacíos");
      } else {
        set((state) => {
          const prevData = state.scoopEvents.data || [];

          // Extraemos el nuevo evento y su id
          const newEventItem = newData.data;

          // Buscar si el id ya existe en la data
          const existingIndex = prevData.findIndex(
            (item) => item.id === newEventItem.id
          );

          let updatedData;
          if (existingIndex !== -1) {
            // Si ya existe, lo reemplazamos
            updatedData = [...prevData];
            updatedData[existingIndex] = newEventItem;
          } else {
            // Si no existe, lo agregamos
            updatedData = [...prevData, newEventItem];
          }

          return {
            ...state,
            scoopEvents: {
              ...state.scoopEvents,
              data: updatedData, // Solo actualizamos data
            },
          };
        });
      }
    });
  },
}));
