import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useFetchData } from "@/hooks/useGlobalQuery";
import TimeAgo from "timeago-react";
import { putDataRequest } from "@/api/api";
import { useToast } from "@/hooks/useToaster";
import { ModalComment } from "@/components/Dashboard/FleetStatus/ModalComment";
import IconTruck from "@/icons/IconTruck";
import PageHeader from "@/components/PageHeader";

export default function FleetStatus() {
  const { addToast } = useToast();
  const {
    data,
    refetch,
    isFetching,
    isLoading: tripsLoading,
    isError: tripsError,
  } = useFetchData("beacon-truck", "beacon-truck", { refetchInterval: 30000 });
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTruck, setSelectedTruck] = useState(null);

  const [columns, setColumns] = useState({
    operativo: {
      name: "Operativo",
      color: "bg-green-950",
      titleColor: "text-[#46fea5d4]",
      items: [],
    },
    mantenimiento: {
      name: "Mantenimiento",
      color: "bg-yellow-950",
      titleColor: "text-[#ffca16]",
      items: [],
    },
    inoperativo: {
      name: "Inoperativo",
      color: "bg-red-950",
      titleColor: "text-[#ff9592]",
      items: [],
    },
  });

  React.useEffect(() => {
    if (!data) return;

    const operativoItems = [];
    const mantenimientoItems = [];
    const inoperativoItems = [];

    data.forEach((truck) => {
      const item = {
        id: truck._id,
        content: truck.tag,
        lastUbication: truck.lastUbication,
        updatedAt: truck.updatedAt,
      };
      if (truck.status === "operativo") operativoItems.push(item);
      else if (truck.status === "mantenimiento") mantenimientoItems.push(item);
      else inoperativoItems.push(item);
    });

    setColumns((prev) => ({
      ...prev,
      operativo: { ...prev.operativo, items: operativoItems },
      mantenimiento: { ...prev.mantenimiento, items: mantenimientoItems },
      inoperativo: { ...prev.inoperativo, items: inoperativoItems },
    }));
  }, [data]);

  const onDragEnd = React.useCallback((result) => {
    if (!result.destination) return;
    const { source, destination, draggableId } = result;

    if (source.droppableId !== destination.droppableId) {
      let newStatus;
      if (destination.droppableId === "operativo") newStatus = "operativo";
      else if (destination.droppableId === "mantenimiento")
        newStatus = "mantenimiento";
      else newStatus = "inoperativo";

      setSelectedTruck({ id: draggableId, status: newStatus });
      setIsOpen(true);
    } else {
      setColumns((prev) => {
        const column = prev[source.droppableId];
        const copiedItems = [...column.items];
        const [removed] = copiedItems.splice(source.index, 1);
        copiedItems.splice(destination.index, 0, removed);

        return {
          ...prev,
          [source.droppableId]: {
            ...column,
            items: copiedItems,
          },
        };
      });
    }
  }, []);

  const itemColors = {
    operativo: {
      outer: "bg-green-700/50",
      inner: "bg-green-600",
      color: "#46fea5d4",
    },
    mantenimiento: {
      outer: "bg-yellow-700/50",
      inner: "bg-yellow-600",
      color: "#ecba03",
    },
    inoperativo: {
      outer: "bg-red-700/50",
      inner: "bg-red-600",
      color: "#ff9592",
    },
  };

  return (
    <>
      <div className="flex-1 w-full bg-cover bg-no-repeat bg-center bg-[url('/map.png')] p-4 flex flex-col">      
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 flex-1 grid-rows-3 xl:grid-rows-1 ">
          <DragDropContext onDragEnd={onDragEnd}>
            {Object.entries(columns).map(([columnId, column]) => (
              <div
                key={columnId}
                className={`w-full flex flex-col items-center select-none p-2 rounded-xl xl:h-[calc(100vh-100px)] h-[calc(28vh)] ${column.color}`}
              >
                <div className="w-full pl-2 pt-1 pb-2 flex items-center gap-2 h-9">
                  <div className="text-xs font-semibold text-zinc-200 select-none size-6 rounded-[7px] bg-black/80 flex items-center justify-center">
                    {column.items.length}
                  </div>
                  <h4
                    className={`${column.titleColor} text-sm font-bold select-none`}
                  >
                    {column.name}
                  </h4>
                </div>
                <Droppable droppableId={columnId}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`p-1 w-full flex-1 overflow-y-auto custom-scrollbar rounded-xl transition-colors ease-in-out duration-500 grid grid-cols-2 xl:grid-cols-3 items-start auto-rows-min gap-2  ${
                        snapshot.isDraggingOver ? "bg-black/20" : ""
                      }`}
                    >
                      {column.items.map((item, index) => (
                        <Draggable
                          key={item.id}
                          draggableId={item.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <div
                                className={`p-0.5 rounded-lg shadow ${
                                  itemColors[columnId].outer
                                } cursor-move select-none outline outline-2 outline-offset-1 outline-transparent hover:outline-white/80 ease-in-out duration-300 flex flex-col gap-1 ${
                                  snapshot.isDragging
                                    ? "opacity-80 rotate-[10deg]"
                                    : ""
                                }`}
                              >
                                <div
                                  className={`${itemColors[columnId].inner} rounded-lg py-1 px-1 flex items-center gap-2`}
                                >
                                  <div className="w-8 h-8 overflow-hidden bg-black/20 rounded-lg flex-shrink-0">
                                    <IconTruck
                                      className="h-7 w-16 -translate-x-1 translate-y-0.5"
                                      color={itemColors[columnId].color}
                                    />
                                  </div>

                                  <div className="flex flex-col gap-0.5 min-w-0">
                                    <span className="text-xs font-bold text-white leading-none ">
                                      {item.content}
                                    </span>
                                    <span className="text-[10px] font-normal text-black leading-none truncate">
                                      {item.lastUbication}
                                    </span>
                                  </div>
                                </div>
                                <span className="text-[10px] text-zinc-300 select-none leading-[10px] pl-2 pb-0.5 text-center">
                                  En línea{" "}
                                  <TimeAgo
                                    datetime={item.updatedAt}
                                    locale="es"
                                  />
                                </span>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </DragDropContext>
        </div>
      </div>
      <ModalComment
        isOpen={isOpen}
        onClose={(open) => setIsOpen(open)}
        truck={selectedTruck}
        refetch={refetch}
      />
    </>
  );
}
