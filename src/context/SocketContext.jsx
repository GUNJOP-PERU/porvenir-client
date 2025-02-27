import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import { createRouteMap } from "@/hooks/routeMap";


const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket] = useState(() =>
    io(import.meta.env.VITE_URL, { autoConnect: true })
  );
  const queryClient = useQueryClient();
  const routeMap = createRouteMap(queryClient); // 🛠️ Instanciamos con queryClient

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    console.log("🔌 Socket conectado");

    const topics = Object.keys(routeMap);

    const handleNewData = (topic, newData) => {
      if (!newData || Object.keys(newData).length === 0) {
        console.log(`⚠️ Datos vacíos en el tópico: ${topic}`);
        return;
      }

      console.log(`📡 Nuevo dato en ${topic}:`, newData);

      const updateFn = routeMap[topic];
      if (updateFn) {
        updateFn(newData);
      } else {
        console.warn(`⚠️ No hay lógica definida para el tópico: ${topic}`);
      }
    };

    topics.forEach((topic) => {
      socket.on(topic, (data) => handleNewData(topic, data));
      console.log(`👂 Escuchando evento: ${topic}`);
    });

    return () => {
      console.log("❌ Desuscribiendo tópicos y desconectando socket...");
      topics.forEach((topic) => socket.off(topic));
      socket.disconnect();
    };
  }, [socket, queryClient]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

// Hook para acceder al socket en otros componentes
export const useSocket = () => useContext(SocketContext);
