import {
  formatDurationHour,
  formatFecha,
  formatHour,
} from "@/lib/utilsGeneral";
import { DataTableColumnHeader } from "../DataTableColumnHeader";
import { DataTableRowActions } from "../DataTableRowActions";
import IconDay from "@/icons/IconDay";
import IconNight from "@/icons/IconNight";
import clsx from "clsx";
import IconMineral from "@/icons/IconMineral";
import IconClearance from "@/icons/IconClearance";
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
              "w-8 h-8 rounded-[10px]  flex items-center justify-center",
              {
                "bg-green-500": row.original?.type_activity === "productive",
                "bg-red-500": row.original?.type_activity === "no productive",
              }
            )}
          >
            <span className="text-zinc-50 font-bold">
              {" "}
              {row.original?.code_activity}
            </span>
          </div>
          <div className="flex flex-col justify-center gap-0.5">
            <h4 className="text-[12.5px] font-semibold leading-4 capitalize truncate max-w-[120px]">
              {row.getValue("activityName")}
            </h4>
            <span className="text-[11px] leading-3 text-zinc-400 md:inline ">
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
                  "bg-[url('/src/assets/vehicle/scoop.png')]":
                    row.original?.equipment === "Scoop",
                  "bg-[url('/src/assets/vehicle/truck.png')]":
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
    accessorKey: "frontLabor",
    header: "Labor",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col gap-1 text-xs">
          <span className="max-w-[500px] truncate font-medium leading-3">
            <strong>Origen: </strong> {row.getValue("frontLabor")}
          </span>
          <span className="max-w-[500px] truncate font-medium leading-3">
            <strong> Destino:</strong> {row.original?.destiny}
          </span>
        </div>
      );
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
    accessorKey: "tonnage",
    header: "Tonelaje",
    cell: ({ row }) => {
      return <>{row.getValue("tonnage")} TN</>;
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
  // {
  //   id: "actions",
  //   cell: ({ row }) => (
  //     <DataTableRowActions componentToShow={"activity"} row={row} />
  //   ),
  //   enableHiding: false,
  // },
];
