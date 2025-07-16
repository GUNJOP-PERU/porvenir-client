import { deleteDataRequest } from "@/api/api";
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
import { useToast } from "@/hooks/useToaster";

export const ModalDelete = ({
  isOpen,
  onClose,
  urlDelete,
  queryKeyToUpdate,
  itemId,
}) => {
  const { addToast } = useToast();
  const [loadingGlobal, setLoadingGlobal] = useState(false);
  const queryClient = useQueryClient();
  async function onSubmit() {
    if (!urlDelete || !itemId) return;

    try {
      setLoadingGlobal(true);
      const response = await deleteDataRequest(urlDelete);
      console.log("delete",response);
      if (response?.status === 200) {
         queryClient.invalidateQueries({ queryKey: ["crud", queryKeyToUpdate] });
        addToast({
          title:  "Eliminado correctamente",
          message:  "Los cambios se han guardado con éxito." ,
          variant: "success", 
        });
        onClose();
      }
    } catch (error) {
      console.error("Error deleting", error);
      addToast({
        title: "Error al eliminar",
        message: "Revise la información e intente nuevamente.",
        variant: "destructive",
      });
    } finally {
      setLoadingGlobal(false);
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!loadingGlobal) {
          onClose(open);
        }
      }}
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
                <IconLoader className="w-4 h-4" />
                Cargando...
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
