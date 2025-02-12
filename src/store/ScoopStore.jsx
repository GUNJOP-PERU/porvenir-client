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

  subscribeToSocketUpdates: (socket) => {
    socket.on("scoop-progress-day", (newData) => {
      // if (!newData || Object.keys(newData).length === 0) {
      //   console.log("Datos vacíos");
      //   return;
      // }
      set({ scoopProgressDay: newData });
      productionSubject.next({
        ...productionSubject.getValue(),
        scoopProgressDay: newData,
      });
    });

    socket.on("scoop-tonnage-per-hour", (newData) => {
      set((state) => {
        const updatedScoopTonnagHour = { ...state.scoopTonnagHour };

        // Buscar el índice en el que se debe actualizar
        const index = updatedScoopTonnagHour.hours.indexOf(newData.hours[0]);

        if (index !== -1) {
          updatedScoopTonnagHour.advance[index] = newData.advance[0];
          updatedScoopTonnagHour.production[index] = newData.production[0];
        } else {
          console.warn("⚠️ Hora no encontrada en el estado, no se actualiza.");
        }

        return { scoopTonnagHour: updatedScoopTonnagHour };
      });
    });
    socket.on("scoop-activities-per-hour", (newData) => {
      set((state) => {
        const prevData = state.scoopActivityHour.data || [];
        const prevRows = state.scoopActivityHour.rows || [];

        // Nuevo dato a agregar
        const newDataItem = newData.data;
        const newShift = newData.shift;

        // Si el y (row) ya existe, no lo duplicamos
        const updatedRows = prevRows.includes(newDataItem.y)
          ? prevRows
          : [...prevRows, newDataItem.y];

        return {
          ...state,
          scoopActivityHour: {
            data: [...prevData, newDataItem],
            rows: updatedRows, // Mantenemos las filas únicas
            shift: newShift, // Actualizamos el shift
          },
        };
      });
    });

    socket.on("scoop-events-table", (newData) => {
      console.log("scoop-events-table:", newData);
      set((state) => {
        const prevData = state.scoopEvents.data || [];

        // Extraemos el nuevo evento y su id
        const newEventItem = newData.data;
        console.log(newEventItem)

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
    });
  },
}));
