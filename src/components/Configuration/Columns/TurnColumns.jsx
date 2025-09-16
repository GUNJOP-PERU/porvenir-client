import { DataTableColumnHeader } from "@/components/Table/DataTableColumnHeader";
import { DataTableRowActions } from "@/components/Table/DataTableRowActions";
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
        <div className="flex flex-col justify-center gap-0.5">
          <h4 className="text-[12.5px] font-semibold leading-4 flex capitalize">
            {row.getValue("name")}
          </h4>
        </div>
      );
    },
  },
  {
    accessorKey: "startTime",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Hora de Inicio" />
    ),
    cell: ({ row }) => {
      const hour = row.original.hours;
      const formatted = hour.toString().padStart(2, "0") + ":00";
      return (
        <div className="flex items-center gap-2">
          {/* <IconTime className="h-5 w-5 text-custom-600" /> */}
          <div className="flex flex-col justify-center">
            <h4 className="text-[12.5px] font-semibold leading-4 flex capitalize">
              {formatted}
            </h4>
            <span className="text-[11px] leading-3 text-zinc-400 md:inline lowercase">
              Hora de inicio
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
          {/* <IconTime className="h-5 w-5 text-custom-600" /> */}
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
    id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions componentToShow={"shift"} row={row} deleteModal={false}/>
    ),
    enableHiding: false,
  },
];