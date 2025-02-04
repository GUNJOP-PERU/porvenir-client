import { formatFecha, getYearFromFecha } from "@/lib/utilsGeneral";
import { DataTableColumnHeader } from "../data-table-column-header";
import { DataTableRowActions } from "../data-table-row-actions";
import clsx from "clsx";

export const columns = [
  {
    accessorKey: "idVehicle",
    header: "#",
    cell: ({ row }) => (
      <div className="text-zinc-400 text-[10px]">
        #{row.getValue("idVehicle")}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "tagName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tag Vehiculo" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center space-x-2">
          <div
            className={clsx(
              "w-8 h-8 rounded-[10px] bg-cover bg-center flex items-center justify-center",
              {
                "bg-[url('/src/assets/vehicle/scoop.png')]":
                  row.original.type === "scoop",
                "bg-[url('/src/assets/vehicle/truck.png')]":
                  row.original.type === "truck",
                "bg-[url('/src/assets/vehicle/drill.png')]":
                  row.original.type === "drill",
              }
            )}
          ></div>
          <div className="flex flex-col justify-center gap-0.5">
            <h4 className="text-[12.5px] font-semibold leading-4 flex capitalize">
              {row.getValue("tagName")}
            </h4>
            <span className="text-[11px] leading-3 text-zinc-400 md:inline lowercase">
              {row.original?.model}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Placa",
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("plate")}
          </span>
        </div>
      );
    },
  },

  {
    accessorKey: "horometer",
    header: "Horometro",
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("horometer")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "odometer",
    header: "Odometro",
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("odometer")}
          </span>
        </div>
      );
    },
  },

  {
    accessorKey: "color",
    header: "Color",
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("color")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "year",
    header: "Año de vehiculo",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col justify-center">
          <h4 className="text-[12.5px] font-semibold leading-4 flex capitalize">
            {getYearFromFecha(row.original.year) || "0"}
          </h4>
          <span className="text-[11px] leading-3 text-zinc-400 md:inline lowercase">
            obtención
          </span>
        </div>
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
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actualización" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex flex-col justify-center">
          <h4 className="text-[12.5px] font-semibold leading-4 flex capitalize">
            {formatFecha(row.original.updatedAt)}
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
      <DataTableColumnHeader column={column} title="Actualización" />
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
      <DataTableRowActions componentToShow={"vehicle"} row={row} />
    ),
    enableHiding: false,
  },
];
