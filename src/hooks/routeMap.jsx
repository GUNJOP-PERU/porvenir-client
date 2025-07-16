export const createRouteMap = (queryClient) => {
  // 🛠️ Definir tópicos que solo actualizan la caché sin lógica extra
  const simpleTopics = {
    //CheckList Message
    "checklist/alert": [],
    //CardGuage
    "progress-shift": ["shift-variable", "progress-shift"],
    //Page Truck
    "truck-progress-day": ["shift-variable", "truck-progress-day"],
    "truck-heatmap": ["shift-variable", "truck-heatmap"],
    "truck-job-cycle": ["shift-variable", "truck-job-cycle"],
    "truck-chart-productivity": ["shift-variable", "truck-chart-productivity"],
    "truck-chart-fleet": ["shift-variable", "truck-chart-fleet"],

    //Page Scoop
    "scoop-progress-day": ["shift-variable", "scoop-progress-day"],
    "scoop-tonnage-per-hour": ["shift-variable", "scoop-tonnage-per-hour"],
    //Page Timeline-Truck
    "truck-activities-per-hour": [
      "shift-variable",
      "truck-activities-per-hour",
    ],
    //Page Timeline-Scoop
    "scoop-activities-per-hour": [
      "shift-variable",
      "scoop-activities-per-hour",
    ],

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
        queryClient.invalidateQueries({
          queryKey: ["crud", "workOrder"],
          exact: false,
        });
        queryClient.refetchQueries({ queryKey: ["crud", "workOrder"] });
        console.log("🔄 Ejecutado...");
        return oldData;
      }

      return { ...oldData, pages: updatedPages };
    });
  };
  const addItemToCache = (queryKey, newItem) => {
    queryClient.setQueryData(queryKey, (oldData) => {
      if (!oldData || !oldData.pages) return oldData;

      let itemExists = false;

      const updatedPages = oldData.pages.map((page) => {
        if (!page.data?.data) return page;

        if (page.data.data.some((item) => item._id === newItem._id)) {
          itemExists = true;
        }

        return page;
      });

      if (itemExists) {
        console.log("✅ Ya existe en caché. No se agrega.");
        return oldData;
      }

      // Agregar al principio de la primera página
      const firstPage = updatedPages[0];
      const newFirstPage = {
        ...firstPage,
        data: {
          ...firstPage.data,
          data: [newItem, ...firstPage.data.data],
        },
      };

      const newPages = [newFirstPage, ...updatedPages.slice(1)];

      console.log("➕ Agregado a la caché.");
      return { ...oldData, pages: newPages };
    });
  };
  const addItemsToCache = (queryKey, newItems) => {
    queryClient.setQueryData(queryKey, (oldData) => {
      if (!oldData || !oldData.pages) return oldData;
  
      const seen = new Set();
      const existingIds = new Set();
  
      oldData.pages.forEach((page) => {
        page.data?.data?.forEach((item) => {
          if (item._id) existingIds.add(item._id);
        });
      });
  
      const filteredNewItems = newItems.filter(
        (item) => item._id && !existingIds.has(item._id)
      );
  
      if (filteredNewItems.length === 0) {
        console.log("✅ Todas las actividades ya existen en caché.");
        return oldData;
      }
  
      const firstPage = oldData.pages[0];
      const newFirstPage = {
        ...firstPage,
        data: {
          ...firstPage.data,
          data: [...filteredNewItems, ...firstPage.data.data],
        },
      };
  
      const newPages = [newFirstPage, ...oldData.pages.slice(1)];
  
      console.log(`➕ ${filteredNewItems.length} nuevas actividades agregadas al caché.`);
      return { ...oldData, pages: newPages };
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
    "activity-created": (data) => addItemsToCache(["crud", "activityTruck"], data),
    "truck-cycle": (data) => addItemToCache(["crud", "cycleTruck"], data),
    "scoop-cycle": (data) => addItemToCache(["crud", "cycleScoop"], data),
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
        console.log("🧹 La jornada ha cambiado. Limpiando 'shift-variable'...");
        const queries = queryClient.getQueriesData({
          queryKey: ["shift-variable"],
          exact: false,
        });

        queries.forEach(([key]) => {
          queryClient.setQueryData(key, []);
        });
        queryClient.refetchQueries({
          queryKey: ["shift-variable", "list-fleet-truck"],
        });
      } else {
        console.log("ℹ️ No se requiere limpieza de 'shift-variable'");
      }
    },
    "list-fleet": (data) => {
      console.log("fleet", data);
      if (data.type === "truck") {
        console.log("truck");
        queryClient.setQueryData(
          ["shift-variable", "list-fleet-truck"],
          (oldData) => {
            if (!oldData) return oldData;
            // Buscar y reemplazar el objeto con el mismo id
            const updatedData = oldData.map((item) =>
              item.id === data.id ? { ...item, ...data } : item
            );
            return updatedData;
          }
        );
      }
      if (data.type === "scoop") {
        console.log("scoop");
        queryClient.setQueryData(
          ["shift-variable", "list-fleet-scoop"],
          (oldData) => {
            if (!oldData) return oldData;
            // Buscar y reemplazar el objeto con el mismo id
            const updatedData = oldData.map((item) =>
              item.id === data.id ? { ...item, ...data } : item
            );
            return updatedData;
          }
        );
      } else {
        console.log("ℹ️ No se encuentra'");
      }
    },
    "scoop-events-table": (newData) => {
      queryClient.setQueryData(
        ["shift-variable", "scoop-events"],
        (oldState) => {
          console.log("📊 Estado previo:", oldState);

          const prevData = oldState?.data || [];
          const newEventItem = newData.data;

          // Buscar si el id ya existe en `data`
          const existingIndex = prevData.findIndex(
            (item) => item.id === newEventItem.id
          );

          let updatedData;
          if (existingIndex !== -1) {
            // Si ya existe, reemplazamos el objeto en su posición
            updatedData = [...prevData];
            updatedData[existingIndex] = newEventItem;
          } else {
            // Si no existe, lo agregamos al final
            updatedData = [...prevData, newEventItem];
          }

          return {
            ...oldState,
            data: updatedData, // Solo actualizamos `data`, dejando `headers` intacto
          };
        }
      );
    },
  };
};
