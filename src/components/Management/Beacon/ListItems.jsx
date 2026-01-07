import { cn } from "@/lib/utils";
import { Check, Layers, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect, useMemo } from "react";
import { ButtonRefresh } from "@/components/ButtonRefresh";

export function ListItems({
  title,
  options = [],
  field,
  loadingGlobal,
  refetch,
  isFetching,
}) {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedZone, setSelectedZone] = useState("TODAS");

  const dropdownRef = useRef(null);

  const zones = useMemo(() => {
    const z = new Set(options.map((o) => o.zone));
    return ["TODAS", ...Array.from(z)];
  }, [options]);

  const filteredOptions = useMemo(() => {
    const query = searchQuery.toUpperCase();

    return options.filter((item) => {
      const matchZone = selectedZone === "TODAS" || item.zone === selectedZone;
      const matchText = item.frontLabor.includes(query);

      return matchZone && matchText;
    });
  }, [options, searchQuery, selectedZone]);

  const handleSelect = (value) => {
    field.onChange(value);
    setOpenDrawer(false);
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
    <div className="flex border border-input rounded-lg">
      <div className="relative">
        <Button
          variant="outline"
          disabled={loadingGlobal || isFetching}
          onClick={() => setOpenDrawer(!openDrawer)}
          type="button"
          className="w-fit border-none pl-3"
        >
          <Layers className="w-4 h-4 text-zinc-400 mr-1" />
          Labor
        </Button>

        {openDrawer && (
          <div
            ref={dropdownRef}
            className="absolute z-50 mt-1 w-[400px] bg-white border shadow-md rounded-xl"
          >
            {/* 🔹 Zona filter */}
            <div className="flex gap-2 p-2 border-b">
              {zones.map((zone) => (
                <button
                  type="button"
                  key={zone}
                  onClick={() => setSelectedZone(zone)}
                  className={cn(
                    "px-2 py-1 text-xs rounded-lg border",
                    selectedZone === zone
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-zinc-500"
                  )}
                >
                  {zone} {" "}
                  <span className="text-[10px] opacity-70">
                    |{options.filter((item) => item.zone === zone).length}|
                  </span>
                </button>
              ))}
            </div>

            {/* 🔹 Search */}
            <div className="flex items-center border-b px-3 h-10">
              <Search className="mr-2 h-4 w-4 opacity-50" />
              <input
                type="text"
                className="w-full text-xs outline-none"
                placeholder="Buscar labor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value.toUpperCase())}
              />
            </div>

            {/* 🔹 List */}
            <div className="h-60 overflow-auto p-1">
              {filteredOptions.length === 0 ? (
                <div className="text-center text-[10px] text-zinc-400 py-2">
                  No hay resultados
                </div>
              ) : (
                filteredOptions.map(({ frontLabor, zone }) => {
                  const isSelected = field.value === frontLabor;

                  return (
                    <div
                      key={frontLabor}
                      onClick={() => handleSelect(frontLabor)}
                      className="flex items-center justify-between px-2 py-1.5 cursor-pointer hover:bg-zinc-100 rounded-lg"
                    >
                      <div className="flex items-center">
                        <div
                          className={cn(
                            "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                            isSelected ? "bg-primary text-white" : "opacity-30"
                          )}
                        >
                          {isSelected && <Check className="size-3" />}
                        </div>
                        <span className="text-xs">{frontLabor}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
      <ButtonRefresh
        refetch={refetch}
        isFetching={isFetching}
        showText={false}
      />
    </div>
  );
}
