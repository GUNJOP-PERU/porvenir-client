import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Clock } from "lucide-react";
import { formatDurationHour } from "@/lib/utilsGeneral";

export const columns = [
  {
    accessorKey: "unitId",
    header: "Unit ID",
    cell: ({ getValue }) => (
      <div className="font-semibold text-zinc-900 text-xs text-nowrap">
        {getValue() || "—"}
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: "Nombre",
    cell: ({ getValue }) => (
      <div className="font-medium text-zinc-700 text-xs">{getValue() || "—"}</div>
    ),
  },
  {
    accessorKey: "operacion",
    header: "Operación",
    cell: ({ getValue }) => (
      <div className="text-zinc-500 text-[11px] font-medium">{getValue() || "—"}</div>
    ),
  },
  {
    accessorKey: "firstSeen",
    header: "Primera",
    cell: ({ getValue }) => {
      const val = getValue();
      if (!val) return "—";
      return (
        <div className="text-[11px] text-zinc-500 text-nowrap">
          {format(new Date(val), "dd-MM-yy, h:mm:ss b.", { locale: es })}
        </div>
      );
    },
  },
  {
    accessorKey: "lastSeen",
    header: "Última",
    cell: ({ getValue }) => {
      const val = getValue();
      if (!val) return "—";
      return (
        <div className="text-[11px] text-zinc-500 text-nowrap">
          {format(new Date(val), "dd-MM-yy, h:mm:ss b.", { locale: es })}
        </div>
      );
    },
  },
  {
    accessorKey: "durationMs",
    header: "Duración",
    cell: ({ getValue }) => {
      const ms = getValue();
      if (!ms) return "—";
      const seconds = Math.floor(ms / 1000);
      const text = formatDurationHour(seconds);

      return (
        <div className="flex items-center gap-1.5 font-medium text-[11px] text-nowrap">
          <Clock className="h-3 w-3 text-zinc-400" strokeWidth={2.5} />
          <span>{text}</span>
        </div>
      );
    },
  },
];
