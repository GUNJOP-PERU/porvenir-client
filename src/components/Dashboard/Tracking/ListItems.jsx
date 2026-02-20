/* eslint-disable react/prop-types */
import { cn } from "@/lib/utils";
import { Check, Layers, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState, useMemo, useEffect } from "react";
import { ButtonRefresh } from "@/components/ButtonRefresh";
import { useFetchData } from "@/hooks/useGlobalQuery";

export function ListItems({ field, assignedBeacons = [] }) {
  const {
    data: dataBeaconsList,
    refetch: refetchBeaconsList,
    isFetching: isBeaconsListFetching,
  } = useFetchData("beacons", "beacon", {
    enabled: true,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
  });

  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [removedMacs, setRemovedMacs] = useState(() => new Set());

  const originalMacs = useMemo(
    () => new Set(assignedBeacons.map((b) => b.mac).filter(Boolean)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [], // Solo al montar — no recalcular si assignedBeacons cambia por re-render
  );

  const selectedMacs = useMemo(
    () => new Set(Array.isArray(field.value) ? field.value : []),
    [field.value],
  );

  useEffect(() => {
    setRemovedMacs((prev) => {
      const next = new Set(prev);
      originalMacs.forEach((mac) => {
        if (!selectedMacs.has(mac)) {
          next.add(mac);
        } else {
          next.delete(mac);
        }
      });
      return next;
    });
  }, [selectedMacs, originalMacs]);

  const availableOptions = useMemo(() => {
    return (dataBeaconsList ?? []).filter((item) => {
      if (!item?.mac) return false;

      const hasNoLocation =
        item.location === null ||
        item.location === undefined ||
        item.location === "";

      const isRemoved = removedMacs.has(item.mac);

      return hasNoLocation || isRemoved;
    });
  }, [dataBeaconsList, removedMacs]);

  const filteredOptions = useMemo(() => {
    const query = searchQuery.toUpperCase();
    if (!query) return availableOptions;
    return availableOptions.filter(
      (item) =>
        (item.mac ?? "").toUpperCase().includes(query) ||
        (item.ubication ?? "").toUpperCase().includes(query),
    );
  }, [availableOptions, searchQuery]);

  const handleToggle = (mac) => {
    const newSet = new Set(selectedMacs);
    if (newSet.has(mac)) {
      newSet.delete(mac);
    } else {
      newSet.add(mac);
    }
    field.onChange(Array.from(newSet));
  };

  const handleRemove = (mac) => {
    const newSet = new Set(selectedMacs);
    newSet.delete(mac);
    field.onChange(Array.from(newSet));
  };

  return (
    <div className="flex flex-col gap-0.5 w-full">
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-col items-center gap-0.5 px-1">
          <div className="font-bold text-sm leading-none"> MACs asignadas</div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-[10px] text-zinc-400">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400 inline-block" />
              Ya asignado
            </span>
            <span className="flex items-center gap-1 text-[10px] text-zinc-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block" />
              Nuevo
            </span>
          </div>
        </div>

        <div className="flex border border-input rounded-lg">
          <ButtonRefresh
            refetch={refetchBeaconsList}
            isFetching={isBeaconsListFetching}
            showText={false}
            className="rounded-e-none"
          />
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                disabled={isBeaconsListFetching}
                type="button"
                className="w-fit border-none pl-3 rounded-s-none active:scale-100 "
              >
                <Layers className="w-4 h-4 text-zinc-400 mr-1" />
                {selectedMacs.size > 0 ? (
                  <span className="flex items-center gap-1.5">
                    Beacons
                    <span className="h-4 min-w-4 rounded-sm bg-green-500 px-1 text-[9px] font-bold text-white">
                      {selectedMacs.size}
                    </span>
                  </span>
                ) : (
                  "Agregar Beacon"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-[280px] p-0 rounded-xl border shadow-lg bg-white overflow-hidden"
              align="start"
              sideOffset={4}
            >
              {/* Header */}
              <div className="flex items-center gap-1.5 px-3 py-2 border-b border-gray-100 bg-gray-50/60">
                <Layers className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                  Beacons disponibles
                </span>
                {availableOptions.length > 0 && (
                  <span className="ml-auto text-[10px] text-zinc-400">
                    {availableOptions.length} beacon
                    {availableOptions.length !== 1 ? "s" : ""}
                  </span>
                )}
              </div>

              {/* Search */}
              <div className="flex items-center border-b border-gray-100 px-3 h-10">
                <Search className="mr-2 h-4 w-4 opacity-40 shrink-0" />
                <input
                  type="text"
                  className="w-full text-xs outline-none bg-transparent placeholder:text-zinc-400"
                  placeholder="Buscar por MAC o ubicación..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="ml-1 text-zinc-400 hover:text-zinc-600 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>

              {/* List */}
              <div className="max-h-60 overflow-auto p-1">
                {filteredOptions.length === 0 ? (
                  <div className="flex flex-col items-center gap-2 py-6 text-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100">
                      <Layers className="h-4 w-4 text-zinc-300" />
                    </div>
                    <p className="text-[11px] text-zinc-400">
                      {searchQuery
                        ? "Sin resultados para la búsqueda"
                        : "No hay beacons disponibles"}
                    </p>
                  </div>
                ) : (
                  filteredOptions.map((item) => {
                    const isSelected = selectedMacs.has(item.mac);
                    const isRemoved = removedMacs.has(item.mac);
                    return (
                      <div
                        key={item._id}
                        onClick={() => handleToggle(item.mac)}
                        className={cn(
                          "flex items-center gap-2 px-2 py-1.5 cursor-pointer rounded-lg",
                          "transition-colors duration-100 select-none",
                          isSelected
                            ? "bg-zinc-50 hover:bg-zinc-100"
                            : "hover:bg-zinc-100",
                        )}
                      >
                        {/* Checkbox */}
                        <div
                          className={cn(
                            "flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px]",
                            "border transition-all duration-150",
                            isSelected
                              ? "border-green-500 bg-green-500"
                              : "border-zinc-300 bg-white",
                          )}
                        >
                          <Check
                            className={cn(
                              "w-2.5 h-2.5 transition-all duration-150",
                              isSelected
                                ? "text-white opacity-100"
                                : "opacity-0",
                            )}
                          />
                        </div>

                        {/* Info */}
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="text-xs font-mono font-medium text-zinc-800 truncate">
                            {item.mac}
                          </span>
                          {item.ubication && (
                            <span className="text-[10px] text-zinc-400 truncate">
                              {item.ubication}
                            </span>
                          )}
                        </div>

                        {/* Badge: removido esta sesión */}
                        {isRemoved && !isSelected && (
                          <span className="shrink-0 text-[9px] px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-600 font-medium">
                            quitado
                          </span>
                        )}

                        {/* Badge tipo */}
                        {item.type && !isRemoved && (
                          <span className="shrink-0 text-[9px] px-1.5 py-0.5 rounded-md bg-zinc-100 text-zinc-500 font-medium">
                            {item.type}
                          </span>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer: quitar todos */}
              {selectedMacs.size > 0 && (
                <div className="border-t border-gray-100 p-1">
                  <button
                    type="button"
                    onClick={() => field.onChange([])}
                    className="flex w-full items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-[11px] font-medium text-rose-500 hover:bg-rose-50 transition-colors leading-none"
                  >
                    <X className="h-3 w-3" />
                    Quitar todos
                  </button>
                </div>
              )}
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="mt-1 flex flex-wrap content-start gap-1 px-1.5 py-2 bg-zinc-50 border border-input rounded-lg overflow-auto h-36">
        {selectedMacs.size > 0 && (
          <>
            {Array.from(selectedMacs).map((mac) => {
              const wasOriginal = originalMacs.has(mac);
              return (
                <div
                  key={mac}
                  className={cn(
                    "group flex items-center gap-1 px-2 pr-1 py-1 rounded-lg border",
                    "transition-colors hover:border-red-200 hover:bg-red-50 select-none h-7",
                    wasOriginal
                      ? "bg-blue-50 border-blue-200"
                      : "bg-white border-primary/20",
                  )}
                >
                  <div
                    className={cn(
                      "size-1.5 rounded-full shrink-0",
                      wasOriginal ? "bg-blue-400" : "bg-emerald-400",
                    )}
                  />
                  <span className="text-xs font-mono font-medium text-zinc-800 group-hover:text-red-600">
                    {mac}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemove(mac)}
                    title="Quitar beacon"
                    className={cn(
                      "ml-0.5 flex size-[18px] items-center justify-center rounded-sm",
                      "bg-zinc-200 text-zinc-500",
                      "hover:bg-red-500 hover:text-white",
                      "transition-colors",
                    )}
                  >
                    <X className="size-3" />
                  </button>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
