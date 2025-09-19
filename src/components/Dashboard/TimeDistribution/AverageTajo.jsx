import { formatDurationMinutes } from "@/lib/utilsGeneral";
import { StatusDisplay } from "../StatusDisplay";

export default function AverageTajo({ data, isLoading, isError }) {
  const parsedData = Object.entries(data).map(([key, value]) => ({
    equipment: key,
    avg: parseFloat(value),
  }));

  if (isLoading || isError || !data || Object.keys(data).length === 0) {
    return (
      <StatusDisplay
        isLoading={isLoading}
        isError={isError}
        noData={!data || Object.keys(data).length === 0}
        height="250px"
      />
    );
  }
  return (
    <div className="grid grid-cols-3 xl:grid-cols-4 gap-1 h-[250px] overflow-y-auto items-start auto-rows-min">
      {parsedData.map((item) => (
        <div
          key={item.equipment}
          className="flex flex-col bg-zinc-50 px-3 py-2 rounded-lg gap-1"
        >
          <span className="text-sky-600 leading-none font-bold text-xs">
            {formatDurationMinutes(item.avg)}
          </span>
          <span className="text-[0.6em] leading-none text-zinc-400 font-semibold">
            {item.equipment}
          </span>
        </div>
      ))}
    </div>
  );
}
