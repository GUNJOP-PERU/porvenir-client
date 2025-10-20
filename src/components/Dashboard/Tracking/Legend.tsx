import { useFetchData } from "@/hooks/useGlobalQueryV2";
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

    const mineralPercent = total ? ((mineral / total) * 100).toFixed(1) : "0";
    const desmontePercent = total ? ((desmonte / total) * 100).toFixed(1) : "0";

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
      <div className="bg-black/80 border border-zinc-700 rounded-xl px-2 py-2 text-zinc-200 flex flex-col items-center ">
        <div className="flex items-center gap-2 text-[10px] leading-tight">
          <div
            className={clsx(
              "flex flex-col items-center justify-center gap-[1px] leading-none w-12 h-12 rounded-xl  transition-colors duration-300",
              counts === 0
                ? "bg-zinc-500 text-black" // plomo
                : counts >= 38
                ? "bg-green-600 text-black" // verde
                : counts >= 36 && counts <= 37
                ? "bg-yellow-500 text-black" // amarillo
                : "bg-red-600 text-white animate-pulse" // rojo
            )}
          >
            <span className="text-[8px] font-bold leading-none ">
              TOTAL
            </span>
            <span className="font-black text-2xl leading-none text-center">
              {counts}
            </span>
          </div>

          <div className="flex flex-col gap-2 leading-none">
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-bold text-zinc-300">
                MINERAL
              </span>
              <span className="font-bold text-[#1dd3b0] text-base leading-none">
                {/* {planSummary.mineral} | {planSummary.mineralPercent}% */}
               {counts} |  100%
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-bold text-zinc-300">
                DESMONTE
              </span>
              <span className="font-bold text-[#daa588] text-base leading-none">
                {planSummary.desmonte} | {planSummary.desmontePercent}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
