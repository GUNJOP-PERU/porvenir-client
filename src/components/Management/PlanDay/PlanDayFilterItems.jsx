import { cn } from "@/lib/utils";
import { Check, Layers, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import IconClose from "@/icons/IconClose";
import { useState, useRef, useEffect } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

export function FilterItems({ title, options = [], field, loadingGlobal }) {
  const selectedValues = new Set(field.value || []);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const parentRef = useRef(null);

  // Filtrar opciones basadas en la búsqueda
  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const dropdownRef = useRef(null);

  const toggleSelection = (value) => {
    const newSet = new Set(selectedValues);
    if (newSet.has(value)) {
      newSet.delete(value);
    } else {
      newSet.add(value);
    }
    field.onChange(Array.from(newSet));
  };

  const virtualizer = useVirtualizer({
    count: filteredOptions.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 32,
    overscan: 5,
  });

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
    <div className="relative">
      <Button
        variant="outline"
        disabled={loadingGlobal}
        onClick={() => setOpenDrawer(!openDrawer)}
        type="button"
        className="w-fit"
      >
        <Layers className="w-4 h-4" />
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
          className={`absolute z-50 mt-2 w-48 bg-white border border-gray-200 shadow-md rounded-xl animate-in transition-transform duration-300 ${
            openDrawer
              ? "animate-in fade-in-0 zoom-in-95"
              : "animate-out fade-out-0 zoom-out-95"
          }`}
          ref={dropdownRef}
        >
          <div className="flex items-center border-b px-3">
            <Search className="lucide lucide-search mr-2 h-4 w-4 shrink-0 opacity-50" />
            <input
              type="text"
              className="flex h-10 w-full rounded-lg bg-transparent py-3 text-xs outline-none placeholder:text-zinc-400 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="max-h-60 overflow-auto p-1" ref={parentRef}>
            {filteredOptions.length === 0 ? (
              <div className="text-center text-xs text-zinc-400 py-2">
                No hay resultados
              </div>
            ) : (
              <div
                className="flex flex-col"
                style={{
                  position: "relative",
                }}
              >
                {virtualizer.getVirtualItems().map((virtualRow, index) => {
                  const item = filteredOptions[virtualRow.index];
                  const isSelected = selectedValues.has(item.name);

                  return (
                    <div
                      key={item.name}
                      ref={virtualizer.measureElement}
                      className="flex items-center px-2 py-1.5 cursor-pointer hover:bg-gray-100 rounded-lg"
                      onClick={() => toggleSelection(item.name)}
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
                      <span className="text-xs">{item.name}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {selectedValues.size > 0 && (
            <div className="border-t border-gray-200 p-1 flex justify-center">
              <button
                onClick={() => field.onChange([])}
                className="text-red-500 hover:bg-red-50 w-full flex cursor-pointer select-none items-center justify-center rounded-lg px-2 py-1.5 text-xs"
              >
                <IconClose className="w-4 h-4 mr-1 fill-red-500" /> Limpiar
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
