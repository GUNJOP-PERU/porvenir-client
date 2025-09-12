import {
  formatDurationHour,
  formatFecha,
  formatHour,
} from "@/lib/utilsGeneral";
import clsx from "clsx";
import TimeAgo from "timeago-react";
import { DataTableColumnHeader } from "../../Table/DataTableColumnHeader";
// Utils
import IconWarning from "@/icons/IconWarning";
import { CheckCheckIcon } from "lucide-react";
import React from "react";

export const activityColumns = (globalData) => {
  return [
    {
      accessorKey: "id",
      header: "#",
      cell: ({ row }) => <></>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "activityName",
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
              <span className="text-[12px] leading-3 text-black md:inline ">
                {row.original?.activityName}
              </span>
              <span className="text-[11px] leading-3 text-zinc-400 md:inline ">
                {row.original?.type_activity}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "destiny",
      header: "Labor",
      cell: ({ row }) => {
        return <></>;
      },
    },
    {
      accessorKey: "shift",
      header: "Turno",
      cell: ({ row }) => {
        return <></>;
      },
    },
    {
      accessorKey: "tagName",
      header: "Tonelaje",
      cell: ({ row }) => {
        return <></>;
      },
    },
    {
      accessorKey: "material",
      header: "Material",
      cell: ({ row }) => {
        return <></>;
      },
    },
    {
      accessorKey: "start",
      header: "Tiempo Viaje",
      cell: ({ row }) => {
        const activityDuration = row.original?.duration;

        let activityData = { minDuration: 0, maxDuration: 0 };

        if (globalData?.activityAverage) {
          const match = globalData.activityAverage.find(
            (a) => a.name === row.original?.activityName
          );
          if (match) {
            activityData = {
              minDuration: match.minDuration,
              maxDuration: match.maxDuration,
            };
          }
        }
        let statusText = "Tiempo normal";
        let statusColor = "green";
        let statusIcon = CheckCheckIcon; // usa algún ícono neutro por defecto

        if (activityDuration <= activityData.minDuration) {
          statusText = "Muy rápido";
          statusColor = "yellow";
          statusIcon = IconWarning;
        } else if (activityDuration >= activityData.maxDuration) {
          statusText = "Muy lento";
          statusColor = "red";
          statusIcon = IconWarning;
        }

        return (
          <div
            className={clsx(
              "w-fit flex flex-col gap-1",
              `text-${statusColor}-600`
            )}
          >
            <span className="max-w-[500px] truncate font-medium leading-3">
              {formatHour(row.original?.start)} -{" "}
              {formatHour(row.original?.end)}
            </span>
            <span
              className={clsx(
                "flex items-center justify-center gap-1 text-[10px] font-semibold leading-3 py-[2px] px-2 rounded-[8px]",
                `bg-${statusColor}-50`
              )}
            >
              {React.createElement(statusIcon, {
                className: `h-3 w-3 text-${statusColor}-600`,
              })}{" "}
              {statusText}
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
        return <></>;
      },
    },
    {
      accessorKey: "updatedAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Fecha actualización" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex flex-col justify-center">
            <h4 className="text-[12.5px] font-semibold leading-4 flex ">
              <TimeAgo datetime={row.original?.updatedAt} locale="es" />
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
        <DataTableColumnHeader column={column} title="Fecha creación" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex flex-col justify-center">
            <h4 className="text-[12.5px] font-semibold leading-4 flex capitalize">
              {formatFecha(row.original?.createdAt)}
            </h4>
            <span className="text-[11px] leading-3 text-zinc-400 md:inline lowercase">
              fecha de creación
            </span>
          </div>
        );
      },
    },
  ];
};
