import { getDataRequest } from "@/lib/api";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

export function useFetchData(queryKey, endpoint) {
  return useQuery({
    queryKey: [queryKey],
    queryFn: () => getDataRequest(endpoint),
    networkMode: "always",
    refetchOnReconnect: true,
    retry: 2, // Intentará 2 veces antes de fallar
    retryDelay: 2000, // Espera 2s entre intentos
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    select: (response) => {
      return response.data;
    },
  });
}

export function useFetchInfinityScroll(queryKey, endpoint, limit = 12) {
  return useInfiniteQuery({
    queryKey: [queryKey],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await getDataRequest(`${endpoint}?page=${pageParam}&limit=${limit}`);
      return response;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.data.page < lastPage.data.total_pages ? lastPage.data.page + 1 : undefined;
    },
    networkMode: "always",
    refetchOnReconnect: true,
    retry: 2,
    retryDelay: 2000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    select: (data) => {
      // Aquí aplanamos los datos correctamente con el doble `.data`
      return data.pages.map(page => page.data.data).flat() || [];
    },
  });
}
