import { formatFecha } from "@/lib/utilsGeneral";
import { DataTableColumnHeader } from "../../Table/DataTableColumnHeader";
import { DataTableRowActions } from "../../Table/DataTableRowActions";
import clsx from "clsx";
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
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nombre" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center space-x-2">
          <div>
            <div
            className={clsx(
              "w-8 h-8 rounded-[10px]  flex items-center justify-center text-zinc-50 font-bold leading-none",
              row.original?.cargo === "Supervisor Truck"
                ? "bg-cyan-500"
                : row.original?.cargo === "Supervisor Scoop"
                ? "bg-orange-500"
                : row.original?.cargo === "Operador Truck"
                ? "bg-blue-500"
                : row.original?.cargo === "Operador Scoop"
                ? "bg-red-500"
                : row.original?.cargo === "Admin"
                ? "bg-purple-500"
                : "bg-gray-500" 
            )}>
                {row.getValue("name")?.split(' ')?.slice(0, 2)?.map(pl => pl.charAt(0)?.toUpperCase())?.join('')}
            </div>
          </div>
          <div className="flex flex-col justify-center gap-0.5">
            <h4 className="text-[12.5px] font-semibold leading-4 flex capitalize">
              {row.getValue("name")}
            </h4>
            <span className="text-[11px] leading-3 text-zinc-400 md:inline lowercase">
              {row.original.cargo || ""}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "code",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Usuario" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.original.code || ""}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Accesos Web" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span
            className={clsx(
              "relative text-[10px] py-[1px] px-2 rounded-[8px] before:content-[''] before:absolute before:w-1 before:h-1 before:rounded-full before:left-[8px] before:top-1/2 before:-translate-y-1/2 pl-4",
              row.original?.type === "view"
                ? "text-blue-500 bg-blue-50 before:bg-blue-500"
                : row.original?.type === "edit"
                ? "text-yellow-500 bg-yellow-50 before:bg-yellow-500"
                : row.original?.type === "plan-editor"
                ? "text-orange-500 bg-orange-50 before:bg-orange-500"
                : row.original?.type === "admin"
                ? "text-purple-500 bg-purple-50 before:bg-purple-500"
                : "text-gray-500 bg-gray-50 before:bg-gray-500" 
            )}
          >
            {row.getValue("type") === "admin"
              ? "Administrador"
              : row.getValue("type") === "edit"
              ? "Edición"
              : row.getValue("type") === "view"
              ? "Solo Lectura"
              : row.getValue("type") === "plan-editor"
              ? "Planeador"
              : "Ninguno"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "cargo",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cargo" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span
            className={clsx(
              "relative text-[10px] py-[1px] px-2 rounded-[8px] before:content-[''] before:absolute before:w-1 before:h-1 before:rounded-full before:left-[8px] before:top-1/2 before:-translate-y-1/2 pl-4",
              row.original?.cargo === "Supervisor Truck"
              ? "text-cyan-500 bg-cyan-50 before:bg-cyan-500"
                : row.original?.cargo === "Supervisor Scoop"
                ? "text-orange-500 bg-orange-50 before:bg-orange-500"
                : row.original?.cargo === "Operador Truck"
                ? "text-blue-500 bg-blue-50 before:bg-blue-500"
                : row.original?.cargo === "Operador Scoop"
                ? "text-red-500 bg-red-50 before:bg-red-500"
                : row.original?.cargo === "Admin"
                ? "text-purple-500 bg-purple-50 before:bg-purple-500"
                : "text-gray-500 bg-gray-50 before:bg-gray-500" 
            )}
          >
            {row.getValue("cargo")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "isActive",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estado" />
    ),
    cell: ({ row }) => {
      return (
        <>
          {row.getValue("isActive") === true ? (
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
        <div className="flex items-center gap-2">
          <div className="flex flex-col justify-center">
            <h4 className="text-[12.5px] font-semibold leading-4">
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
      <DataTableRowActions componentToShow={"user"} row={row} />
    ),
    enableHiding: false,
  },
];
