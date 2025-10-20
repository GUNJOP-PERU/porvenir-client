import { useFetchData } from "@/hooks/useGlobalQueryV2";
import { ubicationDataSub } from "@/pages/beaconRT/UbicationLocation";
import type { BeaconTruckStatus } from "@/types/Beacon";
import { useMemo } from "react";

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
    { refetchInterval: 2000 }
  );

  const subterraneoMacs = ubicationDataSub.map((u) => u.mac.toLowerCase());
  const counts = {
    superficie: { total: 0, online: 0, offline: 0 },
    subterraneo: { total: 0, online: 0, offline: 0 },
    mantenimiento: { total: 0, online: 0, offline: 0 },
    correctivo: { total: 0, online: 0, offline: 0 },
  };

  data.forEach((truck) => {
    const mac = truck.lastUbicationMac?.toLowerCase() ?? "";
    const isSub = subterraneoMacs.includes(mac);
    const status = truck.status?.toLowerCase() ?? "";
    const connectivity = truck.connectivity?.toLowerCase() ?? "";

    let key: keyof typeof counts;
    if (status.includes("inoperativo")) key = "correctivo";
    else if (status.includes("mantenimiento")) key = "mantenimiento";
    else if (isSub) key = "subterraneo";
    else key = "superficie";

    counts[key].total += 1;
    if (connectivity === "online") counts[key].online += 1;
    else if (connectivity === "offline") counts[key].offline += 1;
  });

  const tipos = [
    {
      key: "superficie",
      title: "SUPERFICIE",
      color: "#22C55E",
      showPercent: true,
    },
    { key: "subterraneo", title: "MINA", color: "#dbdbdb", showPercent: false },
    {
      key: "mantenimiento",
      title: "MANTTO PREVENTIVO",
      color: "#ff758f",
      showPercent: false,
    },
    {
      key: "correctivo",
      title: "MANTO CORRECTIVO",
      color: "#EF4444",
      showPercent: false,
    },
  ] as const;

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
    <div className="absolute top-8 right-2 z-10 select-none flex flex-col justify-end gap-1">
      {tipos.map((t) => {
        const item = counts[t.key];
        const total = item.total;
        const percent = ((total / 44) * 100).toFixed(2);

        return (
          <div key={t.key} className="flex flex-col items-end">
            <div
              className="flex flex-col items-center justify-center gap-0.5 rounded-2xl px-3 py-2 relative shadow-lg"
              style={{ backgroundColor: t.color }}
            >
              <span className="font-extrabold text-[10px] leading-none text-center">
                {t.title}
              </span>
              <span className="font-extrabold text-md leading-none text-center">
                {total} CAM
              </span>
              {t.showPercent && (
                <div className="absolute -top-4 text-xs font-extrabold bg-green-900 text-green-300 px-2 py-0.5 rounded-2xl left-1/2 -translate-x-1/2">
                  {percent}%
                </div>
              )}
            </div>
          </div>
        );
      })}

      <div className="bg-black/80 border border-zinc-700 rounded-xl px-2 py-2 text-zinc-200 flex flex-col items-center mt-2">
        {/* <span className="font-bold text-[11px] text-green-400">PLAN</span> */}
        <div className="flex items-center gap-2 text-[10px] leading-tight">
          <div className="flex flex-col items-center justify-center gap-[1px] leading-none w-12 h-12 bg-red-900 rounded-xl">
            <span className="text-[8px] font-semibold leading-none text-zinc-300">
              TOTAL
            </span>
            <span className=" text-white font-extrabold text-2xl leading-none text-center">
              {planSummary.total}
            </span>
          </div>
          <div className="flex flex-col gap-2 leading-none">
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-semibold text-zinc-300">
                MINERAL
              </span>
              <span className="font-bold text-[#1dd3b0] text-base leading-none">
                {planSummary.mineral} | {planSummary.mineralPercent}%
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-semibold text-zinc-300">
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
