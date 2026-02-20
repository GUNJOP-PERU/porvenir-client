import { useState, useMemo } from "react";

/**
 * Hook para manejar el filtrado por pestañas de forma automática.
 * Soporta múltiples campos, contadores opcionales y etiquetas personalizadas.
 *
 * @param {Array} data - El array de datos a filtrar.
 * @param {string|Array} field - Nombre del campo o campos por los cuales filtrar.
 * @param {Object} options - Opciones adicionales (allLabel, showCount).
 */
export function useTabsFilter(data, field, options = {}) {
  const { allLabel = "todas", showCount = false } = options;

  const [activeTab, setActiveTab] = useState(allLabel);

  const fields = useMemo(
    () => (Array.isArray(field) ? field : [field]),
    [field],
  );

  const safeData = useMemo(() => data ?? [], [data]);

  // Extraer valores únicos de los campos indicados
  const items = useMemo(() => {
    if (safeData.length === 0) return [allLabel];

    const values = safeData.flatMap((item) =>
      fields
        .map((f) => item[f])
        .filter((val) => val != null && String(val).trim() !== ""),
    );

    const unique = [...new Set(values)].sort();
    return [allLabel, ...unique];
  }, [safeData, fields, allLabel]);

  // Filtrar la data según el tab activo
  const filteredData = useMemo(() => {
    if (activeTab === allLabel) return safeData;
    return safeData.filter((item) => fields.some((f) => item[f] === activeTab));
  }, [safeData, activeTab, fields, allLabel]);

  // Calcular contadores por cada tab si se habilita la opción
  const countByTab = useMemo(() => {
    if (!showCount) return {};
    return items.reduce((acc, tab) => {
      acc[tab] =
        tab === allLabel
          ? safeData.length
          : safeData.filter((item) => fields.some((f) => item[f] === tab))
              .length;
      return acc;
    }, {});
  }, [items, safeData, fields, allLabel, showCount]);

  return {
    activeTab,
    setActiveTab,
    items,
    filteredData,
    countByTab,
  };
}
