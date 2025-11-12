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
    accessorKey: "unit",
    header: "Unidad",
    cell: ({ row }) => {
      return (
        <div className="flex items-center space-x-2">
          <h4 className="text-[13px] font-bold leading-none capitalize text-blue-500">
            CAM {row.original.unit.split("-").pop()}
          </h4>
        </div>
      );
    },
  },
  {
    accessorKey: "location",
    header: "Ubicación",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col gap-1">{row.original?.location}</div>
      );
    },
  },

  {
    accessorKey: "startDate",
    header: "Inicio",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col gap-1 text-zinc-600">
          <span className="max-w-[500px] truncate uppercase font-bold leading-3">
            {formatFecha(row.original?.startDate)}
          </span>
          <span className="max-w-[500px] truncate font-medium leading-3 text-zinc-400">
            {row.original?.startUbication}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "endDate",
    header: "Destino",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col gap-1 text-zinc-600">
          <span className="max-w-[500px] truncate uppercase font-bold leading-3">
            {formatFecha(row.original?.endDate)}
          </span>
          <span className="max-w-[500px] truncate font-medium leading-3 text-zinc-400">
            {row.original?.endUbication}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "totalDurationMin",
    header: "Duración",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col gap-1">
          {formatDurationMinutes(row.original?.totalDurationMin)}
        </div>
      );
    },
  },
  {
    accessorKey: "shift",
    header: "Turno",
    cell: ({ row }) => {
      return (
        <>
          {row.getValue("shift") === "dia" ? (
            <IconDay className="h-5 w-5 fill-orange-400" />
          ) : (
            <IconNight className="h-5 w-5 fill-sky-400" />
          )}
        </>
      );
    },
  },
  {
    accessorKey: "tripType",
    header: "Material",
    cell: ({ row }) => {
      return (
        <>
          {row.getValue("tripType") === "Mineral" ? (
            <IconMineral className="h-5 w-5 fill-[#14B8A6]" />
          ) : (
            <IconClearance className="h-5 w-5 fill-[#a46424]" />
          )}
        </>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions componentToShow={"trip"} row={row} />
    ),
    enableHiding: false,
  },
];
