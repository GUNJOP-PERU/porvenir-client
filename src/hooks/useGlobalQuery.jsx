import { getDataRequest } from "@/api/api";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

export function useFetchData(queryKey, endpoint) {
  return useQuery({
    queryKey: ["crud",queryKey],
    queryFn: () => getDataRequest(endpoint),
    cacheTime: Infinity,
    staleTime: Infinity,
    refetchOnReconnect: true,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 1, // Intentará 2 veces antes de fallar
    retryDelay: 2000, // Espera 2s entre intentos
    select: (response) => {
      return response.data;
    },
  });
}

export function useFetchInfinityScroll(queryKey, endpoint, limit = 12, filters = "") {
  return useInfiniteQuery({
    queryKey: ["crud",queryKey],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await getDataRequest(`${endpoint}?page=${pageParam}&limit=${limit}&${filters}`);
      return response;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.data.page < lastPage.data.total_pages ? lastPage.data.page + 1 : undefined;
    },
    cacheTime: Infinity,
    staleTime: Infinity,
    refetchOnReconnect: true,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 1,
    retryDelay: 2000,
    select: (data) => {
      // Aquí aplanamos los datos correctamente con el doble `.data`
      return data.pages.map(page => page.data.data).flat() || [];
    },
  });
}

export function useFetchInfinityScrollTruck({ queryKey, endpoint, date, search, shift}) {
  const filters = `vehicle=${search}&shift=${shift}&date=${date}`;

  return useInfiniteQuery({
    queryKey: ["crud", queryKey, { date, search, shift }],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await getDataRequest(
        `${endpoint}?page=${pageParam}&limit=12&${filters}`
      );
      return response;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.data.page < lastPage.data.total_pages ? lastPage.data.page + 1 : undefined;
    },
    cacheTime: Infinity,
    staleTime: 0,
    refetchOnReconnect: true,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 1,
    retryDelay: 2000,
    select: (data) => {
      return data.pages
        .map(page => page.data.data)
        .flat()
        .sort((a, b) => new Date(b.start) - new Date(a.start)) || [];
    },
  });
}