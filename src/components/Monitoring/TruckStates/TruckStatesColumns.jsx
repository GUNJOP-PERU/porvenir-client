import { Truck, Circle, CircleOff } from "lucide-react";

// Helper para formatear fecha como en el ejemplo del usuario: (24-03-26, 8:34:00 p. m.)
const formatDateTime = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";

  return date.toLocaleString("es-CL", {
    dateStyle: "short",
    timeStyle: "medium",
  });
};

export const columns = [
  {
    accessorKey: "tag",
    header: "Tag",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2 font-medium">
          <Truck className="size-4 text-zinc-400" />
          <span className="truncate">
          {row.original?.tag || row.original?.unitId}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Estatus",
    cell: ({ row }) => {
      const status = String(row.original?.status || "offline").toLowerCase();
      const isOnline = status === "online";
      return (
        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold w-fit ${
          isOnline ? "bg-green-100 text-green-700" : "bg-zinc-100 text-zinc-600"
        }`}>
          {isOnline ? (
            <Circle className="size-3 fill-current" />
          ) : (
            <CircleOff className="size-3" />
          )}
          <span className="capitalize">{status}</span>
        </div>
      );
    },
  },

  {
    accessorKey: "currentLocationName",
    header: "Ubicación actual",
    cell: ({ row }) => {
      const locationName = row.original?.currentLocationName;
      
      if (!locationName || locationName === "—") {
        return <span className="text-zinc-400">—</span>;
      }

      return (
        <span className="font-semibold text-zinc-700">
          {locationName}
        </span>
      );
    },
  },
  {
    accessorKey: "previousLocationName",
    header: "Ubicación anterior",
    cell: ({ row }) => {
      const locationName = row.original?.previousLocationName;
      const date = row.original?.previousEndDate || row.original?.updatedAt || row.original?.createdAt;

      if (!locationName || locationName === "—") {
        return <span className="text-zinc-400">—</span>;
      }

      return (
        <div className="flex items-baseline gap-1.5 flex-wrap">
          <span className="font-medium text-zinc-600">
            {locationName}
          </span>
          {date && (
            <span className="text-[10px] text-zinc-400 whitespace-nowrap">
              ({formatDateTime(date)})
            </span>
          )}
        </div>
      );
    },
  },
 
];
