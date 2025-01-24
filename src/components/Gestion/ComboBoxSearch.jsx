import { useEffect, useMemo, useState } from "react";
import * as Ariakit from "@ariakit/react";

export const ComboBoxSearch = ({  data, field, filterKey = "name" }) => {
  const [searchValue, setSearchValue] = useState("");

  // Filtrar los datos con la clave dinámica proporcionada
  const matches = useMemo(() => {
    return (data || []).filter((item) =>
      item?.[filterKey]?.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [data, searchValue, filterKey]);

  // Actualizar `searchValue` cuando `field.value` cambia (sincronización inicial)
  useEffect(() => {
    if (field.value) {
      const selectedItem = data?.find((item) => item._id === field.value);
      if (selectedItem) {
        setSearchValue(selectedItem[filterKey] || "");
      }
    }
  }, [field.value, data, filterKey]);

  return (
    <Ariakit.ComboboxProvider
      value={searchValue} // Vincular al valor actual del estado
      setValue={(value) => {
        setSearchValue(value); // Actualizar el estado del filtro
      }}
   
    >
      {/* <Ariakit.ComboboxLabel className="w-full peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-zinc-800 text-xs font-medium ">{label}</Ariakit.ComboboxLabel> */}
      <Ariakit.Combobox
        placeholder="Buscar..."
        className="w-full h-9 px-3 py-2 shadow-sm text-[13px] rounded-[10px] border border-input ocus:outline-none focus:ring-1 focus:ring-primary focus:border-primary/20 focus:shadow-primary transition ease-in-out duration-300 "
        value={searchValue} // Mostrar el valor actual
        onChange={(e) => setSearchValue(e.target.value)} // Actualizar búsqueda
      />
      <Ariakit.ComboboxPopover gutter={8} sameWidth className="relative z-50 flex max-h-96 flex-col overflow-auto text-[13px] rounded-[10px]  p-1 border border-input bg-popover shadow-md ">
        {matches.length ? (
          matches.map((item) => (
            <Ariakit.ComboboxItem
              key={item._id}
              value={item[filterKey]} // Mostrar valor dinámico
              onClick={() => {
                field.onChange(item._id); // Actualizar valor en react-hook-form
                setSearchValue(item[filterKey]); // Mostrar el valor seleccionado
              }}
              className="w-full flex cursor-pointer gap-1 items-center rounded-[10px] hover:bg-primary/10 hover:text-primary py-2 pl-2 pr-1 leading-4"
            >
              {item[filterKey]} {/* Mostrar valor dinámico */}
            </Ariakit.ComboboxItem>
          ))
        ) : (
          <div className="text-[13px] text-zinc-400 p-2 text-center leading-3">No se encontraron resultados</div>
        )}
      </Ariakit.ComboboxPopover>
    </Ariakit.ComboboxProvider>
  );
};
