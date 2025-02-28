import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import { createRouteMap } from "@/hooks/routeMap";
import { useAuthStore } from "@/store/AuthStore";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const isAuth = useAuthStore((state) => state.isAuth); // ✅ Detecta si el usuario está autenticado
  const [socket, setSocket] = useState(null); // ⏳ El socket solo se crea cuando `isAuth === true`
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isAuth) {
      console.log("🔌 Usuario autenticado. Conectando socket...");
      const newSocket = io(import.meta.env.VITE_URL, { autoConnect: true });

      newSocket.connect();
      setSocket(newSocket);

      newSocket.on("connect", () => console.log("✅ Socket conectado"));

      const routeMap = createRouteMap(queryClient); // 🛠️ Instancia el routeMap con queryClient
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
        newSocket.on(topic, (data) => handleNewData(topic, data));
        console.log(`👂 Escuchando evento: ${topic}`);
      });

      return () => {
        console.log("❌ Desuscribiendo tópicos y desconectando socket...");
        topics.forEach((topic) => newSocket.off(topic));
        newSocket.disconnect();
        setSocket(null);
      };
    } else {
      console.log("🔒 No hay usuario autenticado. Desconectando socket...");
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    }
  }, [isAuth]); // ✅ Solo se ejecuta cuando cambia `isAuth`

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

// Hook para acceder al socket en otros componentes
export const useSocket = () => useContext(SocketContext);
