import { useGlobalStore } from "@/store/GlobalStore";
import { useTruckStore } from "@/store/TruckStore";
import { useEffect } from "react";
import { io } from "socket.io-client";

export function useProductionWebSocket() {
  useEffect(() => {
    const socket = io(`${import.meta.env.VITE_URL}`);

    useGlobalStore.getState().subscribeToSocketUpdates(socket);
    useTruckStore.getState().subscribeToSocketUpdates(socket);

    return () => {
      socket.disconnect();
    };
  }, []);
}
