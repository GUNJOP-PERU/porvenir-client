import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { io } from "socket.io-client";
import { useAuthStore } from "@/store/AuthStore";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { isAuth } = useAuthStore();
  const [socket, setSocket] = useState(null);
  const [topicList, setTopicList] = useState([]);
  const [isSocketReady, setIsSocketReady] = useState(false);

  useEffect(() => {
    if (isAuth) {
      const newSocket = io(import.meta.env.VITE_URL, { autoConnect: true });

      newSocket.connect();

      newSocket.on("connect", () => {
        setSocket(newSocket);
        setIsSocketReady(true);
        console.log("✅ Socket conectado")
      });

      newSocket.on("topic-list", (topicList) => {
        setTopicList(topicList);
      });

      newSocket.emit("get-topic-list");

      return () => {
        newSocket.disconnect();
        setIsSocketReady(false);
        setSocket(null);
      };
    } else {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsSocketReady(false);
      }
    }
  }, [isAuth]);

  return (
    <SocketContext.Provider value={{ socket, isSocketReady, topicList }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }

  return { socket: context.socket, isSocketReady: context.isSocketReady, topicList: context.topicList };
};

// import {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
//   useCallback,
//   useMemo,
// } from "react";
// import { io } from "socket.io-client";
// import { useQueryClient } from "@tanstack/react-query";
// import { createRouteMap } from "@/hooks/routeMap";
// import { useAuthStore } from "@/store/AuthStore";
// import { useToast } from "@/hooks/useToaster";

// const SocketContext = createContext();


//   // 🏗️ Crear routeMap solo una vez y evitar recreaciones innecesarias
//   const routeMap = useMemo(() => createRouteMap(queryClient), [queryClient]);
//   const topics = useMemo(() => Object.keys(routeMap), [routeMap]);

//   // 🔄 Buffer para acumular actualizaciones (referencia mutable para evitar renders)
//   const batchUpdatesRef = useMemo(() => ({ updates: [] }), []);

//   // 🛠️ Procesar todas las actualizaciones en lote
//   const flushUpdates = useCallback(() => {
//     if (batchUpdatesRef.updates.length === 0) return;

//     // 🚀 Ejecutamos todas las actualizaciones de una vez
//     batchUpdatesRef.updates.forEach(({ topic, newData }) => {
//       const updateFn = routeMap[topic];
//       if (updateFn) {
//         updateFn(newData);
//       } else {
//         console.warn(`⚠️ No hay lógica definida para el tópico: ${topic}`);
//       }
//     });

//     // Limpiar el buffer después de procesar
//     batchUpdatesRef.updates = [];
//   }, [routeMap]);

//   // 📡 Manejo de datos recibido en el socket
//   const handleNewData = useCallback(
//     (topic, newData) => {
//       if (!newData || Object.keys(newData).length === 0) {
//         console.log(`⚠️ Datos vacíos en el tópico: ${topic}`);
//         return;
//       }

//       console.log(`📡 Nuevo dato en ${topic}:`, newData);
//       if (topic === "checklist/alert") {
//         const topicData = JSON.parse(newData);
//         addToastFS({
//           title: "CheckList Advertencia",
//           subTitle: `Usuario: ${topicData.user} | Vehículo: ${topicData.vehicle}`,
//           date: new Date(topicData.date).toLocaleString(),
//           message:
//             "Se ha detectado un error en el app al seleccionar un checklist.",
//           list: topicData.badCriticalItems.map(
//             (item) =>
//               `${item.text} <br/> Estado: ${item.state} - (${
//                 item.isCritical ? "Crítico" : "No Crítico"
//               })`
//           ),
//           variant: "destructive",
//         });
//       }
//       // Acumulamos en el buffer
//       batchUpdatesRef.updates.push({ topic, newData });

//       // Ejecutamos `flushUpdates` en el siguiente ciclo de ejecución
//       if (batchUpdatesRef.updates.length === 1) {
//         setTimeout(flushUpdates, 0);
//       }
//     },
//     [flushUpdates]
//   );

//   useEffect(() => {
//     if (isAuth) {
//       const newSocket = io(import.meta.env.VITE_URL, { autoConnect: true });

//       newSocket.connect();
//       setSocket(newSocket);
//       newSocket.on("connect", () => console.log("✅ Socket conectado"));

//       topics.forEach((topic) => {
//         newSocket.on(topic, (data) => handleNewData(topic, data));
//       });

//       return () => {
//         topics.forEach((topic) => newSocket.off(topic));
//         newSocket.disconnect();
//         setSocket(null);
//       };
//     } else {
//       if (socket) {
//         socket.disconnect();
//         setSocket(null);
//       }
//     }
//   }, [isAuth, topics, handleNewData]); // ✅ Ahora `handleNewData` y `topics` son estables

//   return (
//     <SocketContext.Provider value={{ socket }}>
//       {children}
//     </SocketContext.Provider>
//   );
// };

// // Hook para acceder al socket en otros componentes
// export const useSocket = () => useContext(SocketContext);
