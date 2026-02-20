/* eslint-disable react/prop-types */
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useHandleFormSubmit } from "@/hooks/useMutation";
import IconClose from "@/icons/IconClose";
import IconLoader from "@/icons/IconLoader";
import IconToggle from "@/icons/IconToggle";
import { Separator } from "@ariakit/react";
import { Check, CircleFadingPlus, Search } from "lucide-react";
import { Button } from "../../ui/button";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverAnchor,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormDescription,
  // FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Input } from "../../ui/input";
import { useFetchData } from "@/hooks/useGlobalQuery";
import { Switch } from "@/components/ui/switch";
import { ListItems } from "./ListItems";

const FormSchema = z.object({
  mac: z
    .string()
    .min(1, { message: "*Nombre requerido" })
    .transform((val) => val.replace(/\s+/g, "")),
  type: z
    .string()
    .min(1, { message: "*Nombre requerido" })
    .transform((val) => val.trim()),
  ubicationType: z
    .string()
    .min(1, { message: "*Tipo requerido" })
    .transform((val) => val.trim()),
  ubication: z
    .string()
    .min(1, { message: "*Ubicación requerida" })
    .transform((val) => val.trim()),
  location: z
    .string()
    .optional()
    .transform((val) => val.replace(/\s+/g, "")),
  isActive: z.boolean().default(true),
});

export const BeaconModal = ({ isOpen, onClose, isEdit, dataCrud }) => {
  const {
    data: dataLaborList = [],
    refetch: refetchLaborList,
    isFetching: isLaborListFetching,
  } = useFetchData("frontLabor-current", "frontLabor/current", {
    enabled: true,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
  });

  const { data: dataBeacons = [] } = useFetchData("beacon", "beacon");

  const [loadingGlobal, setLoadingGlobal] = useState(false);
  const [showLocationList, setShowLocationList] = useState(false);
  const inputRef = useRef(null);

  const existingLocations = useMemo(() => {
    if (!dataBeacons || dataBeacons.length === 0) return [];
    const locs = dataBeacons
      .map((b) => b.location)
      .filter((loc) => loc && loc.trim() !== "");
    return [...new Set(locs)].sort();
  }, [dataBeacons]);

  const handleFormSubmit = useHandleFormSubmit();

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      mac: dataCrud?.mac || "",
      type: dataCrud?.type || "",
      ubicationType: dataCrud?.ubicationType || "",
      ubication: dataCrud?.ubication || "",
      location: dataCrud?.location || "",
      isActive: dataCrud?.isActive ?? true,
    },
  });

  const { handleSubmit, control, reset } = form;

  useEffect(() => {
    if (dataCrud) {
      reset({
        mac: dataCrud.mac || "",
        type: dataCrud.type || "",
        ubicationType: dataCrud.ubicationType || "",
        ubication: dataCrud.ubication || "",
        location: dataCrud.location || "",
        isActive: dataCrud.isActive ?? true,
      });
    } else {
      reset({
        mac: "",
        type: "",
        ubicationType: "",
        ubication: "",
        location: "",
        isActive: true,
      });
    }
  }, [dataCrud, reset]);

  async function onSubmit(data) {
    await handleFormSubmit({
      isEdit,
      endpoint: "beacon",
      id: dataCrud?._id,
      data,
      setLoadingGlobal,
      onClose,
      reset,
      extraInvalidateKeys: [
        ["crud", "zone-superficie"],
        ["crud", "zone-subterraneo"],
      ],
    });
  }

  useEffect(() => {
    if (!isEdit) {
      form.setValue("ubication", "");
    }
  }, [isEdit, form]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(onClose) => !loadingGlobal && onClose}
      modal={true}
    >
      <DialogContent className="w-[400px] p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex gap-2 items-center">
            <div>
              <CircleFadingPlus className="w-6 h-6 text-zinc-300 " />
            </div>
            <div>
              <DialogTitle>{isEdit ? "Editar" : "Crear"} beacon</DialogTitle>
              <DialogDescription>
                Agregue un nuevo beacon al sistema
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-4 px-6">
              <FormField
                control={control}
                name="mac"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>MAC</FormLabel>
                    <Input
                      type="text"
                      disabled={loadingGlobal}
                      placeholder="Ej. 00:1A:7D:DA:71:13"
                      value={field.value}
                      onChange={(e) =>
                        field.onChange(e.target.value.toUpperCase())
                      }
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="type"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Tipo</FormLabel>
                    <Input
                      type="text"
                      disabled={loadingGlobal}
                      placeholder="Ej. beacon"
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="ubicationType"
                render={({ field }) => (
                  <FormItem className="flex flex-col col-span-2">
                    <FormLabel>Tipo de ubicación</FormLabel>
                    <Input
                      type="text"
                      disabled={loadingGlobal}
                      placeholder="Ej. beacon"
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="location"
                render={({ field }) => (
                  <FormItem className="flex flex-col col-span-2 relative">
                    <FormLabel className="font-bold text-blue-600">
                      *Localización
                    </FormLabel>
                    <Popover
                      open={showLocationList}
                      onOpenChange={setShowLocationList}
                      modal={false}
                    >
                      <PopoverAnchor asChild>
                        <div className="relative group">
                          <Input
                            ref={inputRef}
                            type="text"
                            disabled={loadingGlobal}
                            placeholder="Ej. zona-a, nivel-1600"
                            value={field.value}
                            autoComplete="off"
                            onFocus={() => setShowLocationList(true)}
                            onChange={(e) => {
                              field.onChange(e.target.value.toLowerCase());
                              if (!showLocationList) setShowLocationList(true);
                            }}
                            className="pr-8"
                          />
                          <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 size-4 text-zinc-300 pointer-events-none group-focus-within:text-blue-400 transition-colors" />
                        </div>
                      </PopoverAnchor>
                      {existingLocations.length > 0 && (
                        <PopoverContent
                          className="w-[var(--radix-popover-trigger-width)] p-0 bg-white border border-zinc-200 shadow-xl rounded-lg overflow-hidden"
                          align="start"
                          sideOffset={0}
                          onOpenAutoFocus={(e) => e.preventDefault()}
                          onInteractOutside={(e) => {
                            if (e.target === inputRef.current) {
                              e.preventDefault();
                            }
                          }}
                        >
                          <div className="p-2 py-1.5 border-b bg-zinc-50/50 flex items-center">
                            <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-wider leading-none">
                              Ubicaciones existentes
                            </span>
                          </div>
                          <div className="flex flex-col max-h-[200px] overflow-auto p-1 custom-scrollbar">
                            {existingLocations
                              .filter(
                                (loc) =>
                                  !field.value ||
                                  loc.includes(field.value.toLowerCase()),
                              )
                              .map((loc) => {
                                const isSelected = field.value === loc;
                                return (
                                  <button
                                    key={loc}
                                    type="button"
                                    onClick={() => {
                                      field.onChange(loc);
                                      setShowLocationList(false);
                                    }}
                                    className={cn(
                                      "flex items-center justify-between w-full px-3 py-1.5 text-xs text-left rounded-lg transition-colors",
                                      isSelected
                                        ? "bg-blue-50 text-blue-700 font-semibold"
                                        : "hover:bg-zinc-50 text-zinc-600",
                                    )}
                                  >
                                    <span>{loc}</span>
                                    {isSelected && (
                                      <Check className="size-3 text-blue-600" />
                                    )}
                                  </button>
                                );
                              })}
                            {existingLocations.filter(
                              (loc) =>
                                !field.value ||
                                loc.includes(field.value.toLowerCase()),
                            ).length === 0 && (
                              <div className="flex flex-col py-3 px-3 text-center">
                                <p className="text-[11px] text-zinc-400 italic">
                                  No hay coincidencias exactas...
                                </p>
                                <p className="text-[10px] text-blue-500 font-medium">
                                  Puedes seguir escribiendo para crear una nueva
                                </p>
                              </div>
                            )}
                          </div>
                        </PopoverContent>
                      )}
                    </Popover>
                    {isEdit ? (
                      <FormDescription className="text-[10px] leading-3 text-amber-600 font-semibold pl-2">
                        ⚠️ Cambiar esto podría reasignar el beacon a otra zona
                      </FormDescription>
                    ) : (
                      <FormDescription className="text-[11px] leading-3 text-blue-600 font-medium pl-2">
                        ✓ Este beacon se asignará automáticamente a zonas con la
                        misma localización
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="ubication"
                render={({ field }) => (
                  <FormItem className="flex flex-col col-span-2">
                    <FormLabel>Ubicación / Labor</FormLabel>
                    <div className="flex ">
                      <Input
                        type="text"
                        disabled={loadingGlobal}
                        placeholder="Ej. Mantenimiento"
                        {...field}
                      />
                      <ListItems
                        column={""}
                        title="Labor"
                        options={dataLaborList}
                        field={field}
                        loadingGlobal={loadingGlobal}
                        refetch={refetchLaborList}
                        isFetching={isLaborListFetching}
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-8 px-6">
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="col-span-2 flex flex-row items-center justify-between rounded-lg border border-custom-1400 px-4 py-3 gap-2">
                    <div className="flex flex-col  justify-center ">
                      <FormLabel>Activar/Desactivar</FormLabel>
                      <FormDescription className="pt-0">
                        Se deshabilitará el beacon.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        aria-readonly
                        disabled={loadingGlobal}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <Separator className="my-6" />
            <div className="flex gap-3 justify-end pt-0 pb-4 p-6">
              <Button
                type="button"
                onClick={() => onClose()}
                variant="secondary"
                disabled={loadingGlobal}
              >
                <IconClose className="fill-zinc-400/50 w-4 h-4" />
                Cancelar
              </Button>
              <Button type="submit" disabled={loadingGlobal}>
                {loadingGlobal ? (
                  <>
                    <IconLoader className="w-4 h-4  " />
                    Cargando...
                  </>
                ) : (
                  <>
                    <IconToggle className="text-background w-4 h-4" />
                    {isEdit ? "Actualizar" : "Crear"} Beacon
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
