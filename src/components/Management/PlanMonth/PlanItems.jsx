/* eslint-disable react/prop-types */
import { cn } from "@/lib/utils";
import { Check, MoreHorizontal } from "lucide-react";
import { formatDay, formatFecha, getMonthName } from "@/lib/utilsGeneral";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import IconEdit from "@/icons/IconEdit";
import { IconDelete } from "@/icons/IconDelete";
import { ModalDelete } from "@/components/ModalDelete";
import { useNavigate } from "react-router-dom";

export default function PlanItems({ data, setSelectedPlan, selectedPlan, mode,urlDelete }) {
  const navigate = useNavigate();
  const [deleteModal, setDeleteModal] = useState(false);
  const [rowData, setRowData] = useState(null);
  const [menuOpenId, setMenuOpenId] = useState(null);

  const handleDeleteModal = (rowData) => {
    setRowData(rowData);
    setDeleteModal(true);
    setMenuOpenId(null); // Cerrar menú
  };

   const handleEditPlan = (item) => {
    navigate(`/plan/${mode}/${item._id}`);
  };

  return (
    <>
      <div className="h-[80vh] w-[250px] flex flex-col gap-1 overflow-y-auto pr-2">
        {data.map((item) => (
          <div
            key={item._id}
            className={cn(
              " items-center px-2 py-2.5 cursor-pointer hover:bg-zinc-100 rounded-lg select-none border relative",
              item._id === selectedPlan?._id
                ? "border-primary bg-primary/5"
                : "border-zinc-100",
            )}
            onClick={() => setSelectedPlan(item)}
          >
            <div className="flex items-center ">
              <div
                className={cn(
                  "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                  item._id === selectedPlan?._id
                    ? "bg-primary text-white border-primary"
                    : "opacity-50 [&_svg]:invisible text-zinc-200",
                )}
              >
                <Check className="size-3" />
              </div>
              <div className="flex flex-col justify-center gap-0.5">
                <h4 className="text-[12.5px] font-semibold leading-4 flex capitalize">
                  {mode === "weekly" ? (
                    <>
                      {getMonthName(item.month)} /{" "}
                      <span className="text-zinc-500 pl-1">#Sem {item.week}</span>
                    </>
                  ) : (
                    getMonthName(item.month)
                  )}
                </h4>
                <span className="text-[11px] leading-3 text-zinc-400 md:inline capitalize ">
                  {mode === "weekly"
                    ? `${formatDay(item.startDate)} - ${formatDay(item.endDate)}`
                    : `Mes: ${getMonthName(item.month)}`}
                </span>
              </div>
            </div>
            <div className="mt-2 flex flex-col justify-center pl-6">
              <span className="text-[11px] leading-3 text-zinc-400 md:inline">
                Fecha de creación {formatFecha(item.createdAt)}
              </span>
            </div>
            <div>
              <DropdownMenu
                open={menuOpenId === item._id}
                onOpenChange={(open) => setMenuOpenId(open ? item._id : null)}
              >
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex h-8 w-8 p-0 data-[state=open]:bg-muted absolute right-1 top-1"
                  >
                    <MoreHorizontal className="rotate-90 text-zinc-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[150px]">
                  <DropdownMenuItem onClick={() => handleEditPlan(item)}>
                    <IconEdit className="h-5 w-5 stroke-black" />
                    Editar detalles
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-500 focus:text-red-500"
                    onClick={() => handleDeleteModal(item)}
                  >
                    <IconDelete className="h-5 w-5 text-red-600" />
                    Eliminar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>
      <ModalDelete
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        urlDelete={`${urlDelete}/${rowData?._id}`}
        itemId={rowData?._id}
        queryKeyToUpdate={urlDelete}
      />
    </>
  );
}
