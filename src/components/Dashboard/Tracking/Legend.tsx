import { ubicationDataSub } from "@/pages/beaconRT/UbicationLocation";
import type { BeaconTruckStatus } from "@/types/Beacon";

export default function Legend({ data = [] }: { data: BeaconTruckStatus[] }) {
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

    let key: keyof typeof counts | null = null;

    if (status.includes("inoperativo")) key = "correctivo";
    else if (status.includes("mantenimiento")) key = "mantenimiento";
    else if (isSub) key = "subterraneo";
    else key = "superficie";

    if (key) {
      counts[key].total += 1;
      if (connectivity === "online") counts[key].online += 1;
      else if (connectivity === "offline") counts[key].offline += 1;
    }
  });

  const tipos = [
    {
      key: "superficie",
      title: "SUPERFICIE",
      color: "#22C55E",
      showPercent: true,
    },
    {
      key: "subterraneo",
      title: "MINA",
      color: "#dbdbdb",
      showPercent: false,
    },
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

  return (
    <div className="absolute top-8 right-2 z-10 select-none flex flex-col justify-end gap-0.5">
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
              <span className="font-extrabold text-[10px] leading-none text-center line-clamp-2">
                {t.title}{" "}
              </span>
              <span className="font-extrabold text-base leading-none text-center">
                {total} CAM
              </span>
              {t.showPercent && (
                <div className="absolute -top-4 text-xs font-extrabold bg-green-900 text-green-300 px-2 py-0.5 rounded-2xl left-1/2 -translate-x-1/2">
                  {percent}%
                </div>
              )}
            </div>
            {/* <div className="flex gap-1 text-[12px]">
                <div className="flex items-center gap-0.5 text-[#a98467] leading-none">
                  <IconMineral className="size-3" /> {item.online}
                </div>
                <div className="flex items-center gap-0.5 text-[#a98467] leading-none">
                  <IconClearance className="size-3 fill-[#a98467]" />{" "}
                  {item.offline}
                </div>
              </div> */}
          </div>
        );
      })}
    </div>
  );
}
