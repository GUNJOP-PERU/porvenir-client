import { putDataRequest } from "@/api/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/useToaster";
import IconClose from "@/icons/IconClose";
import IconLoader from "@/icons/IconLoader";
import IconToggle from "@/icons/IconToggle";
import { CircleFadingPlus, MessageSquareText } from "lucide-react";
import { useState } from "react";

export const ModalComment = ({ isOpen, onClose, truck, refetch }) => {
  const { addToast } = useToast();
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!comment.trim()) return;
    setLoading(true);
    try {
      await putDataRequest(`beacon-truck/${truck.id}`, {
        status: truck.status,
        comments: comment,
      });
      refetch();
      addToast({
        title: "Estado actualizado correctamente",
        message: "Los cambios y comentarios se han guardado con éxito.",
        variant: "success",
      });
      onClose(false);
      setComment("");
    } catch (error) {
      addToast({
        title: "Error al actualizar",
        message: "No se pudo actualizar el estado",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[280px] p-4">
        <DialogHeader>
          <div className="flex gap-2 items-center">
            <div>
              <MessageSquareText className="w-6 h-6 text-zinc-300 " />
            </div>
            <div>
              <DialogTitle>Comentario </DialogTitle>
              <DialogDescription>Añade un comentario</DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="flex flex-col gap-1">
          <textarea
            className={`w-full border rounded-lg p-2 text-xs resize-none h-[80px] ${
              !comment.trim() ? "border-red-500" : "border-zinc-300"
            }`}
            placeholder="Falla sistema hidráulico. Pérdida de presión. Requiere diagnóstico y reparación urgente."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          {!comment.trim() && (
            <span className="text-[10px] text-red-500">
              *El comentario no puede estar vacío
            </span>
          )}
        </div>
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            onClick={() => onClose(false)}
            variant="secondary"
          >
            <IconClose className="fill-zinc-400/50 w-4 h-4" />
            Cancelar
          </Button>
          <Button type="button" onClick={handleSave} disabled={loading}>
            {loading ? (
              <>
                <IconLoader className="w-4 h-4" />
                Cargando...
              </>
            ) : (
              <>
                <IconToggle className="text-background w-4 h-4" />
                Guardar
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
