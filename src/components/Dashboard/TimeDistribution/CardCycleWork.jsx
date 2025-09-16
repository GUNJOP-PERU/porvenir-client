import React from "react";
import { formatDurationMinutes } from "@/lib/utilsGeneral";
import ImgTruck1 from "/truck-01.svg";
import ImgTruck2 from "/truck-02.svg";
import ImgTruck3 from "/truck-03.svg";
import ImgTruck4 from "/truck-04.svg";
import ImgLineSquare from "/lineSquare-2.svg";
import { StatusDisplay } from "../StatusDisplay";

const CardCycleWork = React.memo(({ data, isLoading, isError }) => {

  if (isLoading || isError || !data || data.length === 0)
    return (
      <StatusDisplay
        isLoading={isLoading}
        isError={isError}
        noData={!data || data.length === 0}
      />
    );

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="w-full h-[200px] md:w-[80%] grid grid-cols-2 grid-rows-2 gap-y-10 relative">
        <div className="flex items-center justify-center gap-4 font-bold  flex-row ">
          <div className="flex flex-col items-center justify-center gap-1.5">
            <h4 className="text-zinc-400 text-xs leading-3">Descargando</h4>
            <span className="font-extrabold leading-4">
            {formatDurationMinutes(data?.avg_time_dump?.value || 0)}             
            </span>
          </div>
          <img className="w-16 md:w-24 h-auto" src={ImgTruck1} />
        </div>
        <div className="flex items-center justify-center gap-4 font-bold flex-row-reverse ">
          <div className="flex flex-col items-center justify-center gap-1.5">
            <h4 className="text-zinc-400 text-xs leading-3">Viaje vacio</h4>
            <span className="font-extrabold leading-4">
              {formatDurationMinutes(data?.avg_time_empty?.value || 0)} 
            </span>
          </div>
          <img className="w-16 md:w-24 h-auto" src={ImgTruck2} />
        </div>
        <div className="flex items-center justify-center gap-4 font-bold flex-row ">
          <div className="flex flex-col items-center justify-center gap-1.5">
            <h4 className="text-zinc-400 text-xs leading-3">Viaje cargado</h4>
            <span className="font-extrabold leading-4">
              {formatDurationMinutes(data?.avg_time_transport?.value || 0)} 
            </span>
          </div>
          <img className="w-16 md:w-24 h-auto" src={ImgTruck3} />
        </div>
        <div className="flex items-center justify-center gap-4 font-bold flex-row-reverse  ">
          <div className="flex flex-col items-center justify-center gap-1.5">
            <h4 className="text-zinc-400 text-xs leading-3">Cargando</h4>
            <span className="font-extrabold leading-4">             
              {formatDurationMinutes(data?.avg_time_load?.value || 0)} 
            </span>
          </div>
          <img
            className="w-16 md:w-24 h-auto"
            src={ImgTruck4}
            loading="lazy"
          />
        </div>
        <img
          className="w-full h-[90%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20"
          src={ImgLineSquare}
        />
      </div>
    </div>
  );
});

CardCycleWork.displayName = "CardCycleWork";
export default CardCycleWork;