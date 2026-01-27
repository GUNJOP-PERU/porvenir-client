export const createRouteMap = (queryClient) => {
  // 🛠️ Definir tópicos que solo actualizan la caché sin lógica extra
  const simpleTopics = {
    //Page Production Extract
    "cycle-current-shift-list": ["dashboard", "production-extract-realtime"],
  };

  const updateWorkOrder = (newData) => {
    // console.log("📩 Datos recibidos:", newData);
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

      console.log(
        `➕ ${filteredNewItems.length} nuevas actividades agregadas al caché.`
      );
      return { ...oldData, pages: newPages };
    });
  };
  const updateItemToCache = (queryKey, updatedItem) => {
    queryClient.setQueryData(queryKey, (oldData) => {
      if (!oldData || !oldData.pages) return oldData;

      const newPages = oldData.pages.map((page) => {
        const updatedData = page.data?.data?.map((item) => {
          if (item._id === updatedItem._id) {
            return { ...item, ...updatedItem }; // 🔄 fusiona con el nuevo
          }
          return item;
        });

        return {
          ...page,
          data: {
            ...page.data,
            data: updatedData,
          },
        };
      });

      console.log(`✏️ Actividad ${updatedItem._id} actualizada en caché.`);
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
  };
};
