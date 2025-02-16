import { create } from "zustand";
import { getDataRequest } from "@/lib/api";
import { BehaviorSubject } from "rxjs";
import { hoursDay, hoursNight } from "@/lib/dataDashboard";

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
      set((state) => {
        let updatedScoopTonnagHour = { ...state.scoopTonnagHour };

        // 🟢 Si el turno cambia, reinicializar todo
        if (updatedScoopTonnagHour.shift !== newData.shift) {
          const newHours = newData.shift === "dia" ? hoursDay : hoursNight;

          updatedScoopTonnagHour = {
            shift: newData.shift,
            hours: newHours, // Nueva lista de horas según el turno
            advance: new Array(newHours.length).fill(0),
            production: new Array(newHours.length).fill(0),
          };
        }

        // 🔍 Buscar el índice correcto en la nueva lista de horas
        const index = updatedScoopTonnagHour.hours.indexOf(newData.hours?.[0]);

        if (index !== -1) {
          updatedScoopTonnagHour.advance[index] = newData.advance?.[0] ?? 0;
          updatedScoopTonnagHour.production[index] =
            newData.production?.[0] ?? 0;
        } else {
          console.warn("⚠️ Hora no encontrada en la lista de horas.");
        }

        return { scoopTonnagHour: updatedScoopTonnagHour };
      });
    });

    socket.on("scoop-activities-per-hour", (newData) => {
       if (!newData || Object.keys(newData).length === 0) {
        console.log("Datos vacíos");
      } else {
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
      }
    });

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
