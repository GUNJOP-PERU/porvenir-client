import {
  formatDurationHour,
  formatFecha,
  formatHour,
  useRelativeTime,
} from "@/lib/utilsGeneral";
import { DataTableColumnHeader } from "../data-table-column-header";
import { DataTableRowActions } from "../data-table-row-actions";
import clsx from "clsx";
import IconDay from "@/icons/IconDay";
import IconNight from "@/icons/IconNight";
import IconMineral from "@/icons/IconMineral";
import IconClearance from "@/icons/IconClearance";

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
    accessorKey: "user",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nombre" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-[10px] bg-cover bg-center flex items-center justify-center bg-[url('/src/assets/vehicle/truck.png')]"></div>
          <div className="flex flex-col justify-center gap-0.5">
            <h4 className="text-[12.5px] font-semibold leading-4 flex capitalize">
              {row.getValue("user")}
            </h4>
            <span className="text-[11px] leading-3 text-zinc-400 md:inline ">
              {row.original?.tagName}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "frontLabor",
    header: "Labor",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col gap-1 text-xs">
           <span className="max-w-[500px] truncate font-medium leading-3">
            <strong>Origen: </strong> {row.getValue("frontLabor")}
          </span>
           <span className="max-w-[500px] truncate font-medium leading-3">
           <strong> Destino:</strong>  {row.original?.destiny}
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
    accessorKey: "tagName",
    header: "Tonelaje",
    cell: ({ row }) => {
      return <>{row.original.tonnage} TN</>;
    },
  },
  {
    accessorKey: "material",
    header: "Material",
    cell: ({ row }) => {
      return (
        <>
          {row.getValue("material") === "Mineral" ? (
            <IconMineral className="h-5 w-5 fill-[#14B8A6]" />
          ) : (
            <IconClearance className="h-5 w-5 fill-[#a46424]" />
          )}
        </>
      );
    },
  },
  {
    accessorKey: "start",
    header: "Tiempo Viaje",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col gap-1">
          <span className="max-w-[500px] truncate font-medium leading-3">
            Inicio: {formatHour(row.original?.start)}
          </span>
          <span className="max-w-[500px] truncate font-medium leading-3">
            Fin: {formatHour(row.original?.end)}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "duration",
    header: "Duración",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col gap-1">
          {formatDurationHour(row.original?.duration)}
        </div>
      );
    },
  },
  {
    accessorKey: "isNewLabor",
    header: "Estado/Labor",
    cell: ({ row }) => {
      return (
        <span
          className={clsx(
            "relative text-[10px] py-[2px] px-2 rounded-[8px] before:content-[''] before:absolute before:w-1 before:h-1 before:rounded-full before:left-[5px] before:top-1/2 before:-translate-y-1/2 pl-3",
            row.original?.isNewLabor
              ? "text-green-500 bg-green-50 before:bg-green-500"
              : "text-blue-500 bg-sky-50 before:bg-blue-500"
          )}
        >
          {row.original?.isNewLabor ? "Nueva" : "Existe"}
        </span>
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
            <h4 className="text-[12.5px] font-semibold leading-4 flex ">
              {useRelativeTime(row.original.updatedAt)}
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
  // {
  //   id: "actions",
  //   cell: ({ row }) => (
  //     <DataTableRowActions componentToShow={"cycle"} row={row} />
  //   ),
  //   enableHiding: false,
  // },
];
