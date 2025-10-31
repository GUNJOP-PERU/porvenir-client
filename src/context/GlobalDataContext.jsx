import { createContext, useContext, useEffect } from "react";
import { useAuthStore } from "@/store/AuthStore";
// Api
import { getDataRequest } from "@/api/api";
import { useState, useCallback, useRef } from "react";
import { useChecklistAlert, useJournalChanged } from "@/hooks/useSocketValue";
import { useToast } from "@/hooks/useToaster";

const GlobalDataContext = createContext();

export const GlobalDataProvider = ({ children }) => {
  useJournalChanged();
  useChecklistAlert();
  
  const isAuth = useAuthStore((state) => state.isAuth);
  const { addToast } = useToast();
  const [data, setData] = useState({
    globalMineral: [
      { id: "683e2381b2f9cfb7b396170c", name: "Mineral", isActive: true, value:42 }
    ],
    activityAverage: [
      { id: "6840796fb2f9cfb7b396185e", name: "Viaje Vacío", minDuration: 0, maxDuration: 3600 }
    ],
    truckStatus: []
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

  const fetchTruckStatusData = useCallback(async (endpoint) => {
    try {
      lastRequest.current = { endpoint };
      const response = await getDataRequest(endpoint);

      if(response.data) {
        const lastTruckStats = data.truckStatus;

        const newTruckStats = response.data.map((truck) => ({
          id: truck._id,
          tag: truck.tag,
          status: truck.status,
          arriveDate: truck.arriveDate
        }));

        // Comparar solo si hay datos anteriores
        if(lastTruckStats.length > 0) {
          lastTruckStats.forEach((truck) => {
            const currentTruck = response.data.find((t) => t.tag === truck.tag);
            if(currentTruck && currentTruck.status !== truck.status) {
              switch(currentTruck.status) {
                case "mantenimiento":
                  addToast({
                    title: `El Camion ${truck.tag} entro en mantenimiento`,
                    message: `De ${truck.status} a ${currentTruck.status}`,
                    variant: "destructive",
                  })
                  break;
                case "operativo":
                  addToast({
                    title: `El Camion ${truck.tag} cambio a estado operativo`,
                    message: `De ${truck.status} a ${currentTruck.status}`,
                    variant: "success",
                  });
                  break;
                default:
                  addToast({
                    title: `El Camion ${truck.tag} esta en Mantenimiento Correctivo`,
                    message: `De ${truck.status} a ${currentTruck.status}`,
                    variant: "default",
                  });
                }
            }
          });
        }

        setData((values) => ({
          ...values,
          truckStatus: newTruckStats
        }));
      }

      return response;
    } catch (error) {
      setData(null);
      throw error;
    }
  }, [data.truckStatus, addToast]);

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

  useEffect(() => {
    const interval = setInterval(() => {
      fetchTruckStatusData("beacon-truck").catch((error) => {
        console.error("Error fetching truck status data:", error);
      });
    }, 10000);
    return () => clearInterval(interval);
  },[fetchTruckStatusData])

  return (
    <GlobalDataContext.Provider value={{ data, setData, fetchMineralData, refreshGlobalData, clearData }}>
      {children}
    </GlobalDataContext.Provider>
  )
};

// Hook para acceder al contexto global de datos
export const useGlobalData = () => useContext(GlobalDataContext);
