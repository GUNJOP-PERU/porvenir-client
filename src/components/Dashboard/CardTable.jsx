import React, { useMemo, useCallback } from "react";

export default function CardTable({ data }) {
  const hasData = useMemo(() => data?.data?.length > 0, [data]);

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
      ? `${row[header.id]?.toFixed(2)}h`
      : header.type === "code"
      ? `${row[header.id]} d`
      : row[header.id] || "-"; // Si el dato es null o undefined
  }, []);

  const memoizedRows = useMemo(() => {
    return hasData ? (
      data.data.map((row, index) => (
        <tr key={index} className="even:bg-zinc-100/50">
          {data?.headers?.map((header) => {
            if (header.id === "id" || header.id === "code_activity")
              return null;
            return (
              <td
                key={header.id}
                className="px-4 py-2 first:rounded-l-lg last:rounded-r-lg"
              >
                {getCellValue(row, header)}
              </td>
            );
          })}
        </tr>
      ))
    ) : (
      <tr>
        <td
          colSpan={data?.headers?.length || 1}
          className="text-center text-[10px] text-gray-400 py-4"
        >
          No hay datos disponibles
        </td>
      </tr>
    );
  }, [data, hasData, getCellValue]);

  return (
    <div className="overflow-y-auto h-[170px] md:h-[170px]">
      <table className="min-w-full table-auto border-collapse rounded-lg">
        <thead className="text-[10px] bg-zinc-100 text-zinc-400 sticky top-0">
          <tr>
            {data?.headers?.map((header) => {
              if (header.id === "id" || header.id === "code_activity")
                return null;
              return (
                <th
                  key={header.id}
                  className="px-4 py-2 text-left first:rounded-l-lg last:rounded-r-lg"
                >
                  {header.label}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="text-xs">{memoizedRows}</tbody>
      </table>
    </div>
  );
}
