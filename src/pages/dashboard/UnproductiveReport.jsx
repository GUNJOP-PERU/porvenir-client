import { useState } from "react";
import { useFetchGraphicData } from "@/hooks/useGraphicData";

export default function UnproductiveReport() {
  const [date, setDate] = useState(new Date());
  const [shift, setShift] = useState("D");

  const toInputDate = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const range = getShiftRangeMs(date, shift);
  const {
    data = [],
    isFetching,
    isLoading,
    isError,
  } = useFetchGraphicData({
    queryKey: "production-extract",
    endpoint: "cycle/by-date-range",
    filters: range ? `startDate=${range.startMs}&endDate=${range.endMs}` : "",
  });


  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-bold leading-none">
          Reporte de Inproductivos Semanal{" "}
          <small className="text-zinc-400">
            (Viajes de remanejo no considerados)
          </small>
        </h1>
        <div>
          <input
            type="date"
            value={toInputDate(date)}
            onChange={(e) => setDate(new Date(`${e.target.value}T00:00:00`))}
            className="border p-2 text-xs h-6"
            disabled={isLoading}
          />
          <select
            value={shift}
            onChange={(e) => setShift(e.target.value)}
            disabled={isLoading}
            className="border text-xs h-6"
          >
            <option value="D">Semana 20</option>
            <option value="N">Semana 21</option>
            <option value="N">Semana 22</option>
            <option value="N">Semana 23</option>
            <option value="N">Semana 24</option>
          </select>

          <button onClick={() => refetch()} className="border p-2 text-xs h-6">
            Refetch
          </button>
        </div>
      </div>
    </>
  );
}
