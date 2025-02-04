import { getDataRequest } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export function useFetchData(queryKey, endpoint) {
  return useQuery({
    queryKey: [queryKey],
    queryFn: () => getDataRequest(endpoint),
    networkMode: "always",
    refetchOnReconnect: true,
    retry: 2, // Intentará 2 veces antes de fallar
    retryDelay: 2000, // Espera 2s entre intentos
    select: (response) => {
      return response.data.sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
      );
    },
  });
}

export function useFetchDashboardData(queryKey, endpoint) {
  return useQuery({
    queryKey: [queryKey],
    queryFn: () => getDataRequest(endpoint),
    networkMode: "always",
    select: (response) => {
      return response.data;
    },
  });
}
