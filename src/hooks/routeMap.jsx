export const createRouteMap = (queryClient) => {
    // 🛠️ Definir tópicos que solo actualizan la caché sin lógica extra
    const simpleTopics = {
        //CardGuage
      "progress-shift": ["dashboard", "progress-shift"],
      //Page Truck
      "progress-day": ["dashboard", "progress-day"],
      "truck-heatmap": ["dashboard", "truck-heatmap"],
      "truck-job-cycle": ["dashboard", "truck-job-cycle"],
      "truck-chart-productivity": ["dashboard", "truck-chart-productivity"],
      //Page Scoop
      "scoop-progress-day": ["dashboard", "scoop-progress-day"],
      "scoop-tonnage-per-hour": ["dashboard", "scoop-tonnage-per-hour"],
      //Page Timeline-Truck
      "truck-activities-per-hour": ["dashboard", "truck-activities-per-hour"],
      //Page Timeline-Scoop
      "scoop-activities-per-hour": ["dashboard", "scoop-activities-per-hour"],
      //Page Pareto-Truck
      "pareto-truck-progress-monthly": ["dashboard", "pareto-truck-progress-monthly"],
      "pareto-truck-no-productive-activities": ["dashboard", "pareto-truck-no-productive-activities"],
      "pareto-truck-improductive-activities": ["dashboard", "pareto-truck-improductive-activities"],
      "pareto-truck-impact-diagram": ["dashboard", "pareto-truck-impact-diagram"],
      //Page Pareto-Scoop
      "pareto-scoop-progress-monthly": ["dashboard", "pareto-scoop-progress-monthly"],
      "pareto-scoop-improductive-activities": ["dashboard", "pareto-scoop-improductive-activities"],
      "pareto-scoop-impact-diagram": ["dashboard", "pareto-scoop-impact-diagram"],
      "pareto-scoop-no-productive-activities": ["dashboard", "pareto-scoop-no-productive-activities"],
      //Page monthly
      "monthly-progress": ["dashboard", "monthly-progress"],
      "monthly-chart-tonnes": ["dashboard", "monthly-chart-tonnes"],
      //Page Utilization
      "production-chart-utility": ["dashboard", "production-chart-utility"],
      "production-progress-velocity": ["dashboard", "production-progress-velocity"],
    };
  
    return {
      ...Object.fromEntries(
        Object.entries(simpleTopics).map(([topic, path]) => [
          topic,
          (data) => queryClient.setQueryData(path, data),
        ])
      ),
  
      "order-ready": (newData) => {
        console.log("📩 Datos recibidos en 'order-ready':", newData);
        queryClient.setQueryData(["workOrder"], (oldData) => {
          if (!oldData || !oldData.pages) return oldData;
  
          const exists = oldData.pages.some((page) =>
            page.data?.data?.some((order) => order._id === newData._id)
          );
  
          if (!exists) {
            console.log("🔄 No se encontró en cache, invalidando...");
            queryClient.invalidateQueries(["workOrder"]);
            return oldData;
          }
  
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              data: {
                ...page.data,
                data: page.data.data.map((order) =>
                  order._id === newData._id ? { ...order, ...newData } : order
                ),
              },
            })),
          };
        });
      },
      "checklist-ready": (newData) => {
        console.log("📩 Datos recibidos en 'order-ready':", newData);
        queryClient.setQueryData(["workOrder"], (oldData) => {
          if (!oldData || !oldData.pages) return oldData;
  
          const exists = oldData.pages.some((page) =>
            page.data?.data?.some((order) => order._id === newData._id)
          );
  
          if (!exists) {
            console.log("🔄 No se encontró en cache, invalidando...");
            queryClient.invalidateQueries(["workOrder"]);
            return oldData;
          }
  
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              data: {
                ...page.data,
                data: page.data.data.map((order) =>
                  order._id === newData._id ? { ...order, ...newData } : order
                ),
              },
            })),
          };
        });
      },
     
      "monthly-average-journals": (data) => {
        const path = data.equipment === "truck"
          ? ["dashboard", "monthly-average-journals-truck"]
          : ["dashboard", "monthly-average-journals-scoop"];
        queryClient.setQueryData(path, data);
      },
      "production-velocity-analysis": (data) => {
        const path = data.destiny === "parrilla"
          ? ["dashboard", "production-velocity-analysis-parrila"]
          : ["dashboard", "production-velocity-analysis-cancha"];
        queryClient.setQueryData(path, data);
      },
    };
  };
  