import { getDataRequest } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export function useFetchData(queryKey, endpoint) {
  return useQuery({
    queryKey: [queryKey],
    queryFn: () => getDataRequest(endpoint),
    networkMode: "always",
    select: (response) => {
      return response.data;
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
