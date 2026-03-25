/* eslint-disable react/prop-types */
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
  const [secondarySocket, setSecondarySocket] = useState(null);
  const [topicList, setTopicList] = useState([]);
  const [isSocketReady, setIsSocketReady] = useState(false);
  
  // Estados para el Servidor Secundario (Detecciones)
  const [connected, setConnected] = useState(false);
  const [events, setEvents] = useState([]);
  const [lastEvent, setLastEvent] = useState(null);

  const clearEvents = () => {
    setEvents([]);
    setLastEvent(null);
  };

  useEffect(() => {
    if (isAuth) {
      // Socket Primario (VITE_URL)
      const newSocket = io(import.meta.env.VITE_URL, { autoConnect: true });
      // Socket Secundario (VITE_URL_SECONDARY) - Detecciones
      const newSecSocket = io(import.meta.env.VITE_URL_SECONDARY, { 
        path: "/socket.io",
        autoConnect: true 
      });

      newSocket.connect();
      newSecSocket.connect();

      newSocket.on("connect", () => {
        setSocket(newSocket);
        setIsSocketReady(true);
        console.log("✅ Socket Primario conectado");
      });

      newSecSocket.on("connect", () => {
        setSecondarySocket(newSecSocket);
        setConnected(true);
        console.log("✅ Socket Secundario (3012) conectado");
      });

      newSecSocket.on("disconnect", () => setConnected(false));
      newSecSocket.on("connect_error", () => setConnected(false));

      // Escuchar eventos específicos de detección (mqtt:data)
      newSecSocket.on("mqtt:data", (payload) => {
        setLastEvent(payload);
        setEvents((prev) => [payload, ...prev].slice(0, 100));
      });

      newSocket.on("topic-list", (list) => {
        setTopicList(list);
      });

      newSocket.emit("get-topic-list");

      return () => {
        newSocket.disconnect();
        newSecSocket.disconnect();
        setIsSocketReady(false);
        setConnected(false);
        setSocket(null);
        setSecondarySocket(null);
      };
    } else {
      setSocket(null);
      setSecondarySocket(null);
      setIsSocketReady(false);
      setConnected(false);
    }
  }, [isAuth]); // ⚡ Removed 'socket' and 'secondarySocket' to avoid infinite loop

  return (
    <SocketContext.Provider value={{ 
      socket, 
      secondarySocket, 
      isSocketReady, 
      topicList,
      connected,
      events,
      lastEvent,
      clearEvents
    }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }

  return { 
    socket: context.socket, 
    secondarySocket: context.secondarySocket, 
    isSocketReady: context.isSocketReady, 
    topicList: context.topicList,
    connected: context.connected,
    events: context.events,
    lastEvent: context.lastEvent,
    clearEvents: context.clearEvents
  };
};
