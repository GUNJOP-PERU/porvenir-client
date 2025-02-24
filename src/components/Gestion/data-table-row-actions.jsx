import { Delete, Edit, MoreHorizontal } from "lucide-react";
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
import { ModalUser } from "./Users/ModalUser";
import { ModalVehicle } from "./Vehicle/ModalVehicle";
import { ModalFrontLabor } from "./FrontLabor/ModalFrontLabor";
import { ModalWorkOrder } from "./WorkOrder/ModalWorkOrder";
import { ModalChecklist } from "./Checklist/ModalChecklist";
import { IconDelete } from "@/icons/IconDelete";
import IconEdit from "@/icons/IconEdit";
import IconDuplicate from "@/icons/IconDuplicate";
import IconDetails from "@/icons/IconDetails";
import IconMore from "@/icons/IconMore";
import { ModalCompany } from "./Company/ModalCompany";

export function DataTableRowActions({ componentToShow, row }) {
  const [open, setOpen] = useState(false);
  const [deleModal, setDeleteModal] = useState(false);
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

  const components = {
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
      <ModalFrontLabor
        isOpen={open}
        onClose={() => setOpen(false)}
        dataCrud={rowData}
        isEdit={true}
      />
    ),
    checklist: (
      <ModalChecklist
        isOpen={open}
        onClose={() => setOpen(false)}
        dataCrud={rowData}
        isEdit={true}
      />
    ),
    workOrder: (
      <ModalWorkOrder
        isOpen={open}
        onClose={() => setOpen(false)}
        dataCrud={rowData}
        isEdit={true}
      />
    ),
    enterprise: (
      <ModalCompany
        isOpen={open}
        onClose={() => setOpen(false)}
        dataCrud={rowData}
        isEdit={true}
      />
    ),
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
          {/* <DropdownMenuItem>
            <IconDetails className="h-5 w-5 text-gray-500" />
            Ver detalles
          </DropdownMenuItem> */}
          {/* <DropdownMenuItem>
            <IconMore className="h-5 w-5 fill-gray-500" />
            Crear nuevo
          </DropdownMenuItem> */}
          <DropdownMenuItem onClick={() => handleClick(row.original)}>
            <IconEdit className="h-5 w-5 stroke-black" />
            Editar detalles
          </DropdownMenuItem>
          {/* <DropdownMenuItem>
            <IconDuplicate className="h-5 w-5 text-gray-500" />
            Duplicar
          </DropdownMenuItem> */}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-500 focus:text-red-500"
            onClick={() => handleDeleteModal(row.original)}
          >
            <IconDelete className="h-5 w-5 text-red-600" />
            Eliminar
          </DropdownMenuItem>
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
    </>
  );
}
