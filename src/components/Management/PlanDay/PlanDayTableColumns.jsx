import { formatFecha, roundAndFormat } from "@/lib/utilsGeneral";
import { DataTableColumnHeader } from "../../Table/DataTableColumnHeader";
import { DataTableRowActions } from "../../Table/DataTableRowActions";
import IconDay from "@/icons/IconDay";
import IconNight from "@/icons/IconNight";
import TimeAgo from "timeago-react";
import dayjs from "dayjs";

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
      const formattedDate = row.original?.dateString
        ? dayjs(row.original.dateString).format("dddd D MMMM")
        : "";
      return (
        <div className="flex flex-col justify-center gap-0.5">
          <h4 className="text-[12.5px] font-semibold leading-4 flex capitalize">
            {formattedDate}
          </h4>
          <span className="text-[11px] leading-3 text-zinc-400 md:inline ">
             {row.original?.total || ""} labor programados
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
      const total =
        row.original?.data?.reduce(
          (acc, item) => acc + (item?.tonnage || 0),
          0
        ) ?? 0;

      return <span className="font-semibold">{roundAndFormat(total)} TN</span>;
    },
  },
  // {
  //   accessorKey: "nro_volquetes",
  //   header: "#Volquete",
  //   cell: ({ row }) => {
  //     return <>{row.getValue("nro_volquetes")} und</>;
  //   },
  // },

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
