import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { io } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import { createRouteMap } from "@/hooks/routeMap";
import { useAuthStore } from "@/store/AuthStore";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const isAuth = useAuthStore((state) => state.isAuth);
  const [socket, setSocket] = useState(null);
  const queryClient = useQueryClient();

  // 🏗️ Crear routeMap solo una vez y evitar recreaciones innecesarias
  const routeMap = useMemo(() => createRouteMap(queryClient), [queryClient]);
  const topics = useMemo(() => Object.keys(routeMap), [routeMap]);

  // 🔄 Buffer para acumular actualizaciones (referencia mutable para evitar renders)
  const batchUpdatesRef = useMemo(() => ({ updates: [] }), []);

  // 🛠️ Procesar todas las actualizaciones en lote
  const flushUpdates = useCallback(() => {
    if (batchUpdatesRef.updates.length === 0) return;

    // 🚀 Ejecutamos todas las actualizaciones de una vez
    batchUpdatesRef.updates.forEach(({ topic, newData }) => {
      const updateFn = routeMap[topic];
      if (updateFn) {
        updateFn(newData);
      } else {
        console.warn(`⚠️ No hay lógica definida para el tópico: ${topic}`);
      }
    });

    // Limpiar el buffer después de procesar
    batchUpdatesRef.updates = [];
  }, [routeMap]);

  // 📡 Manejo de datos recibido en el socket
  const handleNewData = useCallback(
    (topic, newData) => {
      if (!newData || Object.keys(newData).length === 0) {
        console.log(`⚠️ Datos vacíos en el tópico: ${topic}`);
        return;
      }

      // console.log(`📡 Nuevo dato en ${topic}:`, newData);

      // Acumulamos en el buffer
      batchUpdatesRef.updates.push({ topic, newData });

      // Ejecutamos `flushUpdates` en el siguiente ciclo de ejecución
      if (batchUpdatesRef.updates.length === 1) {
        setTimeout(flushUpdates, 0);
      }
    },
    [flushUpdates]
  );

  useEffect(() => {
    if (isAuth) {
      // console.log("🔌 Usuario autenticado. Conectando socket...");
      const newSocket = io(import.meta.env.VITE_URL, { autoConnect: true });

      newSocket.connect();
      setSocket(newSocket);
      newSocket.on("connect", () => console.log("✅ Socket conectado"));

      // Suscribir a los eventos
      topics.forEach((topic) => {
        newSocket.on(topic, (data) => handleNewData(topic, data));
        // console.log(`👂 Escuchando evento: ${topic}`);
      });

      return () => {
        // console.log("❌ Desuscribiendo tópicos y desconectando socket...");
        topics.forEach((topic) => newSocket.off(topic));
        newSocket.disconnect();
        setSocket(null);
      };
    } else {
      // console.log("🔒 No hay usuario autenticado. Desconectando socket...");
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    }
  }, [isAuth, topics, handleNewData]); // ✅ Ahora `handleNewData` y `topics` son estables

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

// Hook para acceder al socket en otros componentes
export const useSocket = () => useContext(SocketContext);
