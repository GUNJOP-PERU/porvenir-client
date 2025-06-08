import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { ModalDelete } from "./ModalDelete";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { IconDelete } from "@/icons/IconDelete";
import IconEdit from "@/icons/IconEdit";
import { ModalUser } from "./Users/ModalUser";
import { ModalVehicle } from "./Vehicle/ModalVehicle";
import { ModalCompany } from "./Company/CompanyModal";
import { DetailsUser } from "./Users/DetailsUser";
import { LaborModal } from "./Labor/LaborModal";
import { DestinyModal } from "./Destiny/DestinyModal";
import { MineralChargeModal } from "../Configuration/Modal/MineralChargeModal";
import { ActivityAverageModal } from "../Configuration/Modal/ActivityAverageModal";
import { EditPlanMonthModal } from "./PlanMonth/EditPlanMonthModal";
import { TurnCardModal } from "../Configuration/Modal/TurnCardModal";

export function DataTableRowActions({ componentToShow, row, deleteModal = true }) {
  const [open, setOpen] = useState(false);
  const [deleModal, setDeleteModal] = useState(false);
  const [detailsModal, setDetailsModal] = useState(false);
  const [rowData, setRowData] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleClick = (rowData) => {
    setRowData(rowData);
    setOpen(true);
    setMenuOpen(false); // Cerrar menú
  };

  const handleDeleteModal = (rowData) => {
    setRowData(rowData);
    setDeleteModal(true);
    setMenuOpen(false); // Cerrar menú
  };
  const handleDetailsModal = (rowData) => {
    setRowData(rowData);
    setDetailsModal(true);
    setMenuOpen(false); // Cerrar menú
  };

  const components = {
    enterprise: (
      <ModalCompany
        isOpen={open}
        onClose={() => setOpen(false)}
        dataCrud={rowData}
        isEdit={true}
      />
    ),
    user: (
      <ModalUser
        isOpen={open}
        onClose={() => setOpen(false)}
        dataCrud={rowData}
        isEdit={true}
      />
    ),
    vehicle: (
      <ModalVehicle
        isOpen={open}
        onClose={() => setOpen(false)}
        dataCrud={rowData}
        isEdit={true}
      />
    ),
    frontLabor: (
      <LaborModal
        isOpen={open}
        onClose={() => setOpen(false)}
        dataCrud={rowData}
        isEdit={true}
      />
    ),
    destination: (
      <DestinyModal
        isOpen={open}
        onClose={() => setOpen(false)}
        dataCrud={rowData}
        isEdit={true}
      />
    ),
    mineral: (
      <MineralChargeModal
        isOpen={open}
        onClose={() => setOpen(false)}
        dataCrud={rowData}
        isEdit={true}
      />
    ),
    "activity-config": (
      <ActivityAverageModal
        isOpen={open}
        onClose={() => setOpen(false)}
        dataCrud={rowData}
        isEdit={true}
      />
    ),
    planMonth: (
      <EditPlanMonthModal
        isOpen={open}
        onClose={() => setOpen(false)}
        dataCrud={rowData}
        isEdit={true}
      />
    ),
    shift: (
      <TurnCardModal
        isOpen={open}
        onClose={() => setOpen(false)}
        dataCrud={rowData}
        isEdit={true}
      />
    )
  };

  return (
    <>
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <MoreHorizontal className="rotate-90 text-zinc-400" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[150px]">         
         <DropdownMenuItem onClick={() => handleClick(row.original)}>
            <IconEdit className="h-5 w-5 stroke-black" />
            Editar detalles
          </DropdownMenuItem>         
          <DropdownMenuSeparator />
          {deleteModal && (
            <DropdownMenuItem
              className="text-red-500 focus:text-red-500"
              onClick={() => handleDeleteModal(row.original)}
            >
              <IconDelete className="h-5 w-5 text-red-600" />
              Eliminar
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      {open && components[componentToShow]}
      <ModalDelete
        isOpen={deleModal}
        onClose={() => setDeleteModal(false)}
        urlDelete={`${componentToShow}/${rowData?._id}`}
        itemId={rowData?._id} 
        queryKeyToUpdate={componentToShow}
      />
      <DetailsUser
        isOpen={detailsModal}
        onClose={() => setDetailsModal(false)}
        dataCrud={rowData}
      />
    </>
  );
}
