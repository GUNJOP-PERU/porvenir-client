import { useFetchData } from "@/hooks/useGlobalQueryV2";
import IconTruck from "@/icons/IconTruck";
import { ubicationDataSub } from "@/pages/beaconRT/UbicationLocation";
import type { BeaconTruckStatus } from "@/types/Beacon";
import clsx from "clsx";
import { useCallback, useMemo } from "react";

type Plan = {
  phase: string; // "mineral" o "desmonte"
  volquetes: string[];
  tonnage: number;
  shift: string;
  state: string;
  _id: string;
};

export default function Legend({ data = [] }: { data: BeaconTruckStatus[] }) {
  const { data: planData = [] } = useFetchData<Plan[]>(
    "plan-extract-realtime",
    "planDay/byDay",
    { refetchInterval: 10000 }
  );

  const counts = useMemo(() => {
    const operativos = data.filter(
      (truck) => truck.status?.toLowerCase() === "operativo"
    );
    return operativos.length;
  }, [data]);

  // const counts =35;

  const planSummary = useMemo(() => {
    let total = 0;
    let mineral = 0;
    let desmonte = 0;

    for (const plan of planData) {
      const cantidad = plan.volquetes?.length || 0;
      total += cantidad;
      if (plan.phase?.toLowerCase() === "mineral") mineral += cantidad;
      else if (plan.phase?.toLowerCase() === "desmonte") desmonte += cantidad;
    }

    const mineralPercent = total
      ? parseFloat(((mineral / total) * 100).toFixed(1))
      : 0;
    const desmontePercent = total
      ? parseFloat(((desmonte / total) * 100).toFixed(1))
      : 0;

    return {
      total,
      mineral,
      desmonte,
      mineralPercent,
      desmontePercent,
    };
  }, [planData]);

  return (
    <div className="absolute top-2 right-2 z-10 select-none flex flex-col justify-end gap-1">
        {/* <div
            className={clsx(
              "flex flex-col items-center justify-center gap-[2px] leading-none w-14 h-14 rounded-xl  transition-colors duration-300",
              counts === 0
                ? "bg-zinc-500 text-black" // plomo
                : counts >= 38
                ? "bg-green-600 text-black" // verde
                : counts >= 36 && counts <= 37
                ? "bg-yellow-500 text-black" // amarillo
                : "bg-rose-500 text-white animate-pulse duration-1000 border-2 border-rose-400" // rojo
            )}
          >
            <span className="text-[7.5px] font-bold leading-none mt-1">
              TOTAL
            </span>
            <span className="font-black text-3xl leading-none text-center">
              {counts}
            </span>
            <div className="flex flex-col gap-0.5 min-w-0">
              <IconTruck className="h-7 w-11" color="#1dd3b0" />
            </div>
          </div> */}
        <div
          className={clsx(
            "rounded-xl py-1 px-1 flex items-center gap-2",
            counts === 0
              ? "bg-zinc-500 text-black" // plomo
              : counts >= 38
              ? "bg-[#16a34a] text-black" // verde
              : counts >= 36 && counts <= 37
              ? "bg-[#ca8a04] text-black" // amarillo
              : "bg-[#ee3232] text-white animate-pulse duration-1000 " // rojo
          )}
        >
          <div className="w-14 h-14 overflow-hidden bg-black/20 rounded-lg flex flex-col items-center justify-center font-extrabold text-white gap-[1px]">
            <span className="text-[7px] leading-none font-extrabold text-zinc-50/80">
              TOTAL
            </span>
            <span className="text-3xl font-extrabold leading-none">
              {counts}
            </span>
          </div>
          <div className="flex flex-col gap-0.5 min-w-0 pr-2">
            <IconTruck
              className="h-12 w-18"
              color={
                counts === 0
                  ? "#1dd3b0" // plomo
                  : counts >= 38
                  ? "#46fea5d4" // verde
                  : counts >= 36 && counts <= 37
                  ? "#ecba03" // amarillo
                  : "#ff9592" // rojo
              }
            />
          </div>
        </div>

        <div className="flex flex-col items-center w-full bg-black/70 px-2 py-2 rounded-lg">
          <div className="flex justify-between w-full text-[9px] font-bold text-zinc-300 mb-1">
            <span>MINERAL</span>
            <span>DESMONTE</span>
          </div>

          <div className="relative w-full h-2 bg-zinc-600 rounded-[4px] overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-[#1dd3b0]"
              style={{
                width: `${
                  planSummary?.mineralPercent > 0
                    ? planSummary.mineralPercent
                    : 100
                }%`,
              }}
            ></div>
            <div
              className="absolute left-0 top-0 h-full bg-[#daa588]"
              style={{
                width: `${planSummary.desmontePercent || 0}%`,
                left: `${planSummary.mineralPercent || 100}%`,
              }}
            ></div>
          </div>

          <div className="flex justify-between w-full text-xs font-bold mt-1">
            <span className="text-[#1dd3b0]">
              {counts} | {planSummary.mineralPercent || 100}%
            </span>
            <span className="text-[#daa588]">
              {planSummary.desmonte} | {planSummary.desmontePercent || 0}%
            </span>
          </div>
        </div>
    </div>
  );
}
