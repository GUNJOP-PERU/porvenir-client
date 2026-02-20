import { formatFecha } from "@/lib/utilsGeneral";
import TimeAgo from "timeago-react";
import { DataTableColumnHeader } from "../../Table/DataTableColumnHeader";
import { DataTableRowActions } from "../../Table/DataTableRowActions";
import { getSoftColor } from "@/utils/tracking";

export const columns = [
  {
    accessorKey: "id",
    header: "#",
    cell: ({ row }) => (
      <div className="text-zinc-400 text-[10px]">#{row.index + 1}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "mac",
    header: "MAC",
    cell: ({ row }) => {
      return (
        <span className="font-mono text-[13px] text-sky-700 font-medium tracking-tight">
          {row.getValue("mac") || "00:00:00:00:00:00"}
        </span>
      );
    },
  },

  {
    accessorKey: "type",
    header: "Tipo",
    cell: ({ row }) => {
      return <>{row.getValue("type")}</>;
    },
  },
  {
    accessorKey: "ubicationType",
    header: "Tipo Ubicación",
    cell: ({ row }) => {
      return <>{row.getValue("ubicationType")}</>;
    },
  },

  {
    accessorKey: "ubication",
    header: "Ubicación",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col gap-1">{row.getValue("ubication")}</div>
      );
    },
  },
  {
    accessorKey: "location",
    header: "Localización",
    cell: ({ row }) => {
      const loc = row.getValue("location");
      const colors = getSoftColor(loc);

      return (
        <div className="">
          <span
            style={loc ? colors : {}}
            className={`text-[10px] font-bold uppercase px-2 py-[3px] rounded-[8px] border ${!loc && "bg-zinc-50 text-zinc-400 border-zinc-200 italic"}`}
          >
            {loc || "Sin asignar"}
          </span>
        </div>
      );
    },
  },

  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fecha actualización" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          {/* <IconTime className="h-5 w-5 text-custom-600" /> */}
          <div className="flex flex-col justify-center">
            <h4 className="text-[12.5px] font-semibold leading-4 flex">
              <TimeAgo datetime={row.original.updatedAt} locale="es" />
            </h4>
            <span className="text-[11px] leading-3 text-zinc-400 md:inline lowercase">
              fecha de actualización
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fecha creación" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          {/* <IconTime className="h-5 w-5 text-custom-600" /> */}
          <div className="flex flex-col justify-center">
            <h4 className="text-[12.5px] font-semibold leading-4 flex capitalize">
              {formatFecha(row.original.createdAt)}
            </h4>
            <span className="text-[11px] leading-3 text-zinc-400 md:inline lowercase">
              fecha de creación
            </span>
          </div>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions componentToShow={"beacon"} row={row} />
    ),
    enableHiding: false,
  },
];
