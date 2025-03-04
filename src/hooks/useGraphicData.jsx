import { getDataGraphicRequest } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const useGraphicData = (symbol, endpoint) => {

  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboard", symbol],
    queryFn: getDataGraphicRequest.bind(null, endpoint),
    staleTime: Infinity,
    cacheTime: Infinity,
    refetchOnReconnect: true,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 1, 
    retryDelay: 2000, 
  });

  return { data, isLoading, isError };
};
