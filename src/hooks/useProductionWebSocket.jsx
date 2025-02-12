import { useGlobalStore } from "@/store/GlobalStore";
import { useMonthStore } from "@/store/MonthStore";
import { useParetoScoopStore } from "@/store/ParetoScoopStore";
import { useParetoTruckStore } from "@/store/ParetoTruckStore";
import { useScoopStore } from "@/store/ScoopStore";
import { useTruckStore } from "@/store/TruckStore";
import { useEffect } from "react";
import { io } from "socket.io-client";

export function useProductionWebSocket() {
  useEffect(() => {
    const socket = io(`${import.meta.env.VITE_URL}`);

    useGlobalStore.getState().subscribeToSocketUpdates(socket);
    useTruckStore.getState().subscribeToSocketUpdates(socket);
    useScoopStore.getState().subscribeToSocketUpdates(socket);
    useParetoTruckStore.getState().subscribeToSocketUpdates(socket);
    useParetoScoopStore.getState().subscribeToSocketUpdates(socket);
    useMonthStore.getState().subscribeToSocketUpdates(socket);

    return () => {
      socket.disconnect();
    };
  }, []);
}
