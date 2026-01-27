import { getDataRequest } from "@/api/api";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

export function useFetchData(queryKey, endpoint, options = {}) {
  return useQuery({
    queryKey: ["crud", queryKey],
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
    ...options,
  });
}

export function useFetchInfinityScroll(
  queryKey,
  endpoint,
  limit = 20,
  filters = ""
) {
  return useInfiniteQuery({
    queryKey: ["crud", queryKey, { filters }],
    queryFn: async ({ pageParam = 1 }) => {
      const query = filters
        ? `${endpoint}?page=${pageParam}&limit=${limit}&${filters}`
        : `${endpoint}?page=${pageParam}&limit=${limit}`;

      const response = await getDataRequest(query);
      return response;
    },

    getNextPageParam: (lastPage) => {
      return lastPage.data.page < lastPage.data.total_pages
        ? lastPage.data.page + 1
        : undefined;
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
      return data.pages.map((page) => page.data.data).flat() || [];
    },
  });
}

export function useFetchInfinityScrollTruck({ queryKey, endpoint, filters }) {
  return useInfiniteQuery({
    queryKey: ["crud", queryKey, { filters }],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await getDataRequest(
        `${endpoint}?page=${pageParam}&limit=20&${filters}`
      );
      return response;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.data.page < lastPage.data.total_pages
        ? lastPage.data.page + 1
        : undefined;
    },
    cacheTime: Infinity,
    staleTime: 0,
    refetchOnReconnect: true,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 1,
    retryDelay: 2000,
    select: (data) => {
      return (
        data.pages
          .map((page) => page.data.data)
          .flat()
          .sort((a, b) => new Date(b.start) - new Date(a.start)) || []
      );
    },
  });
}

export function useFetchTrucks({ queryKey, endpoint, filters }) {
  return useQuery({
    queryKey: ["crud", queryKey, { filters }],
    queryFn: async () => {
      const response = await getDataRequest(
        `${endpoint}?limit=1000&${filters}`
      );
      return response;
    },
    cacheTime: Infinity,
    staleTime: 0,
    refetchOnReconnect: true,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 1,
    retryDelay: 2000,
    select: (data) => {
      if (!data?.data) return [];
      return data.data.sort(
        (a, b) => new Date(b.startDate) - new Date(a.startDate)
      );
    },
  });
}
export function useFetchGeneral({ queryKey, endpoint, filters }) {
  return useQuery({
    queryKey: ["crud", queryKey, { filters }],
    queryFn: async () => {
      const response = await getDataRequest(`${endpoint}?${filters}`);
      return response;
    },
    cacheTime: Infinity,
    staleTime: 0,
    refetchOnReconnect: true,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 1,
    retryDelay: 2000,
    select: (data) => {
      if (!data?.data) return [];
      return data.data.sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
      );
    },
  });
}
