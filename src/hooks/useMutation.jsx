import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postDataRequest, putDataRequest } from "@/api/api";
import { useToast } from "./useToaster";

export function useHandleFormSubmit() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const mutation = useMutation({
    mutationFn: async ({ isEdit, postId, endpoint, id, data }) => {
      return isEdit
        ? await putDataRequest(`${endpoint}/${id}`, data)
        : await postDataRequest(`${endpoint}/${postId ? id:""}`, data);
    },
    onSuccess: (_, variables) => {
      const invalidateKey = variables.invalidateKey || ["crud", variables.endpoint];
      queryClient.invalidateQueries({ queryKey: invalidateKey });
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
        message: error.response.data.message || "Revise la información e intente nuevamente.",
        variant: "destructive",
      });
    },
  });

  return async function handleFormSubmit({
    isEdit,
    postId,
    endpoint,
    id,
    data,
    setLoadingGlobal,
    onClose,
    reset,
    invalidateKey,
    onSuccess,
  }) {
    try {
      setLoadingGlobal(true);
      await mutation.mutateAsync({ isEdit,postId, endpoint, id, data ,invalidateKey});
      
      onSuccess?.(); 
      onClose?.();
      reset?.();
    } finally {
      setLoadingGlobal(false);
    }
  };
}
