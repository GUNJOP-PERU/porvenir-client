import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { HotTable } from "@handsontable/react";
import "handsontable/dist/handsontable.full.css";
import { Button } from "../components/ui/button";
import { useGlobalStore } from "@/store/GlobalStore";
import { registerAllModules } from "handsontable/registry";
import { registerLanguageDictionary, esMX } from "handsontable/i18n";
import { postDataRequest } from "../lib/api";
import { FileDown, FileUp, RefreshCcw, Save } from "lucide-react";
import { dataFase } from "../lib/data";
import {useFetchData} from "../hooks/useGlobalQuery";

registerAllModules();
registerLanguageDictionary(esMX);

function EditPage() {

  const { data: dataLaborList, isLoading } = useFetchData("frontLabor", "frontLabor");

  const { id } = useParams(); // Obtener el id de la URL
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [turno, setTurno] = useState(null);

  const hotTableComponent = useRef(null);

  // Obtener el estado global para los datos generados
  const dataGenerate = useGlobalStore((state) => state.dataGenerate);
  const dataGenerateWeek = useGlobalStore((state) => state.dataGenerateWeek);
  const dataGenerateDay = useGlobalStore((state) => state.dataGenerateDay);

  useEffect(() => {
    const findDataById = (id) => {
      return (
        dataGenerate.find((item) => item.id === id) ||
        dataGenerateWeek.find((item) => item.id === id) ||
        dataGenerateDay.find((item) => item.id === id)
      );
    };

    const selectedData = findDataById(id);

    if (selectedData) {
      setData(selectedData.dataHotTable.data);
      setTurno(selectedData.turno);
    } else {
      navigate("/");
    }
  }, [id, dataGenerate, dataGenerateWeek, dataGenerateDay, navigate]);

  // Callback para manejar los cambios en la tabla
  const handleAfterChange = (changes) => {
    if (changes) {
      const newData = [...data]; // Hacer una copia del estado de los datos

      changes.forEach(([row, col, oldValue, newValue]) => {
        newData[row][col] = newValue; // Actualizar los datos con los nuevos valores
      });

      setData(newData); // Actualizar el estado de los datos
    }
  };

  // Función para calcular el total de toneladas
  const calculateTotal = () => {
    if (!data) return 0;

    return data.reduce((total, row) => {
      // Sumar los valores de cada fecha (toneladas)
      const tonnageValues = Object.keys(row)
        .filter((key) => key.match(/^\d{4}-\d{2}-\d{2}$/)) // Solo las claves que son fechas
        .map((fecha) => row[fecha]);

      const rowTotal = tonnageValues.reduce((sum, tonnage) => sum + (tonnage || 0), 0);
      return total + rowTotal;
    }, 0);
  };

  const totalTonnage = calculateTotal();

  const handleSave = () => {
    alert(`Tabla ${id} guardada con éxito!`);
    console.log("Datos Finales:", data);
    // navigate("/");
  };

  const handleCancel = () => {
    navigate("/day");
  };

  if (!data) {
    return <p>Cargando...</p>;
  }

  const handleSendData = async () => {
    const datosFinales = data
      .flatMap((row) => {
        const fechas = Object.keys(row).filter((key) =>
          key.match(/^\d{4}-\d{2}-\d{2}$/)
        );

        return fechas.map((fecha) => ({
          frontLabor: row.labor,
          phase: row.fase,
          date: fecha,
          tonnage: row[fecha],
          shift: turno,
        }));
      });

    console.log("Datos Finales:", datosFinales);

    try {
      const response = await postDataRequest("planDay/many", datosFinales);

      if (response.status >= 200 && response.status < 300) {
        alert("Datos enviados con éxito!");
      } else {
        alert("Error al enviar los datos.");
      }
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      alert("Ocurrió un error al enviar los datos.");
    }
  };

  return (
    <>
      <div className="w-full flex flex-wrap py-4 justify-between">
        <div>
          <h1 className="text-base font-extrabold">
            Planificador Mensual / Noviembre 2024 {id}
          </h1>
          {/* Mostrar el total calculado */}
          <span className="text-2xl font-extrabold">
            {totalTonnage.toLocaleString("es-MX")} tn
          </span>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => fetchUsers()} variant="outline" size="icon">
            <RefreshCcw className="w-5 h-5 text-zinc-400" />
          </Button>
         

          <Button onClick={handleCancel} variant="secondary">
            Cancelar
          </Button>
          <Button onClick={handleSendData} className="w-fit">
            <Save className="w-5 h-5 text-white" />
            Guardar Plan
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-auto w-full">
        <HotTable
          ref={hotTableComponent}
          data={data} // Datos dinámicos para HotTable
          licenseKey="non-commercial-and-evaluation"
          language={esMX.languageCode}
          rowHeaders={true}
          colHeaders={Object.keys(data[0]).filter((key) => key !== "id")}
          columnSorting={true}
          mergeCells={true}
          contextMenu={true}
          readOnly={false}
          height="auto"
          width="auto"
          fixedColumnsStart={1}
          autoWrapRow={true}
          autoWrapCol={true}
          columns={[
            ...Object.keys(data[0])
              .filter((key) => key !== "id") // Excluir `id` de las columnas
              .map((key) => {
                if (key === "labor") {
                  return {
                    title: key,
                    type: "select",
                    selectOptions: dataLaborList?.map((item) => item.name),
                    data: key,
                  };
                } else if (key === "fase") {
                  return {
                    title: key,
                    type: "select",
                    selectOptions: dataFase.map((item) => item.name),
                    data: key,
                  };
                }
                return {
                  title: key,
                  type: key === "fase" || key === "labor" ? "select" : "numeric",
                  data: key,
                  numericFormat: {
                    pattern: "0,0.00",
                    culture: "en-US",
                  },
                };
              }),
          ]}
          afterChange={handleAfterChange} // Pasamos el callback de afterChange
        />
      </div>
   
    </>
  );
}

export default EditPage;
