import { useQueryClient } from "@tanstack/react-query";
import { postDataRequest, putDataRequest } from "@/lib/api";

export function useHandleFormSubmit() {
  const queryClient = useQueryClient(); // Hook disponible aquí

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
      let response;

      if (isEdit) {
        response = await putDataRequest(`${endpoint}/${id}`, data); 
      } else {
        response = await postDataRequest(endpoint, data);
      }

      console.log("Respuesta del servidor:", response.data);

      // Invalidar la consulta específica
      queryClient.invalidateQueries(endpoint);

      // Cerrar el modal y resetear formulario si se proporcionan
      if (onClose) onClose();
      if (reset) reset();
    } catch (error) {
      console.error("Error en la solicitud:", error);
    } finally {
      setLoadingGlobal(false); // Detener indicador de carga
    }
  };
}
