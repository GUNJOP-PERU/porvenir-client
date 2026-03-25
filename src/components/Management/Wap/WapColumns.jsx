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
    accessorKey: "nombre",
    header: "Nombre",
    cell: ({ row }) => {
      return (
        <>
          {row.getValue("nombre") || (
            <span className="text-zinc-400 ">... </span>
          )}
        </>
      );
    },
  },
  {
    accessorKey: "mac",
    header: "MAC AP",
    cell: ({ row }) => {
      return (
        <>
          {row.getValue("mac") || (
            <span className="text-zinc-400 ">... </span>
          )}
        </>
      );
    },
  },
  {
    accessorKey: "ip",
    header: "IP",
    cell: ({ row }) => {
      return (
        <>
          {row.getValue("ip") || (
            <span className="text-zinc-400 ">... </span>
          )}
        </>
      );
    },
  },
  {
    accessorKey: "ssid",
    header: "SSID",
    cell: ({ row }) => {
      return (
        <>
          {row.getValue("ssid") || (
            <span className="text-zinc-400 ">... </span>
          )}
        </>
      );
    },
  },
  {
    accessorKey: "location",
    header: "Ubicación",
    cell: ({ row }) => {
      return (
        <>
          {row.getValue("location") || (
            <span className="text-zinc-400 ">... </span>
          )}
        </>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Tipo",
    cell: ({ row }) => {
      return (
        <>
          {row.getValue("type") || (
            <span className="text-zinc-400 ">... </span>
          )}
        </>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Tipo",
    cell: ({ row }) => {
      return (
        <>
          {row.getValue("type") || (
            <span className="text-zinc-400 ">... </span>
          )}
        </>
      );
    },
  },
  {
    accessorKey: "active",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estado" />
    ),
    cell: ({ row }) => {
      return (
        <>
          {row.getValue("active") === true ? (
            <span className="px-2 py-0.5 bg-green-50 rounded-[6px] text-[10px] text-green-500 leading-[10px]">
              activo
            </span>
          ) : (
            <span className="px-2 py-0.5 bg-red-50 rounded-[6px] text-[10px] text-red-500 leading-[10px]">
              inactivo
            </span>
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
      <DataTableRowActions componentToShow={"wifis"} row={row} useSecondary={true} />
    ),
    enableHiding: false,
  },
];
