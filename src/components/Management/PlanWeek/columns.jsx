import { formatDay, formatFecha, getMonthName } from "@/lib/utilsGeneral";
import { DataTableColumnHeader } from "../../Table/DataTableColumnHeader";
import { DataTableRowActions } from "../../Table/DataTableRowActions";
import TimeAgo from "timeago-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export const columns = (onSelect) => [
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
    id: "view-details",
    meta: {
      onSelect,
    },
    cell: ({ row, column }) => (
      <div
        className="flex items-center px-2 py-1.5 cursor-pointer hover:bg-zinc-100 rounded-lg select-none"
        onClick={() => {
          row.toggleSelected();
          column.columnDef.meta.onSelect(row.original);
        }}
      >
        <div
          className={cn(
            "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
            row.getIsSelected()
              ? "bg-primary text-white"
              : "opacity-50 [&_svg]:invisible text-xs"
          )}
        >
          <Check className="size-3" />
        </div>
      </div>
    ),
  },
  {
    accessorKey: "month",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nombre" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex flex-col justify-center gap-0.5">
          <h4 className="text-[12.5px] font-semibold leading-4 flex capitalize">
            {getMonthName(row.getValue("month"))} /{" "}
            <span className="text-zinc-500 pl-1">
              #Sem {row.original?.week}
            </span>
          </h4>
          <span className="text-[11px] leading-3 text-zinc-400 md:inline capitalize ">
            {formatDay(row.original?.startDate)} -{" "}
            {formatDay(row.original?.endDate)}
          </span>
        </div>
      );
    },
  },

  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estado" />
    ),
    cell: ({ row }) => {
      return (
        <>
          {row.getValue("status") === "creado" ? (
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
    accessorKey: "totalTonnage",
    header: "Tonelaje",
    cell: ({ row }) => {
      return <>{row.getValue("totalTonnage")?.toLocaleString("es-MX")} TN</>;
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
      <DataTableRowActions
        componentToShow={"planWeek"}
        row={row}
        mode="weekly"
      />
    ),
    enableHiding: false,
  },
  
];
