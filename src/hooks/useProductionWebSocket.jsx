import { useMonthStore } from "@/store/MonthStore";
import { useParetoScoopStore } from "@/store/ParetoScoopStore";
import { useParetoTruckStore } from "@/store/ParetoTruckStore";
import { useScoopStore } from "@/store/ScoopStore";
import { useUtilizationStore } from "@/store/UtilizationStore";
import { useEffect } from "react";
import { io } from "socket.io-client";

export function useProductionWebSocket() {
  useEffect(() => {
    const socket = io(import.meta.env.VITE_URL);

    useScoopStore.getState().subscribeToSocketUpdates(socket);
    useParetoTruckStore.getState().subscribeToSocketUpdates(socket);
    useParetoScoopStore.getState().subscribeToSocketUpdates(socket);
    useMonthStore.getState().subscribeToSocketUpdates(socket);
    useUtilizationStore.getState().subscribeToSocketUpdates(socket);

    return () => {
      socket.disconnect();
    };
  }, []);
}
