import IconDay from "@/icons/IconDay";
import IconNight from "@/icons/IconNight";
import {
  formatDurationHour,
  formatFecha,
  formatHour,
} from "@/lib/utilsGeneral";
import clsx from "clsx";
import TimeAgo from "timeago-react";
import { DataTableColumnHeader } from "../DataTableColumnHeader";

const codeColorMap = {
  1: "bg-sky-500",
  2: "bg-[#F59E0B]",
  3: "bg-[#AF52DE]",
  4: "bg-[#F765A3]",
  5: "bg-[#38BDF8]",
  6: "bg-[#38BDF8]",
};

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
    accessorKey: "activityName",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Actividad"
        accessorKey="activityName"
      />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center space-x-2">
          <div
            className={clsx(
              "w-8 h-8 rounded-[10px] flex items-center justify-center",
              row.original?.type_activity === "productive"
                ? "bg-green-500"
                : codeColorMap[row.original?.code_activity?.charAt(0)] ||
                    "bg-gray-300"
            )}
          >
            <span className="text-zinc-50 font-bold">
              {row.original?.code_activity}
            </span>
          </div>
          <div className="flex-1 flex flex-col justify-center gap-0.5 min-w-[150px] max-w-[150px]">
            <h4 className="text-[12.5px] font-semibold leading-[0.9rem] capitalize line-clamp-2">
              {row.getValue("activityName")}
            </h4>
            <span className="text-[11px] leading-3 text-zinc-400 md:inline">
              {row.original?.type_activity}
            </span>
          </div>
        </div>
      );
    },
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
            <div
              className={clsx(
                "w-8 h-8 rounded-[10px] bg-cover bg-center flex items-center justify-center ",
                {
                  "bg-[url('/vehicle/scoop.png')]":
                    row.original?.equipment === "Scoop",
                  "bg-[url('/vehicle/truck.png')]":
                    row.original?.equipment === "Volquete",
                }
              )}
            ></div>
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
        <div className="">
          <div></div>
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
        </div>
      );
    },
  },
  {
    accessorKey: "isValid",
    header: "Estado Ciclo",
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
            "relative text-[10px] py-[2px] px-2 rounded-[8px] before:content-[''] before:absolute before:w-1 before:h-1 before:rounded-full before:left-[5px] before:top-1/2 before:-translate-y-1/2 pl-3",
            isValid
              ? "text-green-500 bg-green-50 before:bg-green-500"
              : "text-rose-500 bg-rose-50 before:bg-rose-500"
          )}
        >
          {isValid ? "Ciclo completo" : "Ciclo interrumpido"}
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
];
