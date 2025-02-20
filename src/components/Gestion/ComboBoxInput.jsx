
import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import { Command as CommandPrimitive } from "cmdk"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "../ui/command"
import { Input } from "../ui/input"
import { Popover,PopoverContent } from "../ui/popover"


export default function ComboboxInput({ data = [], value, onChange }) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  React.useEffect(() => {
    if (value) {
      const selectedItem = data.find((item) => item._id === value);
      setSearch(selectedItem ? selectedItem.name : "");
    }
  }, [value, data]);

  return (
    <div className="flex items-center">
      <Popover open={open} onOpenChange={setOpen}>
        <Command>
          <PopoverPrimitive.Anchor asChild>
            <CommandPrimitive.Input
              asChild
              value={search}
              onValueChange={setSearch}
              onKeyDown={(e) => setOpen(e.key !== "Escape")}
              onMouseDown={() => setOpen((open) => !!search || !open)}
              onFocus={() => setOpen(true)}
            >
              <Input placeholder="Selecciona un usuario..." className="w-[200px]" />
            </CommandPrimitive.Input>
          </PopoverPrimitive.Anchor>
          {!open && <CommandList aria-hidden="true" className="hidden" />}
          <PopoverContent
            asChild
            onOpenAutoFocus={(e) => e.preventDefault()}
            className="w-[--radix-popover-trigger-width] p-0"
          >
            <CommandList>
              <CommandEmpty>No encontrado.</CommandEmpty>
              <CommandGroup>
                {data.map((user) => (
                  <CommandItem
                    key={user._id}
                    value={user._id}
                    onMouseDown={(e) => e.preventDefault()}
                    onSelect={(currentValue) => {
                      onChange(currentValue === value ? "" : currentValue);
                      setSearch(
                        currentValue === value
                          ? ""
                          : data.find((user) => user._id === currentValue)?.name ?? ""
                      );
                      setOpen(false);
                    }}
                  >
                    <Check className={cn("mr-2 h-4 w-4", value === user._id ? "opacity-100" : "opacity-0")} />
                    {user.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </PopoverContent>
        </Command>
      </Popover>
    </div>
  );
}