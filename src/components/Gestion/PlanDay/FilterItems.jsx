import { cn } from "@/lib/utils";
import { Check, Layers, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { Separator } from "@/components/ui/separator";
import IconClose from "@/icons/IconClose";
import { useState } from "react";

export function FilterItems({ title, options, field,loadingGlobal }) {
  const selectedValues = new Set(field.value || []);
  const [openDrawer, setOpenDrawer] = useState(false);
  const toggleSelection = (value) => {
    const newSet = new Set(selectedValues);
    if (newSet.has(value)) {
      newSet.delete(value);
    } else {
      newSet.add(value);
    }
    field.onChange(Array.from(newSet)); // Actualiza el valor en react-hook-form
  };

  return (
    <Popover modal={true} open={openDrawer} onOpenChange={setOpenDrawer} autoFocus={openDrawer}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={loadingGlobal}
        >
          <Layers className="w-4 h-4" />
          {title}
          {selectedValues.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-1 h-4" />
              <div className="rounded-sm px-1 font-normal lg:hidden text-zinc-400">
                {selectedValues.size}
              </div>
              <div className="hidden space-x-1 lg:flex text-zinc-500">
                {selectedValues.size > 0 ? (
                  <div className="rounded-sm font-normal">
                    {selectedValues.size}
                  </div>
                ) : (
                  Array.from(selectedValues).map((value) => (
                    <div
                      key={value}
                      className="rounded-sm font-medium text-xs"
                    >
                      {value}
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>Sin resultados.</CommandEmpty>
            <CommandGroup>
              {options?.map(({ name }) => {
                const isSelected = selectedValues.has(name);
                return (
                  <CommandItem
                    key={name}
                    onSelect={() => toggleSelection(name)}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <Check className="w-3 h-3" />
                    </div>
                    <span>{name}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandGroup className="w-full bg-white border-t border-zinc-100 sticky bottom-0">
                  <CommandItem
                    onSelect={() => field.onChange([])}
                    className="justify-center text-center text-red-500 hover:text-red-500 hover:bg-red-50"
                  >
                    <IconClose className="w-3.5 h-3.5 fill-red-500 mr-1.5" />
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
