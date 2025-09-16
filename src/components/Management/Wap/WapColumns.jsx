import { formatFecha } from "@/lib/utilsGeneral";
import { DataTableColumnHeader } from "../../Table/DataTableColumnHeader";
import { DataTableRowActions } from "../../Table/DataTableRowActions";
import TimeAgo from "timeago-react";

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
    accessorKey: "name",
    header: "Nombre",
    cell: ({ row }) => {
      return (
        <>
          {row.getValue("name") || (
            <span className="text-zinc-400 ">... </span>
          )}
        </>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Descripción",
    cell: ({ row }) => {
      return (
        <>
          {row.getValue("description") || (
            <span className="text-zinc-400 ">... </span>
          )}
        </>
      );
    },
  },
  {
    accessorKey: "mac_ap",
    header: "MAC AP",
    cell: ({ row }) => {
      return (
        <>
          {row.getValue("mac_ap") || (
            <span className="text-zinc-400 ">... </span>
          )}
        </>
      );
    },
  },
  {
    accessorKey: "category",
    header: "Categoria",
    cell: ({ row }) => {
      return (
        <>
          {row.getValue("category") || (
            <span className="text-zinc-400 ">... </span>
          )}
        </>
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
      <DataTableColumnHeader column={column} title="Feccha de creación" />
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
  {
    id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions componentToShow={"wap"} row={row} />
    ),
    enableHiding: false,
  },
];
