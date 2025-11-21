import IconDay from "@/icons/IconDay";
import IconNight from "@/icons/IconNight";
import {
  formatDurationMinutes,
  formatFecha,
  formatHour,
} from "@/lib/utilsGeneral";
import clsx from "clsx";
import TimeAgo from "timeago-react";

import { CircleCheckBig, CircleOff } from "lucide-react";
import { DataTableColumnHeader } from "../../Table/DataTableColumnHeader";
import IconMineral from "@/icons/IconMineral";
import IconClearance from "@/icons/IconClearance";
import { DataTableRowActions } from "@/components/Table/DataTableRowActions";

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
    accessorKey: "usuario",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Usuario" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center space-x-2">
          <div>
            <div
              className={clsx(
                "w-8 h-8 rounded-[10px]  flex items-center justify-center text-zinc-50 font-bold leading-none",
                row.original?.user.cargo === "Supervisor Truck"
                  ? "bg-cyan-500"
                  : row.original?.user.cargo === "Supervisor Scoop"
                  ? "bg-orange-500"
                  : row.original?.user.cargo === "Operador Truck"
                  ? "bg-blue-500"
                  : row.original?.user.cargo === "Operador Scoop"
                  ? "bg-red-500"
                  : row.original?.user.cargo === "Admin"
                  ? "bg-purple-500"
                  : "bg-gray-500"
              )}
            >
              {row.original.user.name
                ?.split(" ")
                ?.slice(0, 2)
                ?.map((pl) => pl.charAt(0)?.toUpperCase())
                ?.join("")}
            </div>
          </div>
          <div className="flex flex-col justify-center gap-0.5">
            <h4 className="text-[12.5px] font-semibold leading-4 flex capitalize">
              {row.original.user.name}
            </h4>
            <span className="text-[11px] leading-3 text-zinc-400 md:inline lowercase">
              {row.original.user.cargo || ""}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "tableName",
    header: "Tabla Afectada",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col justify-center">
          <h4 className="text-[12.5px] font-semibold leading-4 flex capitalize">
            {row.original.tableName}
          </h4>
          <span className="text-[11px] leading-3 text-zinc-400 md:inline lowercase">
            {row.original.field_modified} {row.original.field_modified > 1 ? "campos modificados" : "campo modificado"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "action",
    header: "Tipo de Cambio",
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span
            className={clsx(
              "relative text-[10px] leading-none font-semibold py-1 pl-4 pr-2  rounded-[5px] before:content-[''] before:absolute before:w-1 before:h-1 before:rounded-full before:left-[8px] before:top-1/2 before:-translate-y-1/2 ",
              row.original?.action === "CREATE"
                ? "text-green-600 bg-green-50 before:bg-green-500"
                : row.original?.action === "UPDATE"
                ? "text-orange-600 bg-orange-50 before:bg-orange-500"
                : row.original?.action === "DELETE"
                ? "text-red-600 bg-red-50 before:bg-red-500"
                : "text-gray-600 bg-gray-50 before:bg-gray-500"
            )}
          >
            {row.getValue("action")}
          </span>
        </div>
      );
    },
  },

  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fecha creación" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex flex-col justify-center">
           <h4 className="text-[12.5px] font-semibold leading-4">
           <TimeAgo datetime={row.original.updatedAt} locale="es" />
          </h4>
          <span className="text-[11px] leading-3 text-zinc-400 md:inline lowercase">
            fecha de actualización
          </span>
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
        <div className="flex flex-col justify-center">
          <h4 className="text-[12.5px] font-semibold leading-4 flex capitalize">
            {formatFecha(row.original.createdAt)}
          </h4>
          <span className="text-[11px] leading-3 text-zinc-400 md:inline lowercase">
            fecha de creación
          </span>
        </div>
      );
    },
  },
];
