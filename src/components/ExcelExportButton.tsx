import React, { useState } from "react";
import * as XLSX from "xlsx";
import { RiFileExcel2Line } from "react-icons/ri";
import { RefreshCcw } from "lucide-react";

interface ExcelExportButtonProps<T = Record<string, unknown>> {
  data: T[];
  filename?: string;
  sheetName?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

function ExcelExportButton<T = Record<string, unknown>>({
  data,
  filename = "export",
  sheetName = "Datos",
  children,
  disabled = false,
}: ExcelExportButtonProps<T>) {
  const [isLoading, setIsLoading] = useState(false);
  const exportToExcel = async () => {
    if (!data || data.length === 0) {
      alert("No hay datos para exportar");
      return;
    }

    try {
      setIsLoading(true);

      await new Promise((res) => setTimeout(res, 1000));
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
      const timestamp = new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/:/g, "-");
      const finalFilename = `${filename}_${timestamp}.xlsx`;
      XLSX.writeFile(workbook, finalFilename);
    } catch (error) {
      console.error("Error al exportar a Excel:", error);
      alert("Error al exportar el archivo Excel");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      className="h-7 mt-auto bg-green-600 text-white inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 ease-in-out duration-300 active:scale-90 disabled:cursor-not-allowed disabled:select-none px-3 py-2 select-none"
      onClick={exportToExcel}
      disabled={isLoading || disabled || !data || data.length === 0}
    >
      {isLoading ? (
        <RefreshCcw className="size-3 animate-spin text-white" />
      ) : (
        <RiFileExcel2Line className="size-3 text-white" />
      )}

      {isLoading ? "Exportando..." : children || "Exportar Excel"}
    </button>
  );
}

export default ExcelExportButton;
