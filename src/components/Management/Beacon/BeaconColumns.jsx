import {
  formatFecha
} from "@/lib/utilsGeneral";
import TimeAgo from "timeago-react";
import { DataTableColumnHeader } from "../../Table/DataTableColumnHeader";
import { DataTableRowActions } from "../../Table/DataTableRowActions";

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
    accessorKey: "nombre",
    header: "Nombre",
    cell: ({ row }) => {
      return <>{row.getValue("nombre")}</>;
    },
  },
  {
    accessorKey: "mac",
    header: "MAC",
    cell: ({ row }) => {
      return <>{row.getValue("mac")}</>;
    },
  },
  {
    accessorKey: "location",
    header: "Localización",
    cell: ({ row }) => {
        return <>{row.getValue("location")}</>;
      },
  },
  {
    accessorKey: "operacion",
    header: "Operación",
    cell: ({ row }) => {
      return <>{row.getValue("operacion")}</>;
    },
  },
  {
    accessorKey: "categoria",
    header: "Categoría",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col gap-1">
          {row.getValue("categoria")}
        </div>
      );
    },
  },
  {
    accessorKey: "detectionToleranceSeconds",
    header: "Tolerancia",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col gap-1">
          {row.getValue("detectionToleranceSeconds")}
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
      <DataTableRowActions componentToShow={"beacon"} row={row} useSecondary={true} />
    ),
    enableHiding: false,
  },
];
