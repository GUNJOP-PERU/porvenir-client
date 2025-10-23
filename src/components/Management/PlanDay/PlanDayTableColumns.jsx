import { formatFecha, roundAndFormat } from "@/lib/utilsGeneral";
import { DataTableColumnHeader } from "../../Table/DataTableColumnHeader";
import { DataTableRowActions } from "../../Table/DataTableRowActions";
import IconDay from "@/icons/IconDay";
import IconNight from "@/icons/IconNight";
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
    accessorKey: "frontLabor",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nombre" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex flex-col justify-center gap-0.5">
          <h4 className="text-[12.5px] font-semibold leading-4 flex capitalize">
            {row.getValue("frontLabor")}
          </h4>
          <span className="text-[11px] leading-3 text-zinc-400 md:inline ">
            {row.original?.phase || ""} / {row.original?.day || ""}/{row.original?.month || ""}/{row.original?.year || ""}
          </span>
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
    accessorKey: "state",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estado" />
    ),
    cell: ({ row }) => {
      return (
        <>
          {row.getValue("state") === "close" ? (
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
    accessorKey: "phase",
    header: "Tonelaje",
    cell: ({ row }) => {
      return <>{roundAndFormat(row.original.tonnage || 0)} TN</>;
    },
  },
  {
    accessorKey: "nro_volquetes",
    header: "#Volquete",
    cell: ({ row }) => {
      return <>{row.getValue("nro_volquetes")} und</>;
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
      <DataTableRowActions componentToShow={"planDay"} row={row} />
    ),
    enableHiding: false,
  },
];
