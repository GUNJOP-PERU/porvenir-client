import { useProductionStore } from "@/store/ProductionStore";
import { useEffect } from "react";


export function useProductionWebSocket() {
  useEffect(() => {
    // const socket = new WebSocket(`${import.meta.env.VITE_URL}/websocket`);

    // socket.onopen = () => {
    //   console.log("Conectado al WebSocket");
    // };

    // socket.onmessage = (event) => {
    //   const data = JSON.parse(event.data);
    //   console.log("Datos recibidos:", data);

    //   // Actualiza solo la parte específica del estado en Zustand
    //   if (data.type && data.payload) {
    //     useProductionStore.getState().setProductionData(data.type, data.payload);
    //   }
    // };

    // socket.onerror = (error) => {
    //   console.error("Error en WebSocket:", error);
    // };

    // socket.onclose = () => {
    //   console.log("WebSocket cerrado, intentando reconectar...");
    //   setTimeout(() => useProductionWebSocket(), 3000); // Intentar reconectar en 3s
    // };

    // return () => {
    //   socket.close();
    // };
  }, []);
}
