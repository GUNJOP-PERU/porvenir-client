import { getDataGraphicRequest } from "@/api/api";
import { useQuery } from "@tanstack/react-query";

export const useGraphicData = (symbol, endpoint,keyPrefix = "dashboard") => {

  const { data, isLoading, isError, error } = useQuery({
    queryKey: [keyPrefix, symbol],
    queryFn: getDataGraphicRequest.bind(null, endpoint),
    // staleTime: Infinity,
    // cacheTime: Infinity,
    refetchOnReconnect: false,
    // refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 1, 
    retryDelay: 2000, 
  });

  return { data, isLoading, isError, error };
};

export function useFetchGraphicData({ queryKey, endpoint,filters }) {
  return useQuery({
    queryKey: ["dashboard", queryKey, { filters }],
    queryFn: () => getDataGraphicRequest(`${endpoint}?${filters}`),
    //  staleTime: Infinity,
    // cacheTime: Infinity,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    //  refetchOnMount: false,
    retry: 1, 
    retryDelay: 2000,
  });
}
export function useFetchDataRealtime({ queryKey, endpoint }) {
  return useQuery({
    queryKey,
    queryFn: () => getDataGraphicRequest(endpoint),
    //  staleTime: Infinity,
    // cacheTime: Infinity,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    //  refetchOnMount: false,
    retry: 1, 
    retryDelay: 2000,
  });
}
