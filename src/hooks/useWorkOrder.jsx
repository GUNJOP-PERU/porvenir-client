import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSocket } from "@/context/SocketContext";

export const useWorkOrder = () => {
  const queryClient = useQueryClient();
  const socket = useSocket();
  const eventRef = useRef("order-ready");

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
      console.log("🔗 Socket conectado a:", socket.io.uri);
    }

    const handleNewWorkOrder = (newData) => {
      console.log("📩 Datos recibidos en 'order-ready':", newData);
    
      queryClient.setQueryData(["workOrder"], (oldData) => {
        if (!oldData || !oldData.data) return { data: [newData] }; // Si no hay datos, creamos el array
    
        return {
          ...oldData, // Mantenemos el resto de `oldData`
          data: oldData.data.map((order) =>
            order._id === newData._id ? { ...order, ...newData } : order
          ),
        };
      });
    };
    

    if (!socket.hasListeners(eventRef.current)) {
      socket.on(eventRef.current, handleNewWorkOrder);
      console.log(`👂 Escuchando evento: ${eventRef.current}`);
    } else {
      console.log(`⚠️ Ya estaba escuchando el evento: ${eventRef.current}`);
    }

    return () => {
      socket.off(eventRef.current, handleNewWorkOrder);
      console.log(`🚫 Dejado de escuchar evento: ${eventRef.current}`);
    };
  }, [queryClient]);
};
