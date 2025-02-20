import { deleteDataRequest } from "@/lib/api";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useQueryClient } from "@tanstack/react-query";
import IconLoader from "@/icons/IconLoader";
import { IconDelete } from "@/icons/IconDelete";

export const ModalDelete = ({ isOpen, onClose, urlDelete }) => {
  const [loadingGlobal, setLoadingGlobal] = useState(false);
  const queryClient = useQueryClient();
  async function onSubmit() {
    if (!urlDelete) return;

    try {
      setLoadingGlobal(true);
      const response = await deleteDataRequest(urlDelete);
     
      queryClient.invalidateQueries(urlDelete);
      onClose();
    } catch (error) {
      console.error("Error deleting", error);
    } finally {
      setLoadingGlobal(false);
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(onClose) => !loadingGlobal && setDeleteModal(onClose)}
    >
      <DialogContent className="w-[250px]">
        <DialogHeader>
          <div className="flex gap-2 items-center">
            <div>
              <IconDelete className="w-6 h-6 text-red-500 " />
            </div>
            <div>
              <DialogTitle>Eliminar</DialogTitle>
              <DialogDescription>Remover dato seleccionado</DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="flex flex-col gap-8">
          <p className="text-xs">
            {" "}
            <strong>¿Estás seguro?</strong> Por favor, revise que el dato
            seleccionado es el correcto
          </p>
        </div>
        <div className="pt- flex gap-2">
          <Button
            type="button"
            className="w-1/2"
            onClick={onClose}
            variant="secondary"
            disabled={loadingGlobal}
          >
            No
          </Button>
          <Button
            type="button"
            disabled={loadingGlobal}
            className="w-1/2"
            onClick={onSubmit}
            variant="destructive"
          >
            {loadingGlobal ? (
              <>
                <IconLoader className="w-4 h-4 text-red-200 fill-red-500 animate-spin" />
                Carg...
              </>
            ) : (
              <>Si</>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
