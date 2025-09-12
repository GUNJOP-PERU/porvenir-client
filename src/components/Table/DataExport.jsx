import { useState } from "react";
import { FileDown, Loader } from "lucide-react";
import Papa from "papaparse";
import { Button } from "@/components/ui/button";


export function DataExport({
  data,
  fileName = "export",
  disabled = false,
  className = "",
}) {
  const [loading, setLoading] = useState(false);

  const exportToCSV = (fileName) => {
    const csv = Papa.unparse(data, { header: true });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${fileName}-${new Date().toISOString().split("T")[0]}-${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExport = () => {
    setLoading(true);
    setTimeout(() => {
      exportToCSV(fileName);
      setLoading(false);
    }, 1000); // simula 1 segundo de carga
  };

  return (
    <Button
      disabled={disabled || loading}
      type="button"
      onClick={handleExport}
      className={`flex items-center gap-2 bg-custom-500/[0.08] text-custom-500  hover:bg-custom-500 select-none hover:text-white ease-in-out transition-all duration-500 !min-w-9 md:!min-w-[100px] px-0 md:px-3 ${className}`}
    >
      
      {loading ? (
        <>
          <Loader className="size-3  animate-spin" /> 
        </>
      ) : (
        <>
          <FileDown className="size-3" /> 
        </>
      )}
      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
      {loading ? "Cargando" : "Exportar CSV"}
      </span>
    </Button>
  );
}
