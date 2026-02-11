import { useQueryClient } from "@tanstack/react-query";
import { useSocket } from "../context/SocketContext";
import { useEffect, useMemo, useState } from "react";
import { useToast } from "./useToaster";


function subscribe(socket, topic, cb) {
  socket.emit("subscribe-topic", topic);
  socket.on(topic, cb);
  return () => {
    socket.off(topic, cb);
    socket.emit("unsubscribe-topic", topic);
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
      console.log("Datos recibidos del socket:", data);
      setPayload(data);

      if (queryKey) {
        queryClient.setQueryData(queryKey, data);
      }
    });

    return () => unsubscribe();
  }, [topic, socket, queryKey, queryClient]);

  return payload;
}

export function useSocketTopicValue(topic, queryKey) {
  const payload = useSocketValue(topic, queryKey);
  return useMemo(() => payload, [payload]);
}

export function useSocketRefetch(topics, refetch) {
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket || !topics) return;

    const topicList = Array.isArray(topics) ? topics : [topics];

    const unsubscribers = topicList.map((topic) =>
      subscribe(socket, topic, () => {
        console.log("Evento socket:", topic);
        refetch();
      })
    );

    return () => unsubscribers.forEach((u) => u());
  }, [socket, topics, refetch]);
}

export function useJournalChanged() {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;
    const topic = "journal-changed";
    // console.log(`Conectando al tópico: ${topic}`);

    const unsubscribe = subscribe(socket, topic, (data) => {
      // console.log('Datos recibidos del socket:', data);
      if (data?.status === true) {
        // console.log("🧹 La jornada ha cambiado. Limpiando 'shift-variable'...");
        const queries = queryClient.getQueriesData({
          queryKey: ["shift-variable"],
          exact: false,
        });
        queries.forEach(([key]) => queryClient.setQueryData(key, []));
        queryClient.refetchQueries({
          queryKey: ["shift-variable", "list-fleet-truck"],
        });
      } else {
        console.log("ℹ️ No se requiere limpieza de 'shift-variable'");
      }
    });

    return () => {
      unsubscribe();
    };
  }, [socket, queryClient]);
}
export function useChecklistAlert() {
  const { socket } = useSocket();
  const { addToastFS } = useToast();

  useEffect(() => {
    if (!socket) return;

    const topic = "porvenir/checklist/alert";
     console.log(`Conectando al tópico: ${topic}`);

    const handler = (newData) => {
      console.log("Datos recibidos del socket:", newData);
      const topicData = JSON.parse(newData);
      addToastFS({
        title: "CheckList Advertencia",
        subTitle: `Usuario: ${topicData.user} | Vehículo: ${topicData.vehicle}`,
        date: new Date(topicData.date).toLocaleString(),
        message:
          "Se ha detectado un error en el app al seleccionar un checklist.",
        list: topicData.badCriticalItems.map(
          (item) =>
            `${item.text} <br/> Estado: ${item.state} - (${
              item.isCritical ? "Crítico" : "No Crítico"
            })`
        ),
        variant: "destructive",
      });
    };

    socket.on(topic, handler);
    return () => socket.off(topic, handler);
  }, [socket, addToastFS]);
}
