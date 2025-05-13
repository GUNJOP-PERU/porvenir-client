import { putDataRequest } from "@/api/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/useToaster";
import IconClose from "@/icons/IconClose";
import { dataStatusVehicle } from "@/lib/data";
import { Check, CircleFadingPlus } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

export const ModalFloat = ({ onClose, data, isOpen }) => {
  const { addToast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  const [loadingItems, setLoadingItems] = useState({}); // id -> loading boolean

  const filterItems = useCallback(
    (query) => {
      return data.filter((item) =>
        item.name?.toLowerCase().includes(query.toLowerCase())
      );
    },
    [data]
  );
  const filteredItems = useMemo(
    () => filterItems(searchQuery),
    [searchQuery, filterItems]
  );
  const dataColor = (estado) => {
    switch (estado) {
      case 1:
        return "#81c784";
      case 2:
        return "#fff176";
      case 3:
        return "#ff9999";
      default:
        return "#e0e0e0";
    }
  };

  const handleChange = async (id, value) => {
    console.log("Cambio de estado:", id, value);
    setLoadingItems((prev) => ({ ...prev, [id]: true }));

    try {
      const response = await putDataRequest(`vehicule/update-status/${id}`, {
        status: value,
      });

      if (response.status >= 200 && response.status < 300) {
        addToast({
          title: "Editado correctamente",
          message: "Los cambios se han guardado con éxito.",
          variant: "success", // Si usas variantes de color en el addToaster
        });
      } else {
        addToast({
          title: "Error al actualizar el estado",
          message: "Revise la información e intente nuevamente.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error(err);
      addToast({
        title: "Error al actualizar el estado",
        message: "Revise la información e intente nuevamente.",
        variant: "destructive",
      });
    } finally {
      setTimeout(() => {
        setLoadingItems((prev) => ({ ...prev, [id]: false }));
      }, 3500);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[670px]">
        <DialogHeader>
          <div className="flex gap-2 items-center">
            <div>
              <CircleFadingPlus className="w-6 h-6 text-zinc-300 " />
            </div>
            <div>
              <DialogTitle>Cambiar estado de vehículos</DialogTitle>
              <DialogDescription>
                Cambiar el estado de los vehículos
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div>
          <Input
            type="text"
            placeholder="Buscar vehiculo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-4 gap-1 h-[35vh] overflow-y-auto pr-2">
          {filteredItems.length === 0 ? (
            <span className="text-[10px] text-zinc-400 text-center col-span-4">
              No existen resultados.
            </span>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-2 h-7 rounded-[6px] px-2"
                style={{ backgroundColor: dataColor(item.value) }}
              >
                <span className="text-[0.6em] leading-none font-bold uppercase">
                  {item.name}
                </span>
                <div className="flex gap-0.5">
                  {dataStatusVehicle.map((status) => {
                    const isSelected = item.value === status.value;
                    const isLoading = loadingItems[item.id];

                    return (
                      <label
                        key={status.value}
                        className="h-[16px] w-[16px] cursor-pointer rounded-[5px] transition-all border-[1px] flex items-center justify-center"
                        style={{
                          backgroundColor: status.color,
                          border: isSelected
                            ? "1px solid #333"
                            : "1px solid transparent",
                          opacity: isLoading ? 0.5 : 1,
                          pointerEvents: isLoading ? "none" : "auto",
                        }}
                      >
                        <input
                          type="radio"
                          name={`estado-${item.id}`}
                          value={status.value}
                          checked={isSelected}
                          onChange={() => handleChange(item.id, status.value)}
                          className="hidden"
                          disabled={isLoading}
                        />
                        {isSelected && (
                          <Check className="w-2.5 h-2.5 text-black" />
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" onClick={() => onClose()} variant="secondary">
            <IconClose className="fill-zinc-400/50 w-4 h-4" />
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
