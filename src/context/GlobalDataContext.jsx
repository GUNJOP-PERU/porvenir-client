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
  const { addToast, addToastTruckStatus } = useToast();
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
        const lastTruckStats = data?.truckStatus ?? [];
        const lastTruckOperative = lastTruckStats.filter(truck => truck.status === "operativo").length;
        const newTruckStats = response.data.map((truck) => ({
          id: truck._id,
          tag: truck.tag,
          status: truck.status,
          arriveDate: truck.arriveDate
        }));
        const newTruckOperative = newTruckStats.filter(truck => truck.status === "operativo").length;

        if(lastTruckStats.length > 0) {
          lastTruckStats.forEach((truck) => {
            const currentTruck = response.data.find((t) => t.tag === truck.tag);
            if(currentTruck && currentTruck.status !== truck.status) {
              const truckNumber = truck.tag.slice(-2);
              switch(currentTruck.status) {
                case "mantenimiento":
                  addToastTruckStatus({
                    title: "Cambio de Estado de Camión",
                    message: `El Camion ${truckNumber} entro en mantenimiento`,
                    variant: "warning",
                  })
                  break;
                case "operativo":
                  addToastTruckStatus({
                    title: "Cambio de Estado de Camión",
                    message: `El Camion ${truckNumber} está operativo`,
                    variant: "success",
                  });
                  break;
                default:
                  addToastTruckStatus({
                    title: "Cambio de Estado de Camión",
                    message: `El Camion ${truckNumber} entro en mantenimiento correctivo`,
                    variant: "destructive",
                  });
                }
            }
          });
        }

        if(newTruckOperative <= 35 && lastTruckOperative !== newTruckOperative) {
          addToast({
            title: "Alerta de Disponibilidad de Flota",
            message: `La flota de camiones operativos es inferior a 35`,
            variant: "destructive",
          });
        } else if(newTruckOperative < 38 && lastTruckOperative !== newTruckOperative) {
          addToast({
            title: "Alerta de Disponibilidad de Flota",
            message: `La flota de camiones operativos es menor a 38`,
            variant: "warning",
          });
        } else if(newTruckOperative >= 38 && lastTruckOperative !== newTruckOperative) {
          addToast({
            title: "Alerta de Disponibilidad de Flota",
            message: `La flota de camiones operativos es superior a 38`,
            variant: "success",
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
  }, [data?.truckStatus, addToast, addToastTruckStatus]);

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
