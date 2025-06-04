import { createContext, useContext, useEffect } from "react";
import { useAuthStore } from "@/store/AuthStore";
// Api
import { getDataRequest } from "@/api/api";
import { useState, useCallback, useRef } from "react";

const GlobalDataContext = createContext();

export const GlobalDataProvider = ({ children }) => {
  const isAuth = useAuthStore((state) => state.isAuth);
  const [data, setData] = useState(null);
  const lastRequest = useRef({ endpoint: null, params: null });

  const fetchGlobalData = useCallback(async (endpoint, params) => {
    try {
      lastRequest.current = { endpoint, params };
      const response = await getDataRequest(endpoint, params);
      setData(response);
      return response;
    } catch (error) {
      setData(null);
      throw error;
    }
  }, []);

  const refreshGlobalData = useCallback(async () => {
    const { endpoint, params } = lastRequest.current;
    if (!endpoint) return null;
    return fetchGlobalData(endpoint, params);
  }, [fetchGlobalData]);

  const clearData = useCallback(() => setData(null), []);

  useEffect(() => {
    if (isAuth) {
      fetchGlobalData("mineral?isActive=active").catch((error) => {
        console.error("Error fetching global mineral data:", error);
      });
    }
  },[isAuth, fetchGlobalData])

  return (
    <GlobalDataContext.Provider value={{ data, setData, fetchGlobalData, refreshGlobalData, clearData }}>
      {children}
    </GlobalDataContext.Provider>
  )
};

// Hook para acceder al contexto global de datos
export const useGlobalData = () => useContext(GlobalDataContext);
