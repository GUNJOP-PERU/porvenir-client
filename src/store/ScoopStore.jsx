import { create } from "zustand";
import { getDataRequest } from "@/lib/api";
import { BehaviorSubject } from "rxjs";

const productionSubject = new BehaviorSubject({
  scoopEvents: [],
});

export const useScoopStore = create((set) => ({
  ...productionSubject.getValue(),

  subscribeToUpdates: () => {
    productionSubject.subscribe((newData) => set(newData));
  },

  fetchDataScoop: async () => {
    try {
      const [events] = await Promise.all([
        getDataRequest("dashboard/scoop/events"),
      ]);

      set({
        scoopEvents: events.data,
      });
    } catch (error) {
      console.error("Error cargando datos iniciales", error);
    }
  },

  subscribeToSocketUpdates: (socket) => {
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
