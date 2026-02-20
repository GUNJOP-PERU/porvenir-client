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
        : await postDataRequest(`${endpoint}/${postId ? id : ""}`, data);
    },
    onSuccess: (_, variables) => {
      const keysToInvalidate = [
        variables.invalidateKey || ["crud", variables.endpoint],
      ];

      if (variables.extraInvalidateKeys?.length) {
        const extras = Array.isArray(variables.extraInvalidateKeys[0])
          ? variables.extraInvalidateKeys
          : [variables.extraInvalidateKeys];
        keysToInvalidate.push(...extras);
      }

      keysToInvalidate.forEach((queryKey) => {
        queryClient.invalidateQueries({ queryKey });
        queryClient.refetchQueries({
          queryKey,
          type: "all", 
        });
      });

      addToast({
        title: variables.isEdit
          ? "Editado correctamente"
          : "Creado correctamente",
        message: variables.isEdit
          ? "Los cambios se han guardado con éxito."
          : "Dato creado con éxito.",
        variant: "success",
      });
    },
    onError: (error, variables) => {
      console.error("Error en la solicitud:", error);
      addToast({
        title: variables.isEdit ? "Error al editar" : "Error al crear",
        message:
          error.response.data.message ||
          "Revise la información e intente nuevamente.",
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
    extraInvalidateKeys,
    onSuccess,
  }) {
    try {
      setLoadingGlobal(true);
      await mutation.mutateAsync({
        isEdit,
        postId,
        endpoint,
        id,
        data,
        invalidateKey,
        extraInvalidateKeys,
      });

      onSuccess?.();
      onClose?.();
      reset?.();
    } finally {
      setLoadingGlobal(false);
    }
  };
}
