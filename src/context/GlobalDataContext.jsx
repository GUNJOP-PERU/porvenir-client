import { createContext, useContext, useEffect } from "react";
import { useAuthStore } from "@/store/AuthStore";
// Api
import { getDataRequest } from "@/api/api";
import { useState, useCallback, useRef } from "react";

const GlobalDataContext = createContext();

export const GlobalDataProvider = ({ children }) => {
  const isAuth = useAuthStore((state) => state.isAuth);
  const [data, setData] = useState({
    globalMineral: [
      { id: "683e2381b2f9cfb7b396170c", name: "Mineral", isActive: true, value:42 }
    ],
    activityAverage: [
      { id: "6840796fb2f9cfb7b396185e", name: "Viaje Vacío", minDuration: 0, maxDuration: 3600 }
    ]
  });
  const lastRequest = useRef({ endpoint: null, params: null });

  const fetchMineralData = useCallback(async (endpoint, params) => {
    try {
      lastRequest.current = { endpoint, params };
      const response = await getDataRequest(endpoint, params);
      setData((values) => ({...values, globalMineral: response.data}));
      return response;
    } catch (error) {
      setData(null);
      throw error;
    }
  }, []);

  const fetchActivityAverageData = useCallback(async (endpoint, params) => {
    try {
      lastRequest.current = { endpoint, params };
      const response = await getDataRequest(endpoint, params);
      setData((values) => ({...values, activityAverage: response.data}));
      return response;
    } catch (error) {
      setData(null);
      throw error;
    }
  }, []);

  const refreshGlobalData = useCallback(async () => {
    fetchMineralData("mineral?isActive=active");
    fetchActivityAverageData("activity-config?isActive=active");
  }, [fetchMineralData, fetchActivityAverageData]);

  const clearData = useCallback(() => setData(null), []);

  useEffect(() => {
    if (isAuth) {
      fetchMineralData("mineral?isActive=active").catch((error) => {
        console.error("Error fetching global mineral data:", error);
      });
      fetchActivityAverageData("activity-config?isActive=active").catch((error) => {
        console.error("Error fetching activity config data:", error);
      });
    }
  },[isAuth, fetchMineralData, fetchActivityAverageData]);

  return (
    <GlobalDataContext.Provider value={{ data, setData, fetchMineralData, refreshGlobalData, clearData }}>
      {children}
    </GlobalDataContext.Provider>
  )
};

// Hook para acceder al contexto global de datos
export const useGlobalData = () => useContext(GlobalDataContext);
