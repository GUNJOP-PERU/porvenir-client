import {
  formatDurationHour,
  formatFecha,
  formatHour,
} from "@/lib/utilsGeneral";
import { DataTableColumnHeader } from "../../Table/DataTableColumnHeader";
import clsx from "clsx";
import IconDay from "@/icons/IconDay";
import IconNight from "@/icons/IconNight";
import IconMineral from "@/icons/IconMineral";
import IconClearance from "@/icons/IconClearance";
import TimeAgo from "timeago-react";
import { DataTableRowActions } from "../../Table/DataTableRowActions";
import {
  Check,
  ChevronDown,
  ChevronRight,
  CircleCheckBig,
  CircleOff,
} from "lucide-react";

export const columns = [
  {
    accessorKey: "id",
    header: "#",
    cell: ({ row }) => (
      <div className="text-zinc-400 text-[10px] flex items-center gap-1">#{row.index + 1}
        <button
            onClick={row.getToggleExpandedHandler()}
            className="flex items-center gap-1"
          >
            {row.getIsExpanded() ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
          </button>
          </div>
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
          <div>
            <div className="w-8 h-8 rounded-[10px] bg-cover bg-center flex items-center justify-center bg-[url('/vehicle/truck.png')]"></div>
          </div>
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
    header: "Origen > Destino",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col gap-1 text-xs">
          <span className="max-w-[500px] truncate font-medium leading-3">
            <strong>Desde: </strong> {row.getValue("frontLabor")}
          </span>
          <span className="max-w-[500px] truncate font-medium leading-3">
            <strong>Hasta:</strong> {row.original?.destiny}
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
    accessorKey: "tonnage",
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
    accessorKey: "end",
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
            "inline-flex items-center justify-center rounded-md py-[1px] text-[10px] font-medium w-fit gap-1 px-[7px]",
            row.original?.isNewLabor
              ? "text-amber-500 bg-amber-50 "
              : "text-blue-500 bg-sky-50 "
          )}
        >
          {row.original?.isNewLabor ? "Nueva" : "Existe"}
        </span>
      );
    },
  },
  {
    accessorKey: "isValid",
    header: "Estado del Ciclo",
    cell: ({ row }) => {
      const isValid = row.original?.isValid;

      if (isValid === undefined || isValid === null) {
        return (
          <span className="text-gray-500 bg-gray-100 text-[10px] py-[2px] px-2 rounded-[8px]">
            Error
          </span>
        );
      }

      return (
        <span
          className={clsx(
            "inline-flex items-center justify-center rounded-md py-[1px] text-[10px] font-medium w-fit gap-1 px-[7px]",
            isValid ? "text-green-500 bg-green-50" : "text-rose-500 bg-rose-50"
          )}
        >
          {isValid ? (
            <>
              <CircleCheckBig className="size-3" /> Completo
            </>
          ) : (
            <>
              <CircleOff className="size-3" /> Interrumpido
            </>
          )}
        </span>
      );
    },
  },
  {
    accessorKey: "start",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fecha de Ciclo" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <div className="flex flex-col justify-center">
            <h4 className="text-[12.5px] font-semibold leading-4 flex capitalize">
              {formatFecha(row.original.start)}
            </h4>
            <span className="text-[11px] leading-3 text-zinc-400 md:inline lowercase">
              inicio en tablet
            </span>
          </div>
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
          <div className="flex flex-col justify-center">
            <h4 className="text-[12.5px] font-semibold leading-4 flex">
              <TimeAgo datetime={row.original.updatedAt} locale="es" />
            </h4>
            <span className="text-[11px] leading-3 text-zinc-400 md:inline lowercase">
              creación {formatFecha(row.original.createdAt)}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      if (!row.original?.isNewLabor) return null;
      return (
        <DataTableRowActions
          componentToShow={"cycleTruck"}
          row={row}
          deleteModal={false}
        />
      );
    },
    enableHiding: false,
  },
];
