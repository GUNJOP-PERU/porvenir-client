import { useScoopStore } from "@/store/ScoopStore";
import { useEffect } from "react";
import { io } from "socket.io-client";

export function useProductionWebSocket() {
  useEffect(() => {
    const socket = io(import.meta.env.VITE_URL);

    useScoopStore.getState().subscribeToSocketUpdates(socket);

    return () => {
      socket.disconnect();
    };
  }, []);
}
