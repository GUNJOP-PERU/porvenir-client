/* eslint-disable react/prop-types */
import { useToast } from "@/hooks/useToaster";
import { RefreshCcw } from "lucide-react";
import { useRef, useState } from "react";
import { RiFileExcel2Line } from "react-icons/ri";
import { Button } from "./ui/button";
import readXlsxFile, { readSheetNames } from "read-excel-file";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

/* ================== HELPERS ================== */

const detectHeaderRow = (data, maxRows = 30) => {
  for (let i = 0; i < Math.min(data.length, maxRows); i++) {
    const row = data[i] || [];

    let hasZona = false;
    let hasLabor = false;

    row.forEach((cell) => {
      if (typeof cell !== "string") return;
      const v = cell.trim().toLowerCase();
      if (v === "zona") hasZona = true;
      if (v === "labor" || v === "tajo") hasLabor = true;
    });

    if (hasZona && hasLabor) return i;
  }
  return -1;
};

const findColumn = (headers, names) =>
  headers.findIndex((h) => names.includes(h.toLowerCase()));

const parseDayHeader = (header) => {
  if (!header) return null;

  const clean = String(header).replace(/\s+/g, " ").trim();

  const match = clean.match(/(\d{1,2})\s*(D|N)\b/i);
  if (!match) return null;

  return {
    day: Number(match[1]),
    shift: match[2].toUpperCase(),
  };
};

/* ================== FORM ================== */

const FormSchema = z.object({
  dob: z.object({
    start: z.date(),
    end: z.date(),
  }),
});

/* ================== COMPONENT ================== */

export const ButtonExcel = () => {
  const { addToast } = useToast();

  const [loading, setLoading] = useState(false);
  const [availableSheets, setAvailableSheets] = useState([]);
  const [selectedSheet, setSelectedSheet] = useState("");
  const [pendingFile, setPendingFile] = useState(null);

  const [dataHotTable, setDataHotTable] = useState([]);
  const [detectedHeaders, setDetectedHeaders] = useState([]);
  const [columnMap, setColumnMap] = useState({});

  const [dayColumns, setDayColumns] = useState([]);

  const fileInputRef = useRef(null);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      dob: {
        start: new Date(2025, 0, 1), // 29 enero 2025
        end: new Date(2025, 1, 7), // 4 febrero 2025
      },
    },
  });

  /* ========= STEP 1: FILE SELECT ========= */

  const handleFileSelected = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const sheets = await readSheetNames(file);
      setPendingFile(file);
      setAvailableSheets(sheets);
      setSelectedSheet(sheets[0]);
    } catch {
      addToast({
        title: "Error",
        message: "No se pudieron leer las hojas del archivo",
        variant: "destructive",
      });
    }
  };

  /* ========= STEP 2: PROCESS SHEET ========= */

  const handleConfirmSheet = async () => {
    if (!pendingFile || !selectedSheet) return;

    setLoading(true);

    try {
      const data = await readXlsxFile(pendingFile, {
        sheet: selectedSheet,
      });

      const headerRowIndex = detectHeaderRow(data);
      if (headerRowIndex === -1) {
        throw new Error("No se pudo detectar la fila de encabezados");
      }

      /* ===== AQUI EMPIEZA OPCIÓN 1 ===== */

      // 1. HEADERS (aunque estén vacíos)
      const headers = data[headerRowIndex].map((h, i) =>
        h ? String(h).trim() : `Columna ${i + 1}`,
      );

      // === DETECCIÓN AUTOMÁTICA DE COLUMNAS DE DÍAS ===
      // === DETECCIÓN AUTOMÁTICA DE COLUMNAS DE DÍAS ===
      const { dob } = form.getValues();
      const startDay = dayjs(dob.start).date(); // 29
      const endDay = dayjs(dob.end).date(); // 4

      const detectedDayColumns = headers
        .map((h, index) => {
          if (!h) return null;

          // Extraer el número del header, por ejemplo "Suma de 29D" => 29
          const match = String(h).match(/(\d{1,2})\s*(D|N)/i);
          if (!match) return null;

          const day = Number(match[1]);
          const shift = match[2].toUpperCase();

          // Acomodar el rango de días cuando cruza de un mes a otro
          const inRange =
            startDay <= endDay
              ? day >= startDay && day <= endDay
              : day >= startDay || day <= endDay; // si empieza 29 y termina 4, toma 29,30,31,1,2,3,4

          if (!inRange) return null;

          return {
            index,
            label: h,
            day,
            shift,
          };
        })
        .filter(Boolean);

      setDayColumns(detectedDayColumns);

      console.log("DAY COLUMNS DETECTADAS:", detectedDayColumns);

      // 2. DATA REAL (FILAS)
      const rows = data.slice(headerRowIndex + 1);

      // 3. GUARDAS TODO
      setDetectedHeaders(headers);
      setDataHotTable(rows);

      // 4. PARA VER EN CONSOLA
      console.log("HEADERS DETECTADOS:", headers);
      console.log("DATA CRUDA:", rows);

      /* ===== AQUI TERMINA OPCIÓN 1 ===== */

      // DATA FINAL = filas debajo del header
      const finalData = data.slice(headerRowIndex + 1);

      // GUARDAS LA DATA (ESTADO QUE YA TENÍAS)
      setDataHotTable(finalData);

      // SI QUIERES VERLA
      console.log("DATA FINAL:", finalData);

      addToast({
        title: "Importación exitosa",
        message: `Encabezados detectados en fila ${headerRowIndex + 1}`,
        variant: "success",
      });
    } catch (error) {
      addToast({
        title: "Error de importación",
        message: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setAvailableSheets([]);
      setPendingFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  /* ========= UI ========= */

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileSelected}
        className="hidden"
      />

      <Button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={loading}
        className="bg-green-600 hover:bg-green-500"
      >
        <RiFileExcel2Line className="size-4 text-white mr-2" />
        Importar Excel
      </Button>

      {availableSheets.length > 0 && (
        <div className="mt-3 flex gap-2 items-center">
          <select
            value={selectedSheet}
            onChange={(e) => setSelectedSheet(e.target.value)}
            className="border rounded px-2 py-1"
          >
            {availableSheets.map((sheet) => (
              <option key={sheet} value={sheet}>
                {sheet}
              </option>
            ))}
          </select>

          <Button onClick={handleConfirmSheet} disabled={loading}>
            Confirmar hoja
          </Button>
        </div>
      )}

      {detectedHeaders.length > 0 && (
        <div className="mt-4 border p-3 rounded">
          <h4 className="font-semibold mb-2">Asignar columnas base</h4>

          {["zona", "labor", "fase"].map((field) => (
            <div key={field} className="flex gap-2 mb-2 items-center">
              <span className="w-20 capitalize">{field}</span>

              <select
                value={columnMap[field] ?? ""}
                onChange={(e) =>
                  setColumnMap((prev) => ({
                    ...prev,
                    [field]: Number(e.target.value),
                  }))
                }
                className="border rounded px-2 py-1"
              >
                <option value="">Seleccione columna</option>
                {detectedHeaders.map((h, i) => (
                  <option key={i} value={i}>
                    {h}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}

      <Button
        onClick={() => {
          if (
            columnMap.zona == null ||
            columnMap.labor == null ||
            columnMap.fase == null
          ) {
            addToast({
              title: "Faltan datos",
              message: "Debe asignar columnas base",
              variant: "destructive",
            });
            return;
          }

          const finalData = dataHotTable
            .map((row) => {
              const zona = row[columnMap.zona];
              const labor = row[columnMap.labor];
              const fase = row[columnMap.fase];

              if (!zona || !labor) return null;

              const days = {};
              let hasData = false;

              dayColumns.forEach(({ index, label }) => {
                const value = row[index];
                days[label] = value;

                if (value != null && value !== "") {
                  hasData = true;
                }
              });

              // si no hay días detectados, igual devuelve el registro sin days
              return {
                zona,
                labor,
                fase,
                days: Object.keys(days).length ? days : undefined,
              };
            })
            .filter(Boolean);

          console.log("DATA FINAL CON DÍAS:", finalData);
        }}
      >
        Procesar data
      </Button>
    </>
  );
};

export const ButtonRefresh = ({ refetch, isFetching, showText = true, className }) => {
  const loadingState = isFetching;

  return (
    <>
      <Button
        onClick={() => refetch()}
        disabled={isFetching}
        className={`flex items-center gap-2 bg-blue-500/[0.08] text-blue-500  hover:bg-blue-500 hover:text-white ease-in-out transition-all duration-500 !min-w-9 md:!min-w-[10px] px-2 md:px-3 border-none h-8 ${className}`}
        type="button"
      >
        <RefreshCcw
          className={`size-3.5 ${loadingState ? "animate-spin" : ""}`}
        />
        {showText && (
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            {loadingState ? "Cargando" : "Recargar"}
          </span>
        )}
      </Button>
    </>
  );
};
