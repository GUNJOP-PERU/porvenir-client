// src/context/SocketContext.js
import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket] = useState(() => io(import.meta.env.VITE_URL, { autoConnect: true }));

  useEffect(() => {
    console.log("🔌 Socket conectado");

    return () => {
      console.log("❌ Socket desconectado");
      socket.disconnect();
    };
  }, [socket]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

// Hook para acceder al socket
export const useSocket = () => useContext(SocketContext);
