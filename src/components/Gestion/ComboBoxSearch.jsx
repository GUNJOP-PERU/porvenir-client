import { useEffect, useMemo, useState, useRef } from "react";
import * as Ariakit from "@ariakit/react";
import { useVirtualizer } from "@tanstack/react-virtual";

export const ComboBoxSearch = ({ data, field, filterKey = "name" }) => {
  const [searchValue, setSearchValue] = useState("");
  const parentRef = useRef(null);

  // Filtrar los datos con la clave dinámica proporcionada
  const matches = useMemo(() => {
    return (data || []).filter((item) =>
      item?.[filterKey]?.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [data, searchValue, filterKey]);

  // Sincronizar el campo seleccionado con el input
  useEffect(() => {
    if (field.value) {
      const selectedItem = data?.find((item) => item._id === field.value);
      if (selectedItem) {
        setSearchValue(selectedItem[filterKey] || "");
      }
    }
  }, [field.value, data, filterKey]);

  // Virtualización para mejorar rendimiento en listas largas
  const virtualizer = useVirtualizer({
    count: matches.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35, // Altura estimada de cada elemento
    overscan: 5,
  });

  return (
    <Ariakit.ComboboxProvider
      value={searchValue}
      setValue={setSearchValue}
    >
      <Ariakit.Combobox
        placeholder="Buscar..."
        className="w-full h-9 px-3 py-2 shadow-sm text-[13px] rounded-[10px] border border-input focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary/20 focus:shadow-primary transition ease-in-out duration-300"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
      <Ariakit.ComboboxPopover
        gutter={4}
        sameWidth
        className="relative z-50 flex max-h-44 flex-col overflow-auto text-[13px] rounded-[10px] p-1 border border-input bg-popover shadow-md"
        ref={parentRef}
      >
        {matches.length ? (
          <div
            style={{
              height: `${virtualizer.getTotalSize()}px`,
              position: "relative",
            }}
          >
            {virtualizer.getVirtualItems().map((virtualRow) => {
              const item = matches[virtualRow.index];

              return (
                <Ariakit.ComboboxItem
                  key={item._id}
                  value={item[filterKey]}
                  onClick={() => {
                    field.onChange(item._id);
                    setSearchValue(item[filterKey]);
                  }}
                  className="absolute w-full flex cursor-pointer gap-1 items-center rounded-[10px] hover:bg-primary/10 hover:text-primary py-2 pl-2 pr-1 leading-4"
                  style={{
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  {item[filterKey]}
                </Ariakit.ComboboxItem>
              );
            })}
          </div>
        ) : (
          <div className="text-[13px] text-zinc-400 p-2 text-center leading-3">
            No se encontraron resultados
          </div>
        )}
      </Ariakit.ComboboxPopover>
    </Ariakit.ComboboxProvider>
  );
};
