import { useQueryClient } from "@tanstack/react-query";
import { useSocket } from "../context/SocketContext";
import { useEffect, useMemo, useState } from "react";

function subscribe(socket, topic, cb) {
  socket.emit('subscribe-topic', topic);
  socket.on(topic, cb);
  return () => {
    socket.off(topic, cb);
    socket.emit('unsubscribe-topic', topic);
  };
}

export function useSocketValue(topic, queryKey) {
  const { socket } = useSocket();
  const queryClient = useQueryClient();
  const [payload, setPayload] = useState(null);

  useEffect(() => {
    if (!topic || !socket) return;

    console.log(`Conectando al tópico: ${topic}`);
    const unsubscribe = subscribe(socket, topic, (data) => { 
      console.log('Datos recibidos del socket:', data); 
      setPayload(data);

      if (queryKey) {
        queryClient.setQueryData(queryKey, data);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [topic, socket, queryKey, queryClient]);

  return payload;
}

export function useSocketTopicValue(topic, queryKey) {
  const payload = useSocketValue(topic, queryKey);
  return useMemo(() => payload, [payload]);
}
