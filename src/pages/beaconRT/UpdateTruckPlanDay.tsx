import React, { useState, useEffect, useCallback, useMemo } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import clsx from "clsx";
import { postDataRequest, putDataRequest } from "@/api/api";
import { useToast } from "@/hooks/useToaster";
import { useFetchData } from "@/hooks/useGlobalQueryV2";
import IconTruck from "@/icons/IconTruck";
import { getCurrentDay } from "@/utils/dateUtils";
import type { BeaconCycle } from "@/types/Beacon";
import { roundAndFormat } from "@/lib/utilsGeneral";

type Volquete = {
  _id: string;
  id?: string;
  type: string;
  tagName: string;
  plate: string;
};

type Plan = {
  _id: string;
  phase: string;
  volquetes: Volquete[];
  tonnage: number;
  shift: string;
  state: string;
  type: string;
  date: string;
  day: number;
  month: number;
  year: number;
  nro_volquetes: number;
  frontLabor: string;
};

const extractNumber = (tag: string) => {
  const match = tag.match(/(\d+)/);
  return match ? parseInt(match[0], 10) : 0;
};

export default function UpdateTruckPlanDay() {
  const { addToast } = useToast();
  const { data: mineralTripsData = [] } = useFetchData<BeaconCycle[]>(
    "trip-group-by-current-day-truck-rt",
    `beacon-track/trip?material=mineral&startDate=${
      getCurrentDay().startDateString
    }&endDate=${getCurrentDay().endDateString}${
      getCurrentDay().shift ? `&shift=${getCurrentDay().shift}` : ""
    }`,
    { refetchInterval: 5000 }
  );
  const { data: planData = [], refetch } = useFetchData<Plan[]>(
    "plan-extract-realtime",
    "planDay/byDay?type=executed&populate=true",
    {}
  );

  const { data: availableTrucks = [] } = useFetchData<Volquete[]>(
    "vehicle",
    "vehicle?type=truck",
    {}
  );

  const mineralTrips = useMemo(() => {
    const grouped = mineralTripsData
      .flatMap((unit) => unit.trips)
      .reduce((acc, trip) => {
        const front = trip.frontLaborList?.[0]?.name || "Otros";
        acc[front] = (acc[front] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    return Object.entries(grouped).map(([frontLabor, trips]) => ({
      frontLabor,
      trips,
      tonnage: trips * 36,
    }));
  }, [mineralTripsData]);

  const [columns, setColumns] = useState<Record<string, any>>({});

  const columnsData = useMemo(() => {
    if (!planData) return {};

    const newColumns: Record<string, any> = {};
    const assignedIds = new Set(
      planData.flatMap((plan) => plan.volquetes.map((v) => v._id))
    );

    const unassigned = availableTrucks.filter((v) => !assignedIds.has(v._id));

    newColumns["disponibles"] = {
      name: "Volquetes disponibles",
      color: "bg-[#3C1C1E]",
      titleColor: "text-[#D1686D]",
      isValid: false,
      items: unassigned
        .slice() // evita mutar availableTrucks
        .sort((a, b) => extractNumber(a.tagName) - extractNumber(b.tagName))
        .map((v) => ({
          id: v._id,
          tagName: v.tagName,
          plate: v.plate,
          type: v.type,
          color: "#FE979C",
          bgColor: "bg-[#fe6d73]",
        })),
    };

    planData.forEach((plan) => {
      const tripInfo = mineralTrips.find(
        (m) => m.frontLabor === plan.frontLabor
      );

      newColumns[plan._id] = {
        name: plan.frontLabor || "Sin nombre",
        color: "bg-zinc-800",
        titleColor: "text-[#ff5000]",
        tonnage: plan.tonnage,
        tonnageExecuted: tripInfo?.tonnage || 0,
        trips: tripInfo?.trips || 0,
        isValid: true,
        items: (plan.volquetes || [])
          .slice() // evita mutar plan.volquetes
          .sort((a, b) => extractNumber(a.tagName) - extractNumber(b.tagName))
          .map((v) => ({
            id: v._id,
            tagName: v.tagName,
            plate: v.plate,
            type: v.type,
            color: "#FF9464",
            bgColor: "bg-[#ff5000]",
          })),
      };
    });

    return newColumns;
  }, [planData, availableTrucks, mineralTrips]);

  useEffect(() => {
    if (!planData) return;
    setColumns(columnsData);
  }, [columnsData, planData]);

  const onDragEnd = useCallback(
    async (result: any) => {
      const { source, destination } = result;
      if (!destination) return;

      const sourceCol = columns[source.droppableId];
      const destCol = columns[destination.droppableId];
      const [moved] = sourceCol.items.splice(source.index, 1);
      destCol.items.splice(destination.index, 0, moved);

      setColumns({
        ...columns,
        [source.droppableId]: sourceCol,
        [destination.droppableId]: destCol,
      });

      const sourceId =
        source.droppableId === "disponibles" ? null : source.droppableId;
      const destId =
        destination.droppableId === "disponibles"
          ? null
          : destination.droppableId;

      try {
        if (sourceId && destId) {
          await postDataRequest(`planDay/update-vehicle-plan`, {
            vehicleId: moved.id,
            currentPlanId: sourceId,
            newPlanId: destId,
          });
        } else if (!sourceId && destId) {
          const destPlan = planData.find((p) => p._id === destId);
          if (!destPlan) throw new Error("Plan destino no encontrado");

          const updatedPlan = {
            ...destPlan,
            volquetes: [
              ...destPlan.volquetes,
              {
                _id: moved.id,
                tagName: moved.tagName,
                plate: moved.plate,
                type: moved.type,
              },
            ],
          };

          await putDataRequest(`planDay/${destId}`, updatedPlan);
        } else if (sourceId && !destId) {
          const sourcePlan = planData.find((p) => p._id === sourceId);
          if (!sourcePlan) throw new Error("Plan origen no encontrado");

          const updatedPlan = {
            ...sourcePlan,
            volquetes: sourcePlan.volquetes.filter((v) => v._id !== moved.id),
          };

          await putDataRequest(`planDay/${sourceId}`, updatedPlan);
        }

        addToast({
          title: "Actualización exitosa",
          message: "El cambio de asignación fue aplicado correctamente.",
          variant: "success",
        });
      } catch (error) {
        console.error("Error al actualizar el plan del volquete:", error);
        addToast({
          title: "Error al actualizar",
          message: "No se pudo procesar la actualización.",
          variant: "destructive",
        });
      } finally {
        refetch();
      }
    },
    [columns, planData]
  );

  return (
    <div className="flex-1 w-full bg-zinc-900 p-4 flex flex-col gap-3">
      <div className="rounded-xl py-2 px-4">
        <h1 className="text-zinc-200 text-md lg:text-xl font-bold leading-none">
          Ejecución de Volquetes por Frente de Labor
        </h1>
        <p className="text-zinc-400 text-[10.5px] lg:text-xs">
          Cada columna representa un frente de labor o un pool de disponibles —{" "}
          {new Date().toLocaleDateString()}
        </p>
      </div>

      <div
        className={clsx(
          "grid gap-2 flex-1",
          Object.keys(columns).length <= 5
            ? "grid-cols-5 grid-rows-1"
            : "grid-cols-5 grid-rows-2"
        )}
      >
        <DragDropContext onDragEnd={onDragEnd}>
          {Object.entries(columns).map(([columnId, column]) => (
            <div
              key={columnId}
              className={`w-full flex flex-col items-center select-none p-2 rounded-xl relative ${column.color}`}
            >
              <div className="text-xs font-semibold text-zinc-200 select-none size-6 rounded-b-[7px] bg-white/10 flex items-center justify-center absolute top-0 right-0">
                {column.items.length}
              </div>
              <div className="w-full h-12 flex flex-col justify-center gap-1 px-2">
                <h4
                  className={`${column.titleColor} text-sm uppercase font-bold select-none truncate leading-none`}
                >
                  {column.name}
                </h4>
                {column.isValid ? (
                  <div className="flex items-center gap-2">
                    <span className="text-[#FF9464] text-[12px] font-bold leading-none border border-[#FF9464]/50 rounded-xl py-[2px] px-[8px]">
                      {roundAndFormat(column.tonnageExecuted ?? 0)} TM •{" "}
                      <small className="text-[#FF9464] text-[8px] font-bold leading-none ">
                        REAL
                      </small>
                    </span>
                    <span className="text-[10px] text-zinc-400 font-bold leading-none border border-zinc-400/50 rounded-xl py-[2px] px-[8px]">
                      {roundAndFormat(column.tonnage ?? 0)} TM •{" "}
                      <small className="text-zinc-400 text-[8px] font-bold leading-none">
                        P.CAMPO
                      </small>
                    </span>
                  </div>
                ) : (
                  <span className="text-white/50 text-[10px] font-medium leading-none ">
                    Para agregar un vehiculo solo arrastrar
                  </span>
                )}
              </div>

              <Droppable droppableId={columnId}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={clsx(
                      "p-1 w-full flex-1 overflow-y-auto custom-scrollbar rounded-xl transition-colors ease-in-out duration-500 grid grid-cols-2 items-start auto-rows-min gap-1.5",
                      snapshot.isDraggingOver ? "bg-black/20" : ""
                    )}
                  >
                    {column.items.map((item: any, index: number) => (
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
                              className={clsx(
                                "rounded-lg py-1 px-1 flex items-center gap-2 cursor-move select-none outline outline-2 outline-offset-1 outline-transparent hover:outline-white/80 ease-in-out duration-300",
                                item.bgColor,
                                snapshot.isDragging
                                  ? "opacity-70 rotate-[10deg]"
                                  : ""
                              )}
                            >
                              <div className="w-8 h-8 overflow-hidden bg-black/20 rounded-lg flex flex-col items-center justify-center font-extrabold text-white leading-none gap-[1px] ">
                                <span className="text-[7px] font-medium text-zinc-50/80">
                                  CAM
                                </span>
                                <span>
                                  {item.tagName?.split("-").pop() || "?"}
                                </span>
                              </div>
                              <div className="flex flex-col gap-0.5 min-w-0">
                                <IconTruck
                                  className="h-7 w-11"
                                  color={item.color}
                                />
                              </div>
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
  );
}
