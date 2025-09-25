import { getDataRequest } from "@/api/api";
import { useQuery } from "@tanstack/react-query";
import type { UseQueryOptions } from "@tanstack/react-query";

export function useFetchData<T = any>(
  queryKey: string,
  endpoint: string,
  options?: Partial<UseQueryOptions<T, Error, T, readonly unknown[]>>
) {
  return useQuery<T>({
    queryKey: ["crud", queryKey],
    queryFn: async () => {
      const response = await getDataRequest(endpoint);
      return response.data as T;
    },
    staleTime: Infinity,
    refetchOnReconnect: true,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 1,
    retryDelay: 2000,
    ...(options || {}),

  });
}