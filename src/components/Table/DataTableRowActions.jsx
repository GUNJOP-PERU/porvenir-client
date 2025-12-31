import { ListCollapse, MoreHorizontal } from "lucide-react";
import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import { IconDelete } from "@/icons/IconDelete";
import IconEdit from "@/icons/IconEdit";
import { ModalUser } from "../Management/Users/ModalUser";
import { ModalVehicle } from "../Management/Vehicle/ModalVehicle";
import { ModalCompany } from "../Management/Company/CompanyModal";
import { DetailsUser } from "../Management/Users/DetailsUser";
import { LaborModal } from "../Management/Labor/LaborModal";
import { DestinyModal } from "../Management/Destiny/DestinyModal";

import { EditPlanMonthModal } from "../Management/PlanMonth/EditPlanMonthModal";
import { IncidenceEditModal } from "../Monitoring/Incidence/IncidenceEditModal";
import { BeaconModal } from "../Management/Beacon/BeaconModal";
import { ModalWap } from "../Management/Wap/WapModal";
import { CycleTruckModal } from "../Monitoring/CycleTruck/CycleTruckModal";
import { PlanWeekModal } from "../Management/PlanWeek/PlanWeekModal";

import { MineralChargeModal } from "@/components/Configuration/Modal/MineralChargeModal";
import { ActivityAverageModal } from "@/components/Configuration/Modal/ActivityAverageModal";
import { TurnCardModal } from "@/components/Configuration/Modal/TurnCardModal";
import { ModalDelete } from "../ModalDelete";
import { TripModal } from "../Dashboard/Trips/TripModal";
import { VetaModal } from "../Management/Veta/VetaModal";
import { PlanDayDetails } from "../Management/PlanDay/PlanDayDetails";

export function DataTableRowActions({
  componentToShow,
  row,
  deleteModal = true,
}) {
  const [open, setOpen] = useState(false);
  const [deleModal, setDeleteModal] = useState(false);
  const [detailsModal, setDetailsModal] = useState(false);
  const [rowData, setRowData] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleDetails = (rowData) => {
    setRowData(rowData);
    setDetailsModal(true);
    setMenuOpen(false);
  };

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
    ),
    incidence: (
      <IncidenceEditModal
        isOpen={open}
        onClose={() => setOpen(false)}
        dataCrud={rowData}
        isEdit={true}
      />
    ),
    beacon: (
      <BeaconModal
        isOpen={open}
        onClose={() => setOpen(false)}
        dataCrud={rowData}
        isEdit={true}
      />
    ),
    wap: (
      <ModalWap
        isOpen={open}
        onClose={() => setOpen(false)}
        dataCrud={rowData}
        isEdit={true}
      />
    ),
    cycleTruck: (
      <CycleTruckModal
        isOpen={open}
        onClose={() => setOpen(false)}
        dataCrud={rowData}
        isEdit={true}
      />
    ),
    planWeek: (
      <PlanWeekModal
        isOpen={open}
        onClose={() => setOpen(false)}
        dataCrud={rowData}
        isEdit={true}
      />
    ),
    trip: (
      <TripModal
        isOpen={open}
        onClose={() => setOpen(false)}
        dataCrud={rowData}
        isEdit={true}
      />
    ),
    veta: (
      <VetaModal
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
          {componentToShow === "planDay" && (
            <DropdownMenuItem onClick={() => handleDetails(row.original)}>
              <ListCollapse className="h-5 w-5 stroke-black" />
              Ver Detalles
            </DropdownMenuItem>
          )}

          {components[componentToShow] && (
            <DropdownMenuItem onClick={() => handleClick(row.original)}>
              <IconEdit className="h-5 w-5 stroke-black" />
              Editar detalles
            </DropdownMenuItem>
          )}
          {components[componentToShow] && deleteModal && (
            <DropdownMenuSeparator />
          )}
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
      {open && components[componentToShow] && components[componentToShow]}
      <ModalDelete
        isOpen={deleModal}
        onClose={() => setDeleteModal(false)}
        urlDelete={`${componentToShow}/${rowData?._id}`}
        itemId={rowData?._id}
        queryKeyToUpdate={componentToShow}
      />
      {componentToShow === "planDay" && (
        <PlanDayDetails
          isOpen={detailsModal}
          onClose={() => setDetailsModal(false)}
          dataCrud={rowData}
        />
      )}
    </>
  );
}
