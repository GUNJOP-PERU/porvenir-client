import {
  formatDurationHour,
  formatFecha,
  formatHour,
} from "@/lib/utilsGeneral";
import { DataTableColumnHeader } from "../Table/DataTableColumnHeader";
import IconDay from "@/icons/IconDay";
import IconNight from "@/icons/IconNight";
import clsx from "clsx";
import IconMineral from "@/icons/IconMineral";
import IconClearance from "@/icons/IconClearance";
import TimeAgo from "timeago-react";
import { DataTableRowActions } from "../Table/DataTableRowActions";

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
      return <>{row.getValue("mac")}</>;
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
        <div className="flex flex-col gap-1">
          {row.getValue("ubication")}
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
