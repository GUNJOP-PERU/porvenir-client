import { getDataGraphicRequest } from "@/lib/api";
import { useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSocket } from "@/context/SocketContext";

export const useStockData = (symbol, socketEvent) => {
  const queryClient = useQueryClient();
  const socket = useSocket();
  const eventRef = useRef(socketEvent); // Mantener la referencia estable

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
    eventRef.current = socketEvent; // Actualizar referencia al evento cuando cambie
  }, [socketEvent]);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect(); // Conectar socket si no está conectado
    
    }

    // Manejo de datos basado en el evento recibido
    const handleNewData = (newData) => {
      if (!newData || Object.keys(newData).length === 0) {
        console.log(`Datos vacíos en el tópico: ${eventRef.current}`);
        return;
      }

      console.log(`Nuevo dato recibido en ${eventRef.current}:`, newData);

      switch (eventRef.current) {
        case "production-velocity-analysis":
          if (newData.destiny === "parrilla") {
            queryClient.setQueryData(["stocks", symbol, "dashboard/production/velocity-analysis/parrila"], newData);
          } else {
            queryClient.setQueryData(["stocks", symbol, "dashboard/production/velocity-analysis/cancha"], newData);
          }
          break;

        case "monthly-average-journals":
          if (newData.equipment === "truck") {
            queryClient.setQueryData(["stocks", symbol, "dashboard/monthly/average-journals?equipment=truck"], newData);
          } else {
            queryClient.setQueryData(["stocks", symbol, "dashboard/monthly/average-journals?equipment=scoop"], newData);
          }
          break;

        default:
          queryClient.setQueryData(["stocks", symbol], newData);
          break;
      }
    };

    if (!socket.hasListeners(eventRef.current)) {
      socket.on(eventRef.current, handleNewData);
      console.log(`👂 Escuchando evento: ${eventRef.current}`);
    }

    return () => {
      socket.off(eventRef.current, handleNewData);
       console.log(`🚫 Dejado de escuchar evento: ${eventRef.current}`);
    };
  }, [symbol]);

  return { data, isLoading, isError };
};
