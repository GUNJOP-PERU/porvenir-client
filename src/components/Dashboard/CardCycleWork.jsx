import { useGraphicData } from "@/hooks/useGraphicData";
import React from "react";
import NumberFlow from "@number-flow/react";

const CardCycleWork = React.memo(() => {
  const { data, isLoading, isError } = useGraphicData(
    "truck-job-cycle",
    "dashboard/truck/job-cycle"
  );

  if (isLoading)
    return (
      <div className="bg-zinc-200 rounded-2xl py-2 px-4 flex items-center justify-center w-full h-[280px] animate-pulse"></div>
    );

  if (isError)
    return (
      <div className="flex items-center justify-center h-[280px]">
        <span className="text-[10px] text-red-500">Ocurrió un error</span>
      </div>
    );

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="w-full h-[200px] md:w-[80%] grid grid-cols-2 grid-rows-2 gap-y-10 relative">
        <div className="flex items-center justify-center gap-4 font-bold  flex-row ">
          <div className="flex flex-col items-center justify-center gap-1.5">
            <h4 className="text-zinc-400 text-xs leading-3">Descargando</h4>
            <span className="font-extrabold leading-4">
              <NumberFlow
                value={data?.avg_time_dump?.value || 0}
                format={{
                  notation: "standard",
                  style: "decimal",
                  maximumFractionDigits: 2,
                }}
              />
              min
            </span>
          </div>
          <img className="w-16 md:w-24 h-auto" src="/src/assets/truck-01.svg" />
        </div>
        <div className="flex items-center justify-center gap-4 font-bold flex-row-reverse ">
          <div className="flex flex-col items-center justify-center gap-1.5">
            <h4 className="text-zinc-400 text-xs leading-3">Viaje vacio</h4>
            <span className="font-extrabold leading-4">
              <NumberFlow
                start={0}
                value={data?.avg_time_empty?.value || 0}
                format={{
                  notation: "standard",
                  style: "decimal",
                  maximumFractionDigits: 2,
                }}
              />
              min
            </span>
          </div>
          <img className="w-16 md:w-24 h-auto" src="/src/assets/truck-02.svg" />
        </div>
        <div className="flex items-center justify-center gap-4 font-bold flex-row ">
          <div className="flex flex-col items-center justify-center gap-1.5">
            <h4 className="text-zinc-400 text-xs leading-3">Viaje cargado</h4>
            <span className="font-extrabold leading-4">
              <NumberFlow
                value={data?.avg_time_transport?.value || 0}
                format={{
                  notation: "standard",
                  style: "decimal",
                  maximumFractionDigits: 2,
                }}
              />
              min
            </span>
          </div>
          <img className="w-16 md:w-24 h-auto" src="/src/assets/truck-03.svg" />
        </div>
        <div className="flex items-center justify-center gap-4 font-bold flex-row-reverse  ">
          <div className="flex flex-col items-center justify-center gap-1.5">
            <h4 className="text-zinc-400 text-xs leading-3">Cargando</h4>
            <span className="font-extrabold leading-4">
              <NumberFlow
                value={data?.avg_time_load?.value || 0}
                format={{
                  notation: "standard",
                  style: "decimal",
                  maximumFractionDigits: 2,
                }}
              />
              min
            </span>
          </div>
          <img
            className="w-16 md:w-24 h-auto"
            src="/src/assets/truck-04.svg"
            loading="lazy"
          />
        </div>
        <img
          className="w-full h-[90%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20"
          src="/src/assets/lineSquare-2.svg"
        />
      </div>
    </div>
  );
});

CardCycleWork.displayName = "CardCycleWork";
export default CardCycleWork;

// const data = [
//   { text: "Descargando", value: 1.1,unit:"min", icon: load, reverse: false },
//   { text: "Viaje Vacio", value: 20.3,unit:"min", icon: empty, reverse: true },
//   { text: "Viaje Cargado", value: 31.4,unit:"min", icon: transport, reverse: false },
//   { text: "Cargando", value: 8.1,unit:"min", icon: dump, reverse: true },
// ];
