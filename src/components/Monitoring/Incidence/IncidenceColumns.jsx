import { formatFecha } from "@/lib/utilsGeneral";
import { DataTableColumnHeader } from "../../Table/DataTableColumnHeader";
import { DataTableRowActions } from "../../Table/DataTableRowActions";

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
    accessorKey: "vehicleId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Vehículo" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex flex-col justify-center gap-0.5">
          <h4 className="text-[12.5px] font-semibold leading-4 flex capitalize">
            {row.original?.vehicleId.tagName}
          </h4>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estado del Vehículo" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex flex-col justify-center gap-0.5">
          <h4 className="text-[12.5px] font-semibold leading-4 flex capitalize">
            {row.original?.vehicleId.status}
          </h4>        
        </div>
      );
    },
  },
  {
    accessorKey: "code",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Código / Descripción" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-[10px]  flex items-center justify-center bg-[#F765A3]">
            <span className="text-zinc-50 font-bold">
              {" "}
              {row.original?.code}
            </span>
          </div>
          <div className="flex flex-col justify-center gap-0.5">
            <h4 className="text-[12.5px] font-semibold leading-4 capitalize truncate">
              {row.original.description || "###"}
            </h4>
            <span className="text-[11px] leading-3 text-zinc-400 md:inline ">
            no productive
            </span>
          </div>
        </div>
      );
    },
  },

  {
    accessorKey: "start",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Hora de Creación" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          {/* <IconTime className="h-5 w-5 text-custom-600" /> */}
          <div className="flex flex-col justify-center">
            <h4 className="text-[12.5px] font-semibold leading-4 flex capitalize">
              {formatFecha(row.original.start)}
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
    accessorKey: "end",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Hora de Finalización" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          {/* <IconTime className="h-5 w-5 text-custom-600" /> */}
          <div className="flex flex-col justify-center">
            <h4 className="text-[12.5px] font-semibold leading-4 flex capitalize">
              {row.original.end ? formatFecha(row.original.end) : "--:--, ---"}
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
      <DataTableRowActions componentToShow={"incidence"} row={row} />
    ),
    enableHiding: false,
  },
];
