/* eslint-disable react/prop-types */
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Separator } from "../ui/separator";

export function MultiSelect({ placeholder, options, value, onChange }) {
  const selectedValues = new Set(value ?? []);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="h-8 rounded-lg border  border-zinc-600 flex items-center px-3 pr-2 w-[200px] relative"
        >
          <span className="font-semibold  truncate">{placeholder}</span>
          <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
          <Separator orientation="vertical" className="mx-1 h-4" />
          <div className="rounded-sm px-1 font-normal lg:hidden text-zinc-400">
            {selectedValues.size}
          </div>
          <div className="hidden space-x-1 lg:flex text-zinc-500">
            <div className="rounded-sm mr-3 font-normal w-[50px]">
              {selectedValues.size} selc
            </div>
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 overflow-hidden" align="end">
        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandList>
            <CommandEmpty>Sin resultados.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      const next = new Set(selectedValues);
                      isSelected
                        ? next.delete(option.value)
                        : next.add(option.value);

                      onChange?.(Array.from(next));
                    }}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible",
                      )}
                    >
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    {option.icon && (
                      <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                    )}
                    <span>{option.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup className="sticky bottom-0 bg-background">
                  <CommandItem
                    onSelect={() => onChange?.([])}
                    className="justify-center text-center text-red-500 hover:text-red-500 hover:bg-red-50"
                  >
                    Limpiar
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
