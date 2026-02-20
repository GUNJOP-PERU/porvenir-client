/* eslint-disable react/prop-types */
import { useState } from "react";
import { useFetchData } from "@/hooks/useGlobalQuery";
import { useQueryClient } from "@tanstack/react-query";
import { ButtonRefresh } from "@/components/ButtonRefresh";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Check, Layers, Plus, SlidersHorizontal, X } from "lucide-react";
import { FrontLaborSubHeader } from "./FrontLaborSubHeader";

function CreateLaborPopover({ onSuccess, disabled, open, onOpenChange }) {
  const queryClient = useQueryClient();
  const handleSuccess = (newName) => {
    queryClient.invalidateQueries({ queryKey: ["crud", "frontLabor-general"] });
    onSuccess(newName);
    onOpenChange(false);
  };

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          title="Crear nueva labor"
          disabled={disabled}
          variant="outline"
          size="icon"
          className="border-none bg-primary/10 text-primary  hover:bg-primary hover:text-white"
        >
          <Plus className={cn("h-[15px] w-[15px]", open && "rotate-45")} />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[420px] p-0 rounded-2xl border border-gray-200/80 bg-white"
        align="start"
        sideOffset={4}
      >
        <div className="flex items-center gap-1.5 px-3 py-2 border-b border-gray-100 bg-gray-50/60">
          <Plus className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
            Nueva Labor
          </span>
        </div>
        <div className="p-4">
          <FrontLaborSubHeader
            onSuccess={handleSuccess}
            onCancel={() => onOpenChange(false)}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}

function FilterListPopover({
  title,
  normalizedOptions,
  selectedValues,
  onToggle,
  onClearAll,
  disabled,
  onRequestCreate,
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            "group flex items-center gap-2 h-8 pl-3 pr-3.5",
            "rounded-r-lg",
            "bg-white hover:bg-zinc-50",
            "transition-colors duration-150",
            "disabled:opacity-40 disabled:cursor-not-allowed",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-inset",
          )}
        >
          <SlidersHorizontal
            className={cn(
              "w-[15px] h-[15px] text-zinc-400 transition-colors",
              "group-hover:text-zinc-600",
              open && "text-zinc-700",
            )}
          />
          <span className="text-xs font-medium text-zinc-700">{title}</span>

          {selectedValues.size > 0 && (
            <>
              <Separator orientation="vertical" className="h-3.5 bg-zinc-200" />
              <span
                className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-md bg-green-500 text-white text-[10px] font-semibold leading-none"
              >
                {selectedValues.size}
              </span>
            </>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        className={cn(
          "w-[500px] p-0 overflow-hidden",
          "rounded-2xl border border-gray-200/80 bg-white",
        )}
        align="start"
        sideOffset={4}
      >
        <div className="grid grid-cols-2 divide-x divide-gray-100">
          <Command className="rounded-none border-0 shadow-none bg-transparent">
            <div className="flex items-center gap-1.5 px-3 py-2 border-b border-gray-100 bg-gray-50/60">
              <Layers className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                Labores disponibles
              </span>
            </div>

            <CommandInput
              placeholder="Buscar labor..."
              className={cn(
                "h-9 text-xs px-3",
                "border-b border-gray-100",
                "placeholder:text-zinc-400",
                "[&>input]:bg-transparent",
              )}
            />

            <CommandList className="max-h-52 overflow-auto py-1">
              <CommandEmpty>
                <div className="flex flex-col items-center gap-2 py-6 text-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100">
                    <Layers className="h-4 w-4 text-zinc-400" />
                  </div>
                  <p className="text-[11px] text-zinc-400">Sin resultados</p>
                  <button
                    type="button"
                    onClick={onRequestCreate}
                    className="text-[11px] text-primary hover:text-primary hover:underline transition-colors cursor-pointer"
                  >
                    + Crear labor
                  </button>
                </div>
              </CommandEmpty>

              <CommandGroup>
                {normalizedOptions.map((item) => {
                  const isSelected = selectedValues.has(item);
                  return (
                    <CommandItem
                      key={item}
                      value={item}
                      onSelect={() => onToggle(item)}
                      className={cn(
                        "mx-1 cursor-pointer rounded-lg px-2 py-2 text-xs gap-2",
                        "aria-selected:bg-zinc-100",
                        "transition-colors duration-100",
                        isSelected && "text-green-700 font-medium",
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-[15px] w-[15px] shrink-0 items-center justify-center rounded-[4px]",
                          "border transition-all duration-150",
                          isSelected
                            ? "border-green-500 bg-green-500 shadow-sm"
                            : "border-zinc-300 bg-white",
                        )}
                      >
                        <Check
                          className={cn(
                            "w-2.5 h-2.5 transition-all duration-150",
                            isSelected
                              ? "text-white opacity-100 scale-100"
                              : "opacity-0 scale-75",
                          )}
                        />
                      </div>
                      <span className="">{item}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 bg-gray-50/60">
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 leading-none">
                  Seleccionados
                </span>
              </div>
              {selectedValues.size > 0 && (
                <span className="flex h-4 min-w-4 items-center justify-center rounded-md bg-green-500 px-1 text-[9px] leading-none font-semibold text-white">
                  {selectedValues.size}
                </span>
              )}
            </div>

            <div className="h-[calc(9px+36px+208px)] overflow-auto py-1">
              {selectedValues.size > 0 ? (
                <div className="flex flex-col">
                  {Array.from(selectedValues).map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => onToggle(value)}
                      className={cn(
                        "group mx-1 flex items-center gap-2 rounded-lg px-2 py-2",
                        "cursor-pointer select-none text-left",
                        "hover:bg-red-50 transition-colors duration-100",
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-[15px] w-[15px] shrink-0 items-center justify-center rounded-[4px]",
                          "border border-rose-400 bg-rose-400",
                          "group-hover:border-rose-600 group-hover:bg-rose-600",
                          "transition-colors duration-100",
                        )}
                      >
                        <X className="w-2.5 h-2.5 text-white" />
                      </div>
                      <span className="truncate text-xs text-zinc-700 group-hover:text-rose-700 transition-colors">
                        {value}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-2 py-6 text-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100">
                    <Check className="h-4 w-4 text-zinc-300" />
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-snug">
                    Ningún item
                    <br />
                    seleccionado
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {selectedValues.size > 0 && (
          <div className="border-t border-gray-100 p-1">
            <button
              type="button"
              onClick={onClearAll}
              className="flex w-full items-center justify-center gap-1.5 leading-none rounded-lg px-3 py-2 text-[11px] font-medium text-rose-500 hover:bg-rose-50 transition-colors duration-150"
            >
              <X className="h-3 w-3" />
              Limpiar selección
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

export function FilterItems({ title, field, className }) {
  const {
    data: dataLaborList,
    refetch: refetchLaborList,
    isLoading: isLoadingLaborList,
    isFetching: isLaborListFetching,
  } = useFetchData("frontLabor-current", "frontLabor/current", {
    enabled: true,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
  });
  const [openCreate, setOpenCreate] = useState(false);

  const selectedValues = new Set(field.value || []);

  const normalizedOptions = (dataLaborList ?? []).map((opt) =>
    typeof opt === "string" ? opt : opt.frontLabor,
  );

  const toggleSelection = (value) => {
    const newSet = new Set(selectedValues);
    newSet.has(value) ? newSet.delete(value) : newSet.add(value);
    field.onChange(Array.from(newSet));
  };

  const handleCreateSuccess = (newName) => {
    const newSet = new Set(selectedValues);
    newSet.add(newName);
    field.onChange(Array.from(newSet));
    refetchLaborList?.();
  };

  return (
    <div
      className={cn(
        "flex items-center rounded-lg border border-input bg-white",
        className,
      )}
    >
      <ButtonRefresh
        refetch={refetchLaborList}
        isFetching={isLaborListFetching}
        showText={false}
      />
      <CreateLaborPopover
        open={openCreate}
        onOpenChange={setOpenCreate}
        onSuccess={handleCreateSuccess}
        disabled={isLoadingLaborList}
      />
      <FilterListPopover
        title={title}
        normalizedOptions={normalizedOptions}
        selectedValues={selectedValues}
        onToggle={toggleSelection}
        onClearAll={() => field.onChange([])}
        disabled={isLoadingLaborList || isLaborListFetching}
        onRequestCreate={() => setOpenCreate(true)}
      />
    </div>
  );
}
