import { getDataGraphicRequest } from "@/lib/api";
import { useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSocket } from "@/context/SocketContext";

export const useStockData = (symbol, socketEvent) => {
  const queryClient = useQueryClient();
  const socket = useSocket();
  const eventRef = useRef(socketEvent); // Evita que cambie la referencia en cada render

  // Consulta inicial con React Query
  const { data, isLoading, isError } = useQuery({
    queryKey: ["stocks", symbol],
    queryFn: () => getDataGraphicRequest(symbol),
    staleTime: 0,
    refetchOnReconnect: true,
    keepPreviousData: true,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    eventRef.current = socketEvent; // Asegura que el evento 
  }, [socketEvent]);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect(); // Conectar socket solo si no está conectado
    }

    const handleNewData = (newData) => {
      if (!newData || Object.keys(newData).length === 0) {
        console.log("Datos vacíos");
        return;
      }
      queryClient.setQueryData(["stocks", symbol], newData);
    };

    if (!socket.hasListeners(eventRef.current)) {
      socket.on(eventRef.current, handleNewData);
    }

    return () => {
      socket.off(eventRef.current, handleNewData);
    };
  }, [symbol]);

  return { data, isLoading, isError };
};
