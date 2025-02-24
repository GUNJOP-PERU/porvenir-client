import { getDataGraphicRequest } from "@/lib/api";
import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const socket = io(import.meta.env.VITE_URL, { autoConnect: false });

export const useStockData = (symbol, socketEvent) => {
  const queryClient = useQueryClient();
  const eventRef = useRef(socketEvent); // Evita que cambie la referencia en cada render

  // Consulta inicial con React Query
  const { data, isLoading, isError } = useQuery({
    queryKey: ["stocks", symbol],
    queryFn: () => getDataGraphicRequest(symbol),
    staleTime: Infinity,
    refetchOnReconnect: true,
    keepPreviousData: true,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    eventRef.current = socketEvent; // Asegura que el evento siempre esté actualizado
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

    socket.on(eventRef.current, handleNewData); // Usa la referencia para evitar re-suscripciones

    return () => {
      socket.off(eventRef.current, handleNewData);
    };
  }, [symbol, queryClient]);

  return { data, isLoading, isError };
};
