import { formatDurationMinutes } from "@/lib/utilsGeneral";

export default function AverageTajo({ data, isLoading, isError }) {
  const parsedData = Object.entries(data).map(([key, value]) => ({
    equipment: key,
    avg: parseFloat(value),
  }));

  if (isLoading)
    return (
      <div className="bg-zinc-200 rounded-2xl h-[280px] w-full animate-pulse"></div>
    );
  if (isError)
    return (
      <div className="flex items-center justify-center h-[280px] w-full ">
        <span className="text-[10px] text-red-500">Ocurrió un error</span>
      </div>
    );
  return (
    <div className="grid grid-cols-4 gap-2 py-2">
      {parsedData.map((item) => (
        <div key={item.equipment} className="flex flex-col justify-between items-center bg-zinc-50 px-4 py-2 rounded-lg pr-3 gap-2">
          <span className="text-xs leading-none text-zinc-400 font-bold">{item.equipment}</span>
          <span className="text-sky-600 leading-none font-extrabold text-md">{formatDurationMinutes(item.avg)}</span>
        </div>
      ))}
    </div>
  );
}
