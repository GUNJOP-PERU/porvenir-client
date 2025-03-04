export const createRouteMap = (queryClient) => {
  // 🛠️ Definir tópicos que solo actualizan la caché sin lógica extra
  const simpleTopics = {
    //CardGuage
    "progress-shift": ["dashboard", "progress-shift"],
    //Page Truck
    "truck-progress-day": ["dashboard", "truck-progress-day"],
    "truck-heatmap": ["dashboard", "truck-heatmap"],
    "truck-job-cycle": ["dashboard", "truck-job-cycle"],
    "truck-chart-productivity": ["dashboard", "truck-chart-productivity"],
    "truck-chart-fleet": ["dashboard", "truck-chart-fleet"],
    //Page Scoop
    "scoop-progress-day": ["dashboard", "scoop-progress-day"],
    "scoop-tonnage-per-hour": ["dashboard", "scoop-tonnage-per-hour"],
    //Page Timeline-Truck
    "truck-activities-per-hour": ["dashboard", "truck-activities-per-hour"],
    //Page Timeline-Scoop
    "scoop-activities-per-hour": ["dashboard", "scoop-activities-per-hour"],
    //Page Pareto-Truck
    "pareto-truck-progress-monthly": [
      "dashboard",
      "pareto-truck-progress-monthly",
    ],
    "pareto-truck-no-productive-activities": [
      "dashboard",
      "pareto-truck-no-productive-activities",
    ],
    "pareto-truck-improductive-activities": [
      "dashboard",
      "pareto-truck-improductive-activities",
    ],
    "pareto-truck-impact-diagram": ["dashboard", "pareto-truck-impact-diagram"],
    //Page Pareto-Scoop
    "pareto-scoop-progress-monthly": [
      "dashboard",
      "pareto-scoop-progress-monthly",
    ],
    "pareto-scoop-improductive-activities": [
      "dashboard",
      "pareto-scoop-improductive-activities",
    ],
    "pareto-scoop-impact-diagram": ["dashboard", "pareto-scoop-impact-diagram"],
    "pareto-scoop-no-productive-activities": [
      "dashboard",
      "pareto-scoop-no-productive-activities",
    ],
    //Page monthly
    "monthly-progress": ["dashboard", "monthly-progress"],
    "monthly-chart-tonnes": ["dashboard", "monthly-chart-tonnes"],
    //Page Utilization
    "production-progress-velocity": [
      "dashboard",
      "production-progress-velocity",
    ],
    "production-chart-utility": ["dashboard", "production-chart-utility"],
  };

  const updateWorkOrder = (newData) => {
    console.log("📩 Datos recibidos:", newData);
    queryClient.setQueryData(["crud", "workOrder"], (oldData) => {
      if (!oldData || !oldData.pages) return oldData;

      let orderExists = false;
      const updatedPages = oldData.pages.map((page) => {
        if (!page.data?.data) return page;

        const updatedOrders = page.data.data.reduce((acc, order) => {
          if (order._id === newData._id) {
            orderExists = true;
            return [{ ...order, ...newData }, ...acc]; // Mueve el actualizado al inicio
          }
          return [...acc, order];
        }, []);

        return { ...page, data: { ...page.data, data: updatedOrders } };
      });

      if (!orderExists) {
        console.log("🔄 No se encontró en caché, invalidando...");
        queryClient.invalidateQueries({ queryKey: ["crud", "workOrder"], exact: false });
        queryClient.refetchQueries({ queryKey: ["crud", "workOrder"] });
        console.log("🔄 Ejecutado...");
        return oldData;
      }

      return { ...oldData, pages: updatedPages };
    });
  };
  return {
    ...Object.fromEntries(
      Object.entries(simpleTopics).map(([topic, path]) => [
        topic,
        (data) => queryClient.setQueryData(path, data),
      ])
    ),

    "order-ready": updateWorkOrder,
    "checklist-ready": updateWorkOrder,
    "monthly-average-journals": (data) => {
      const path =
        data.equipment === "truck"
          ? ["dashboard", "monthly-average-journals-truck"]
          : ["dashboard", "monthly-average-journals-scoop"];
      queryClient.setQueryData(path, data);
    },
    "production-velocity-analysis": (data) => {
      const path =
        data.destiny === "parrilla"
          ? ["dashboard", "production-velocity-analysis-parrila"]
          : ["dashboard", "production-velocity-analysis-cancha"];
      queryClient.setQueryData(path, data);
    },
    "journal-changed": (data) => {
      if (data?.status === true) {
        // ✅ Solo limpiar si `status` es `true`
        console.log("🧹 La jornada ha cambiado. Limpiando 'dashboard'...");
        const queries = queryClient.getQueriesData({
          queryKey: ["dashboard"],
          exact: false,
        });

        queries.forEach(([key]) => {
          queryClient.setQueryData(key, []);
        });
      } else {
        console.log("ℹ️ No se requiere limpieza de 'dashboard'");
      }
    },
  };
};
