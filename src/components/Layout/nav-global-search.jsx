import { useEffect, useState } from "react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../ui/command";

import { Button } from "../ui/button";
import { ModalUser } from "../Gestion/Users/ModalUser";
import { ModalCompany } from "../Gestion/Company/CompanyModal";
import { Search } from "lucide-react";
import IconMore from "@/icons/IconMore";

export default function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [componentToShow, setComponentToShow] = useState(null);

  useEffect(() => {
    const down = (e) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpenModal((openModal) => !openModal);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const components = {
    user: <ModalUser isOpen={open} onClose={setOpen} isEdit={false} />,
    empresa: <ModalCompany isOpen={open} onClose={setOpen} isEdit={false} />,
  };

  const commandOptions = [
    {
      id: "empresa",
      title: "Crear nueva empresa",
      description: "Crear nuevo proyecto en blanco",
    },
    {
      id: "user",
      title: "Agregar usuario",
      description: "Registrar un nuevo usuario",
    },
  ];

  const handleCommandItemClick = (componentName) => {
    setComponentToShow(componentName);
    setOpen(true);
    setOpenModal(false);
  };

  return (
    <>
      <Button
        variant="outline"
        className="text-xs text-zinc-400 hidden lg:flex justify-between gap-2 font-normal px-2 w-[250px] bg-zinc-900 hover:bg-zinc-800 border-none"
        onClick={() => setOpenModal(true)}
      >
        <div className="flex gap-2 items-center text-zinc-500">
          <Search className="h-3.5 w-3.5 text-zinc-500" />
          Buscar...
        </div>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 bg-zinc-800 text-zinc-500">
          <span className="text-xs ">⌘</span>J
        </kbd>
      </Button>
      <CommandDialog
        open={openModal}
        onOpenChange={setOpenModal}
        className="w-20"
      >
        <CommandInput placeholder="Escribe un comando o busca..." />
        <CommandList>
          <CommandEmpty>Sin resultados.</CommandEmpty>
          <CommandGroup heading="Sugerencias">
            {commandOptions.map((option) => (
              <CommandItem key={option.id}>
                <button
                  className="flex items-center gap-2 w-full h-full"
                  onClick={() => handleCommandItemClick(option.id)}
                  type="button"
                >
                  <div className="w-9 h-9 rounded-[10px] border grid place-items-center">
                    <IconMore className="h-5 w-5 fill-zinc-400" />
                  </div>
                  <div className="flex flex-col justify-center gap-0.5">
                    <p className="text-[12.5px] font-medium leading-4 flex">
                      {option.title}
                    </p>
                    <p className="text-[11.5px] leading-3 text-zinc-400 md:inline font-normal">
                      {option.description}
                    </p>
                  </div>
                </button>
              </CommandItem>
            ))}
          </CommandGroup>
         
        </CommandList>
      </CommandDialog>
      {componentToShow && components[componentToShow]}
    </>
  );
}
