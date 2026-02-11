import { ArrowDownToLine } from "lucide-react";
import { RiFileExcel2Line } from "react-icons/ri";
import { Button } from "../ui/button";
import { getDownloadRequest } from "@/api/api";

export const DataModelExcel = ({
  loadingGlobal = false,
  downloadTemplate,
  title="Plantilla",
}) => {
  const handleDownload = async () => {
    if (!downloadTemplate) return;
    try {
      const response = await getDownloadRequest(downloadTemplate);

      const blob =
        response.data instanceof Blob
          ? response.data
          : new Blob([response.data]);

      const safeTitle = title.replace(/[^\w\d-_]/g, "_");
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `Modelo_${safeTitle}.xlsx`;
      document.body.appendChild(a);
      a.click();

      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("DETALLE DEL ERROR:", err);
      alert("No se pudo descargar: " + err.message);
    }
  };

  return (
    <button
      type="button"
      disabled={loadingGlobal}
      onClick={handleDownload}
      className="bg-green-700 hover:bg-green-800 px-3 flex items-center gap-1 text-xs text-white rounded-s-none rounded-lg h-8"
    >
      <ArrowDownToLine className="size-3 text-white" />
      Descargar Modelo
    </button>
  );
};
