import React, { useMemo, useCallback } from "react";

export default function CardTable({ data }) {

  const getCellValue = useCallback((row, header) => {
    if (header.id === "time") {
      return (
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-[3px] bg-red-500"></div>
          {row["code_activity"]} - {row["time"]}h
        </div>
      );
    }
    return header.type === "hours"
      ? `${row[header.id].toFixed(2)}h`
      : header.type === "code"
      ? `${row[header.id]} d`
      : row[header.id];
  }, []);

  const memoizedRows = useMemo(() => {
    return data?.data?.map((row, index) => (
      <tr key={index}>
        {data?.headers.map((header) => {
          // Ocultar la columna con id 'id'
          if (header.id === "id" || header.id === "code_activity") return null;

          // Para la columna combinada de 'time' con 'code_activity'
          if (header.id === "time") {
            return (
              <td key={header.id} className="px-4 py-2 border-b">
                {getCellValue(row, header)} {/* Mostrar el tiempo combinado */}
              </td>
            );
          }

          // Renderizar las demás celdas
          return (
            <td key={header.id} className="px-4 py-2 border-b">
              {getCellValue(row, header)}
            </td>
          );
        })}
      </tr>
    ));
  }, [data?.data, data?.headers, getCellValue]); 

  return (
    <>
      {data?.data?.length > 0 ? (
        <div className="overflow-y-auto h-[200px]">
          <table className="min-w-full table-auto border-collapse">
            {/* Cabecera de la tabla */}
            <thead className="text-[10px] bg-zinc-100 text-zinc-400 sticky top-0 shadow-sm">
              <tr>
                {data?.headers.map((header, index) => {
                  // Ocultar la columna con id 'id'
                  if (header.id === "id" || header.id === "code_activity") return null;
                  return (
                    <th key={header.id} className="px-4 py-2 text-left">
                      {header.label}
                    </th>
                  );
                })}
              </tr>
            </thead>
            {/* Cuerpo de la tabla */}
            <tbody className="text-xs">{memoizedRows}</tbody>
          </table>
        </div>
      ) : (
        <p className="mx-auto text-zinc-400 text-[10px] leading-3 max-w-20 text-center">
          No hay datos disponibles
        </p>
      )}
    </>
  );
}
