import { formatFecha } from "@/lib/utilsGeneral";
import { DataTableColumnHeader } from "../data-table-column-header";
import { DataTableRowActions } from "../data-table-row-actions";
import clsx from "clsx";
import IconCheck from "@/icons/IconCheck";
import IconClose from "@/icons/IconClose";
import IconDay from "@/icons/IconDay";
import IconNight from "@/icons/IconNight";

export const columns = [
  {
    accessorKey: "idWorkOrder",
    header: "#",
    cell: ({ row }) => (
      <div className="text-zinc-400 text-[10px]">
        #{row.getValue("idWorkOrder")}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "userName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nombre" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center space-x-2">
          <div
            className={clsx(
              "w-8 h-8 rounded-[10px] bg-cover bg-center flex items-center justify-center",
              {
                "bg-[url('/src/assets/vehicle/scoop.png')]":
                  row.original?.vehicleData?.type === "scoop",
                "bg-[url('/src/assets/vehicle/truck.png')]":
                  row.original?.vehicleData?.type === "truck",
                "bg-[url('/src/assets/vehicle/drill.png')]":
                  row.original?.vehicleData?.type === "drill",
              }
            )}
          ></div>
          <div className="flex flex-col justify-center gap-0.5">
            <h4 className="text-[12.5px] font-semibold leading-4 flex ">
              {row.getValue("userName")}
            </h4>
            <span className="text-[11px] leading-3 text-zinc-400 md:inline ">
              {row.original?.vehicleData?.plate}
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
    accessorKey: "shift",
    header: "Turno",
    cell: ({ row }) => {
      return   < >
      {row.getValue("shift") === "dia" ? (
        <IconDay className="h-5 w-5 fill-orange-400" />
      ) : (
        <IconNight className="h-5 w-5 fill-sky-400" />
      )}
    </>;
    },
  },
 
  {
    accessorKey: "reasonNoPlanned",
    header: "Razon",
    cell: ({ row }) => {
      return <>{row.getValue("reasonNoPlanned") || <span className="text-zinc-400 text-[11px]">... </span>}</>;

    },
  },

  {
    accessorKey: "statusOperator",
    header: "Estado/Operador",
    cell: ({ row }) => {
      return (
        <div
          className={clsx(
            "w-5 h-5 rounded-full flex items-center justify-center border",
            row.getValue("statusOperator") === "accepted"
              ? "border-green-500"
              : "border-red-500"
          )}
        >
          {row.getValue("statusOperator") === "accepted" ? (
            <IconCheck className="w-3.5 h-3.5 fill-green-500" />
          ) : (
            <IconClose className="w-3.5 h-3.5 fill-red-500" />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "statusSupervisor",
    header: "Estado/Supervisor",
    cell: ({ row }) => {
      return (
      
         <div
         className={clsx(
           "w-5 h-5 rounded-full flex items-center justify-center border",
           row.getValue("statusSupervisor") === "accepted"
             ? "border-green-500"
             : "border-red-500"
         )}
       >
         {row.getValue("statusSupervisor") === "accepted" ? (
           <IconCheck className="w-3.5 h-3.5 fill-green-500" />
         ) : (
           <IconClose className="w-3.5 h-3.5 fill-red-500" />
         )}
       </div>
      );
    },
  },
  {
    accessorKey: "workOrderOk",
    header: "Order T",
    cell: ({ row }) => {
      return <> {row.getValue("workOrderOk")}</>;
    },
  },
  {
    accessorKey: "checkListOk",
    header: "Checklist",
    cell: ({ row }) => {
      return <> {row.getValue("checkListOk")}</>;
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
      <DataTableRowActions componentToShow={"workOrder"} row={row} />
    ),
    enableHiding: false,
  },
];
