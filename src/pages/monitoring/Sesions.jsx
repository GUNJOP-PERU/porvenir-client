import { useState, useMemo } from "react";
import { columns } from "@/components/Monitoring/Sessions/SessionsColumns";
import PageHeader from "@/components/PageHeader";
import { DataTable } from "@/components/Table/DataTable";
import { useFetchData } from "@/hooks/useGlobalQuery";
import { countItems } from "@/lib/utilsGeneral";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useHandleFormSubmit } from "@/hooks/useMutation";

// --- HELPERS ---
const normalizeMac = (mac) =>
  String(mac || "")
    .trim()
    .toUpperCase()
    .replace(/-/g, ":");

const getDefaultDateRange = () => {
  const now = new Date();
  const start = new Date(now);
  const end = new Date(now);
  if (now.getHours() >= 7 && now.getHours() < 19) {
    start.setHours(7, 0, 0, 0);
    end.setHours(19, 0, 0, 0);
  } else {
    if (now.getHours() < 7) {
      start.setDate(start.getDate() - 1);
      start.setHours(19, 0, 0, 0);
      end.setHours(7, 0, 0, 0);
    } else {
      start.setHours(19, 0, 0, 0);
      end.setDate(end.getDate() + 1);
      end.setHours(7, 0, 0, 0);
    }
  }
  return { start, end };
};

const toDateTimeLocal = (date) => {
  const pad = (n) => String(n).padStart(2, "0");
  const y = date.getFullYear();
  const m = pad(date.getMonth() + 1);
  const d = pad(date.getDate());
  const h = pad(date.getHours());
  const min = pad(date.getMinutes());
  return `${y}-${m}-${d}T${h}:${min}`;
};

export default function Sesions() {
  const defaultRange = useMemo(() => getDefaultDateRange(), []);
  const handleFormSubmit = useHandleFormSubmit();

  // -- ESTADOS --
  const [filters, setFilters] = useState({
    unitId: "all",
    location: "all",
    dateStart: toDateTimeLocal(defaultRange.start),
    dateEnd: toDateTimeLocal(defaultRange.end),
  });
  const [viewRegrouped, setViewRegrouped] = useState(true);
  const [editingSession, setEditingSession] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Catálogos
  const { data: trucks = [] } = useFetchData("trucks", "trucks", {
    useSecondary: true,
    staleTime: Infinity,
  });
  const { data: beacons = [] } = useFetchData("beacon", "beacons", {
    useSecondary: true,
    staleTime: Infinity,
  });
  const { data: waps = [] } = useFetchData("wifi", "wifis", {
    useSecondary: true,
    staleTime: Infinity,
  });

  // Diccionario de Metadatos (MAC -> Nombre/Operación)
  const macToMetadata = useMemo(() => {
    const names = new Map();
    const ops = new Map();
    beacons.forEach((b) => {
      if (b.mac) {
        const mac = normalizeMac(b.mac);
        names.set(mac, b.nombre || b.mac);
        if (b.operacion) ops.set(mac, b.operacion);
      }
    });
    waps.forEach((w) => {
      if (w.mac) {
        const mac = normalizeMac(w.mac);
        if (!names.has(mac)) names.set(mac, w.nombre || w.mac);
      }
    });
    return { names, ops };
  }, [beacons, waps]);

  const locationOptions = useMemo(() => {
    const locations = new Set();
    beacons.forEach((b) => {
      if (b.location) locations.add(b.location);
    });
    waps.forEach((w) => {
      if (w.location) locations.add(w.location);
    });
    return Array.from(locations).sort();
  }, [beacons, waps]);

  // Query a la API
  const queryParams = useMemo(() => {
    const startMs = filters.dateStart
      ? new Date(filters.dateStart).getTime()
      : "";
    const endMs = filters.dateEnd ? new Date(filters.dateEnd).getTime() : "";
    const uId = filters.unitId === "all" ? undefined : filters.unitId;
    const loc = filters.location === "all" ? undefined : filters.location;

    let url = `sessions?dateStart=${startMs}&dateEnd=${endMs}&regrouped=${viewRegrouped}`;
    if (uId) url += `&unitId=${uId}`;
    if (loc) url += `&location=${loc}`;
    return url;
  }, [filters, viewRegrouped]);

  const {
    data = [],
    isFetching,
    isLoading,
    isError,
    refetch,
  } = useFetchData(
    ["sessions", filters.dateStart, filters.dateEnd, viewRegrouped],
    queryParams,
    {
      useSecondary: true,
    }
  );

  // Procesamiento de Datos (Resolución de Metadatos + Filtrado)
  const processedData = useMemo(() => {
    const mapped = data.map((item) => {
      const mac = normalizeMac(item.address);
      return {
        ...item,
        name:
          item.name?.trim() ||
          macToMetadata.names.get(mac) ||
          item.address ||
          "—",
        operacion: item.operacion?.trim() || macToMetadata.ops.get(mac) || "—",
      };
    });

    return mapped.filter((item) => {
      const matchUnit =
        filters.unitId === "all" || item.unitId === filters.unitId;
      const matchLocation =
        filters.location === "all" || item.location === filters.location;
      return matchUnit && matchLocation;
    });
  }, [data, macToMetadata, filters.unitId, filters.location]);

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Fase 3: Guardar cambios
  const handleSaveEdit = async () => {
    if (!editingSession) return;
    await handleFormSubmit({
      isEdit: true,
      endpoint: "sessions",
      id: editingSession._id || editingSession.id,
      data: {
        name: editingSession.name,
        operacion: editingSession.operacion,
        location: editingSession.location,
      },
      useSecondary: true,
      setLoadingGlobal: setIsSaving,
      onSuccess: () => {
        setEditingSession(null);
        refetch();
      },
    });
  };

  // Columnas Dinámicas (Categoría y Acciones aparecen solo en Modo Crudo)
  const tableColumns = useMemo(() => {
    let base = [...columns];

    if (!viewRegrouped) {
      // 1. Insertar Categoría después de Operación (índice 3)
      base.splice(3, 0, {
        accessorKey: "categoria",
        header: "Categoría",
        cell: ({ getValue }) => {
          const val = getValue();
          if (!val) return "—";
          return (
            <div className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600 uppercase border border-zinc-200 inline-block">
              {val}
            </div>
          );
        },
      });

      // 2. Añadir Acciones al final
      base.push({
        id: "actions",
        header: "Acciones",
        cell: ({ row }) => (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setEditingSession(row.original)}
            className="h-7 w-7"
          >
            <Pencil className="h-4 w-4 text-blue-600" />
          </Button>
        ),
      });
    }

    return base;
  }, [viewRegrouped]);

  return (
    <>
      <PageHeader
        title="Detecciones"
        description="Detecciones de presencia enviadas por las tabletas."
        count={countItems(processedData)}
        refetch={refetch}
        isFetching={isFetching}
      />

      <DataTable
        data={processedData}
        columns={tableColumns}
        isFetching={isFetching}
        isError={isError}
        tableType={"sessions"}
        isLoading={isLoading}
        toolbarContent={
          <div className="flex flex-wrap gap-2 items-end">
            {/* Switch de Reagrupación */}
            <div className="flex items-center gap-2 px-3 h-8 border rounded-md bg-zinc-50 border-dashed hover:bg-zinc-100 transition-colors">
              <input
                type="checkbox"
                checked={!viewRegrouped}
                onChange={(e) => setViewRegrouped(!e.target.checked)}
                id="raw-mode"
                className="cursor-pointer accent-blue-600"
              />
              <label
                htmlFor="raw-mode"
                className="text-[10px] font-bold cursor-pointer select-none"
              >
                Ver tabla original (sin reagrupar)
              </label>
            </div>

            <div className="space-y-0.5">
              <Label className="text-[11px] font-bold">Vehículo</Label>
              <Select
                value={filters.unitId}
                onValueChange={(val) => handleFilterChange("unitId", val)}
              >
                <SelectTrigger className="h-8 text-xs min-w-[150px]">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los vehículos</SelectItem>
                  {trucks.map((t) => (
                    <SelectItem key={t._id} value={t.unitId || t.tag}>
                      {t.tag} {t.plate ? `(${t.plate})` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-0.5">
              <Label className="text-[11px] font-bold">Ubicación</Label>
              <Select
                value={filters.location}
                onValueChange={(val) => handleFilterChange("location", val)}
              >
                <SelectTrigger className="h-8 text-xs min-w-[150px]">
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las ubicaciones</SelectItem>
                  {locationOptions.map((loc) => (
                    <SelectItem key={loc} value={loc}>
                      {loc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-0.5">
              <Label className="text-[11px] font-bold">Inicio</Label>
              <Input
                type="datetime-local"
                value={filters.dateStart}
                onChange={(e) => handleFilterChange("dateStart", e.target.value)}
                className="h-8 text-xs font-mono"
              />
            </div>

            <div className="space-y-0.5">
              <Label className="text-[11px] font-bold">Fin</Label>
              <Input
                type="datetime-local"
                value={filters.dateEnd}
                onChange={(e) => handleFilterChange("dateEnd", e.target.value)}
                className="h-8 text-xs font-mono"
              />
            </div>
          </div>
        }
      />

      {/* Modal de Edición (Fase 3) */}
      <Dialog
        open={!!editingSession}
        onOpenChange={(open) => !open && setEditingSession(null)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="h-4 w-4 text-blue-600" />
              Editar Metadata de Sesión
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-xs">Unidad</Label>
              <div className="col-span-3 font-semibold text-xs">
                {editingSession?.unitId || "—"}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-xs text-zinc-500">Address</Label>
              <div className="col-span-3 font-mono text-[10px] text-zinc-400">
                {editingSession?.address || "—"}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right text-xs">
                Nombre
              </Label>
              <Input
                id="edit-name"
                value={editingSession?.name || ""}
                onChange={(e) =>
                  setEditingSession({ ...editingSession, name: e.target.value })
                }
                className="col-span-3 h-9 text-sm"
                placeholder="Nombre del sensor"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-operacion" className="text-right text-xs">
                Operación
              </Label>
              <Input
                id="edit-operacion"
                value={editingSession?.operacion || ""}
                onChange={(e) =>
                  setEditingSession({
                    ...editingSession,
                    operacion: e.target.value,
                  })
                }
                className="col-span-3 h-9 text-sm"
                placeholder="Área u operación"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-location" className="text-right text-xs text-zinc-500">
                Ubicación
              </Label>
              <Input
                id="edit-location"
                value={editingSession?.location || ""}
                onChange={(e) =>
                  setEditingSession({
                    ...editingSession,
                    location: e.target.value,
                  })
                }
                className="col-span-3 h-9 text-sm bg-zinc-50"
                placeholder="Ubicación técnica"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              disabled={isSaving}
              onClick={() => setEditingSession(null)}
            >
              Cancelar
            </Button>
            <Button onClick={handleSaveEdit} disabled={isSaving}>
              {isSaving ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

