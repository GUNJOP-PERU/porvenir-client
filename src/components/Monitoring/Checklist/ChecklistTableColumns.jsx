import { formatFecha } from "@/lib/utilsGeneral";
import { DataTableColumnHeader } from "../../Table/DataTableColumnHeader";
import clsx from "clsx";
import IconDay from "@/icons/IconDay";
import IconNight from "@/icons/IconNight";
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
    accessorKey: "userName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Operador" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center space-x-2">
          <div
            className={clsx(
              "w-8 h-8 rounded-[10px] bg-cover bg-center flex items-center justify-center",
              {
                "bg-[url('/vehicle/scoop.png')]":
                  row.original?.vehicleType === "scoop",
                "bg-[url('/vehicle/truck.png')]":
                  row.original?.vehicleType === "truck",
                "bg-[url('/vehicle/drill.png')]":
                  row.original?.vehicleType === "drill",
              }
            )}
          ></div>
          <div className="flex flex-col justify-center gap-0.5">
            <h4 className="text-[12.5px] font-semibold leading-4 flex capitalize">
              {row.original?.userName || ""}
            </h4>
            <span className="text-[11px] leading-3 text-zinc-400 md:inline ">
              {row.original?.vehicleTagName || ""}
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
        < >
          {row?.original?.shift === "dia" ? (
            <IconDay className="h-5 w-5 fill-orange-400" />
          ) : (
            <IconNight className="h-5 w-5 fill-cyan-400" />
          )}
        </>
      );
    },
  },

  {
    accessorKey: "vehicleType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Hora finalizada" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          {/* <IconTime className="h-5 w-5 text-custom-600" /> */}
          <div className="flex flex-col justify-center">
            <h4 className="text-[12.5px] font-semibold leading-4 flex capitalize">
              {formatFecha(row.original?.completedOperatorTime)}
            </h4>
            <span className="text-[11px] leading-3 text-zinc-400 md:inline lowercase">
              hora finalizada de checklist
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "vehicleTagName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Hora de firma" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <div className="flex flex-col justify-center">
            {row.original?.completedBossTime ? (
              <>
                <h4 className="text-[12.5px] font-semibold leading-4 flex capitalize">
                  {formatFecha(row.original?.completedBossTime)}
                </h4>
                <span className="text-[11px] leading-3 text-zinc-400 md:inline lowercase">
                  hora de firma del jefe
                </span>
              </>
            ) : (
              <span className="text-[11px] leading-3 text-zinc-400 md:inline lowercase">
                en espera...
              </span>
            )}
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
              {formatFecha(row.original?.createdAt)}
            </h4>
            <span className="text-[11px] leading-3 text-zinc-400 md:inline lowercase">
              fecha de creación
            </span>
          </div>
        </div>
      );
    },
  },
];
