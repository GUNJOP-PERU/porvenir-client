import { cn } from "@/lib/utils";
import { Check, Layers, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import IconClose from "@/icons/IconClose";
import { useState, useRef, useEffect } from "react";
import { ButtonRefresh } from "@/components/ButtonRefresh";

export function FilterItems({
  title,
  options = [],
  field,
  loadingGlobal,
  refetch,
  isFetching,
}) {
  const selectedValues = new Set(field.value || []);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const dropdownRef = useRef(null);

  // Filtro
  const query = searchQuery?.toLowerCase() ?? "";
  const filteredOptions = (options ?? []).filter((option) =>
    String(option).toLowerCase().includes(query)
  );

  const toggleSelection = (value) => {
    const newSet = new Set(selectedValues);
    newSet.has(value) ? newSet.delete(value) : newSet.add(value);
    field.onChange(Array.from(newSet));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDrawer(false);
      }
    };

    if (openDrawer) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDrawer]);

  return (
    <div className="flex border border-input rounded-lg ">
      <ButtonRefresh
        refetch={refetch}
        isFetching={isFetching}
        showText={false}
      />
      <div className="relative">
        <Button
          variant="outline"
          disabled={loadingGlobal || isFetching}
          onClick={() => setOpenDrawer(!openDrawer)}
          type="button"
          className="w-fit border-none pl-3"
        >
          <Layers className="w-4 h-4 text-zinc-400" />
          {title}
          {selectedValues.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-1 h-4" />
              <div className="rounded-sm px-1 font-normal text-zinc-400">
                {selectedValues.size}
              </div>
            </>
          )}
        </Button>

        {openDrawer && (
          <div
            className={`absolute z-50 mt-1 w-[400px] bg-white border border-gray-200 shadow-md rounded-xl animate-in transition-transform duration-300 ${
              openDrawer
                ? "animate-in fade-in-0 zoom-in-95"
                : "animate-out fade-out-0 zoom-out-95"
            }`}
            ref={dropdownRef}
          >
            <div className=" divide-x divide-zinc-200 grid grid-cols-2 p-0">
              <div>
                <div className="flex items-center border-b border-zinc-200 px-3 h-10">
                  <Search className="lucide lucide-search mr-2 h-4 w-4 shrink-0 opacity-50" />
                  <input
                    type="text"
                    className="flex h-10 w-full rounded-lg bg-transparent py-3 text-xs !border-none placeholder:text-zinc-400 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Buscar..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="h-60 overflow-auto p-1">
                  {filteredOptions.length === 0 ? (
                    <div className="text-center text-[10px] text-zinc-400 py-2">
                      No hay resultados
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      {filteredOptions.map((item) => {
                        const isSelected = selectedValues.has(item);

                        return (
                          <div
                            key={item}
                            className="flex items-center px-2 py-1.5 cursor-pointer hover:bg-zinc-100 rounded-lg select-none"
                            onClick={() => toggleSelection(item)}
                          >
                            <div
                              className={cn(
                                "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                isSelected
                                  ? "bg-primary text-white"
                                  : "opacity-50 [&_svg]:invisible text-xs"
                              )}
                            >
                              <Check className="w-3 h-3" />
                            </div>
                            <span className="text-xs">{item}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2 px-3 h-10 border-b border-zinc-200">
                  <Layers className="w-4 h-4 text-zinc-400" />
                  <span className="text-xs text-zinc-600">
                    Seleccionados | {selectedValues.size} |
                  </span>
                </div>

                <div className="h-60 overflow-auto p-1">
                  {selectedValues.size > 0 ? (
                    <div className="flex flex-col">
                      {Array.from(selectedValues).map((value) => (
                        <div
                          key={value}
                          className="flex items-center px-2 py-1.5 cursor-pointer hover:bg-red-50 rounded-lg select-none"
                          onClick={() => toggleSelection(value)}
                        >
                          <div className="mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-rose-500 bg-rose-500 text-white">
                            <IconClose className="w-4 h-4 fill-white" />
                          </div>
                          <span className="text-xs">{value}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-[10px] text-zinc-400 py-2">
                      No hay items seleccionados
                    </div>
                  )}
                </div>
              </div>
            </div>

            {selectedValues.size > 0 && (
              <div className="border-t border-gray-200 p-1 flex justify-center">
                <button
                  onClick={() => field.onChange([])}
                  className="text-red-500 hover:bg-red-50 w-full flex cursor-pointer select-none items-center justify-center rounded-lg px-2 py-1.5 text-xs"
                >
                  <IconClose className="w-4 h-4 mr-1 fill-red-500" /> Limpiar
                  todos los seleccionados
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
