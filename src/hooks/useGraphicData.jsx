import { getDataGraphicRequest } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const useGraphicData = (symbol, endpoint) => {
  // Consulta inicial con React Query
  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboard", symbol],
    queryFn: () => getDataGraphicRequest(endpoint),
    staleTime: Infinity,
    refetchOnReconnect: true,
    keepPreviousData: true,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return { data, isLoading, isError };
};
