import { useMemo } from "react";
import { filterData, roundAndFormat } from "@/lib/utilsGeneral";
import TravelBars from "./TravelBars";
import { StatusDisplay } from "../StatusDisplay";

export default function CardTravels({ data, isLoading, isError }) {
  const travels = useMemo(() => {
    const travelTypes = [
      { label: "Ripio", key: "ripio", color: "#F97316" }, // naranja
      { label: "Arena", key: "arena", color: "#F4C542" }, // azul
      { label: "Lama", key: "lama", color: "#65A30D" }, // verde lima
      {
        label: "Relleno detrítico",
        key: "relleno detrítico",
        color: "#C026D3",
      }, // magenta
    ];

    return travelTypes.map(({ label, key, color }) => {
      const filtered = filterData(data, key);
      return {
        label,
        color,
        count: filtered.length,
        tonnage: filtered.reduce((sum, item) => sum + (item.tonnage || 0), 0),
      };
    });
  }, [data]);

  if (isLoading || isError || !data || data.length === 0)
    return (
      <StatusDisplay
        isLoading={isLoading}
        isError={isError}
        noData={!data || data.length === 0}
      />
    );
  return (
    <>
      <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
        {travels.map(({ label, count, tonnage, color }) => (
          <div
            key={label}
            className="flex flex-col bg-zinc-50 px-4 py-2 rounded-lg"
          >
            <span className="text-[10px] text-zinc-400">{label}</span>
            <b
              className="leading-none font-extrabold text-xl"
              style={{ color }}
            >
              {count} <small>viajes</small>
            </b>
            <span className="mt-1 text-[12px] leading-none text-zinc-500 font-bold">
              {roundAndFormat(tonnage)} <small>TM</small>
            </span>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-2">
        <TravelBars data={data} filterKeywords={["TJ"]} colorPoint="#7cb5ec" />
        <TravelBars
          data={data}
          filterKeywords={["CX", "GA", "BP"]}
          colorPoint="#9B9B9B"
        />
      </div>
    </>
  );
}
