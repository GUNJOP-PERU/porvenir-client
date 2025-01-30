import {
  formatDurationHour,
  formatFecha,
  formatHour,
} from "@/lib/utilsGeneral";
import { DataTableColumnHeader } from "../data-table-column-header";
import { DataTableRowActions } from "../data-table-row-actions";
import IconDay from "@/icons/IconDay";
import IconNight from "@/icons/IconNight";
import clsx from "clsx";

export const columns = [
  {
    accessorKey: "idActivity",
    header: "#",
    cell: ({ row }) => (
      <div className="text-zinc-400 text-[10px]">
        #{row.getValue("idActivity")}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "activityName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actividad" />
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
            <h4 className="text-[12.5px] font-semibold leading-4 flex capitalize truncate max-w-[100px]">
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
      return <>{row.getValue("frontLabor")}</>;
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
    accessorKey: "material",
    header: "Material",
    cell: ({ row }) => {
      return <>{row.getValue("material")}</>;
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
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fecha actualización" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          {/* <IconTime className="h-5 w-5 text-custom-600" /> */}
          <div className="flex flex-col justify-center">
            <h4 className="text-[12.5px] font-semibold leading-4 flex capitalize">
              {formatFecha(row.original.updatedAt)}
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
      <DataTableRowActions componentToShow={"activity"} row={row} />
    ),
    enableHiding: false,
  },
];
