import React from "react";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { SlidersHorizontal, Check, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { Button } from "../../ui/button";
import { Separator } from "../../ui/separator";

function FilterGroup({ title, options, formKey, value, onChange, disabled }) {
  return (
    <CommandGroup heading={title}>
      {options.map((option) => (
        <CommandItem
          key={option.value}
          onSelect={() => onChange(formKey, option.value)}
          disabled={disabled}
        >
          <div
            className={cn(
              "mr-2 flex size-4 items-center justify-center rounded-sm border border-primary",
              value === option.value
                ? "bg-primary text-primary-foreground"
                : "opacity-50 [&_svg]:invisible"
            )}
          >
            <Check className="size-3" />
          </div>
          {option.label}
        </CommandItem>
      ))}
    </CommandGroup>
  );
}

export function Filters({ form, setForm, isFetching, groups, disabled }) {
  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleReset = () => {
    const clearedForm = { ...form };
    groups.forEach((group) => {
      clearedForm[group.formKey] = "";
    });
    setForm(clearedForm);
  };

  const selectedValues = new Set(
    groups
      .map((g) => form[g.formKey])
      .filter((v) => v !== undefined && v !== "")
  );

  const hasActiveFilters = groups.some(
    (group) => form[group.formKey] !== undefined && form[group.formKey] !== ""
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" disabled={isFetching || disabled} className="pl-3 pr-2 active:scale-100">
          <SlidersHorizontal className="h-4 w-4 text-zinc-300 text-xs" />
          Filtros
          {hasActiveFilters && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4 hidden lg:block" />
              <div className="rounded-sm px-1 font-normal lg:hidden text-zinc-400 hidden">
                {selectedValues.size}
              </div>
              <div className="hidden lg:flex text-zinc-400">
                {selectedValues.size > 4 ? (
                  <div className="rounded-sm px-1 font-normal">
                    {selectedValues.size} sel
                  </div>
                ) : (
                  groups
                    .filter((group) => selectedValues.has(form[group.formKey]))
                    .map((group) => {
                      const selectedOption = group.options.find(
                        (opt) => opt.value === form[group.formKey]
                      );
                      return (
                        <div
                          key={group.formKey}
                          className="rounded-sm px-1 font-medium text-xs"
                        >
                          {selectedOption?.label} /
                        </div>
                      );
                    })
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[180px] p-0 overflow-hidden" align="end">
        <Command>
          <CommandList>
            {groups.map((group, i) => (
              <React.Fragment key={group.title}>
                <FilterGroup
                  {...group}
                  value={form[group.formKey]}
                  onChange={handleChange}
                  disabled={isFetching || disabled}
                />
                {i < groups.length - 1 && <CommandSeparator />}
              </React.Fragment>
            ))}
          </CommandList>

          {hasActiveFilters && (
            <>
              <CommandSeparator />
              <CommandGroup>
                <CommandItem
                  onSelect={handleReset}
                  className="justify-center text-center text-rose-500 hover:text-rose-500 hover:bg-rose-50 focus:outline-none focus:ring-0 focus:ring-offset-0"
                >
                  <Trash2 className="mr-2 h-4 w-4 text-rose-500" /> Limpiar
                </CommandItem>
              </CommandGroup>
            </>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
