import clsx from "clsx";
import React from "react";
// const data = [
//   { text: "Descargando", value: 1.1,unit:"min", icon: load, reverse: false },
//   { text: "Viaje Vacio", value: 20.3,unit:"min", icon: empty, reverse: true },
//   { text: "Viaje Cargado", value: 31.4,unit:"min", icon: transport, reverse: false },
//   { text: "Cargando", value: 8.1,unit:"min", icon: dump, reverse: true },
// ];

const CardCycleWork = React.memo(({ data, title }) => {
  return (
    <>
      <h4 className="text-xs font-bold">{title}</h4>
      <div className="w-full md:w-[80%] grid grid-cols-2 grid-rows-2 gap-y-10  relative">
        <div className="flex items-center justify-center gap-4 font-bold  flex-row ">
          <div className="flex flex-col items-center justify-center gap-1.5">
            <h4 className="text-zinc-400 text-xs leading-3">Descargando</h4>
            <span className={clsx("font-extrabold leading-4")}>
              {data?.avg_time_dump?.value ? `${data.avg_time_dump.value}` : "0"}
              min
            </span>
          </div>
          <img className="w-16 md:w-24 h-auto" src="/src/assets/truck-01.svg" />
        </div>
        <div className="flex items-center justify-center gap-4 font-bold flex-row-reverse ">
          <div className="flex flex-col items-center justify-center gap-1.5">
            <h4 className="text-zinc-400 text-xs leading-3">Viaje vacio</h4>
            <span className={clsx("font-extrabold leading-4")}>
              {" "}
              {data?.avg_time_empty?.value
                ? `${data.avg_time_empty.value}`
                : "0"}
              min
            </span>
          </div>
          <img className="w-16 md:w-24 h-auto" src="/src/assets/truck-02.svg" />
          
        </div>
        <div className="flex items-center justify-center gap-4 font-bold flex-row ">
          <div className="flex flex-col items-center justify-center gap-1.5">
            <h4 className="text-zinc-400 text-xs leading-3">Viaje cargado</h4>
            <span className={clsx("font-extrabold leading-4")}>
              {" "}
              {data?.avg_time_transport?.value
                ? `${data.avg_time_transport.value}`
                : "0"}
              min
            </span>
          </div>
          <img className="w-16 md:w-24 h-auto" src="/src/assets/truck-03.svg" />
        </div>
        <div className="flex items-center justify-center gap-4 font-bold flex-row-reverse  ">
          <div className="flex flex-col items-center justify-center gap-1.5">
            <h4 className="text-zinc-400 text-xs leading-3">Cargando</h4>
            <span className={clsx("font-extrabold leading-4")}>
              {" "}
              {data?.avg_time_load?.value ? `${data.avg_time_load.value}` : "0"}
              min
            </span>
          </div>
          <img className="w-16 md:w-24 h-auto" src="/src/assets/truck-04.svg" loading="lazy" />
         
        </div>
        <img
            className="w-full h-[90%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20"
            src="/src/assets/lineSquare-2.svg"
          />
      </div>
    </>
  );
});

CardCycleWork.displayName = "CardCycleWork";
export default CardCycleWork;
