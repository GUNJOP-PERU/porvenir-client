import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postDataRequest, putDataRequest } from "@/lib/api";
import { useToast } from "./useToaster";

export function useHandleFormSubmit() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const mutation = useMutation({
    mutationFn: async ({ isEdit, endpoint, id, data }) => {
      return isEdit
        ? await putDataRequest(`${endpoint}/${id}`, data)
        : await postDataRequest(endpoint, data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [variables.endpoint] });
      addToast({
        title: variables.isEdit ? "Editado correctamente" : "Creado correctamente",
        message: variables.isEdit ? "Los cambios se han guardado con éxito." : "Dato creado con éxito.",
        variant: "success", // Si usas variantes de color en el addToaster
      });
    },
    onError: (error,variables) => {
      console.error("Error en la solicitud:", error);
      addToast({
        title: variables.isEdit ? "Error al editar" : "Error al crear",
        message: "Revise la información e intente nuevamente.",
        variant: "destructive",
      });
    },
  });

  return async function handleFormSubmit({
    isEdit,
    endpoint,
    id,
    data,
    setLoadingGlobal,
    onClose,
    reset,
  }) {
    try {
      setLoadingGlobal(true);
      await mutation.mutateAsync({ isEdit, endpoint, id, data });

      if (onClose) onClose();
      if (reset) reset();
    } finally {
      setLoadingGlobal(false);
    }
  };
}
