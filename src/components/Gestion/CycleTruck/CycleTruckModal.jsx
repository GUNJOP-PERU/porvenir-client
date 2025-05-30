import { useFetchData } from "@/hooks/useGlobalQuery";
import { useHandleFormSubmit } from "@/hooks/useMutation";
import IconClose from "@/icons/IconClose";
import IconLoader from "@/icons/IconLoader";
import IconToggle from "@/icons/IconToggle";
import { dataDestiny, dataMaterial, dataTurn } from "@/lib/data";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleFadingPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { ComboBoxSearch } from "../ComboBoxSearch";
import ComboboxInput from "../ComboBoxInput";
import { Input } from "@/components/ui/input";

// Schema de validación
const FormSchema = z.object({
  userId: z.string().min(1, { message: "*Labor requerida" }),
  laborId: z.string().min(1, { message: "*Front Labor requerido" }),
  vehicleId: z.string().min(1, { message: "*Front Labor requerido" }),
  shift: z.string().min(1, { message: "*Turno requerido" }),
  tonnage: z.number().min(1, { message: "*Tonelaje requerido" }),
  destiny: z.string().min(1, { message: "*Destino requerido" }),
  duration: z.number().min(1, { message: "*Duración requerida" }),
  material: z.string().min(1, { message: "*Material requerido" }),
});

export const CycleTruckModal = ({ isOpen, onClose, isEdit, dataCrud }) => {
  const handleFormSubmit = useHandleFormSubmit();
  const [loadingGlobal, setLoadingGlobal] = useState(false);
  const { data: dataUser } = useFetchData("user", "user");
  const { data: dataVehicle } = useFetchData("vehicle", "vehicle");
  const { data: dataFrontLabor } = useFetchData(
    "frontLabor-General",
    "frontLabor"
  );

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      userId: dataCrud?.userId || "",
      laborId: dataCrud?.laborId || "",
      vehicleId: dataCrud?.vehicleId || "",
      shift: dataCrud?.shift || "",
      tonnage: dataCrud?.tonnage || "",
      destiny: dataCrud?.destiny || "",
      duration: dataCrud?.duration || "",
      material: dataCrud?.material || "",
    },
  });

  const { handleSubmit, control, reset } = form;

  useEffect(() => {
    if (dataCrud) {
      reset({
        userId: dataCrud.userId || "",
        laborId: dataCrud.laborId || "",
        vehicleId: dataCrud.vehicleId || "",
        shift: dataCrud.shift || "",
        tonnage: dataCrud.tonnage || "",
        destiny: dataCrud.destiny || "",
        duration: dataCrud.duration || "",
        material: dataCrud.material || "",
      });
    }
  }, [dataCrud, reset]);

  // Función de envío del formulario
  async function onSubmit(data) {
    console.log("data", data);
    await handleFormSubmit({
      isEdit,
      endpoint: "cycleTruck",
      id: dataCrud?._id,
      data,
      setLoadingGlobal,
      onClose,
      reset,
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[450px]">
        <DialogHeader>
          <div className="flex gap-2 items-center">
            <div>
              <CircleFadingPlus className="w-6 h-6 text-zinc-300 " />
            </div>
            <div>
              <DialogTitle>
                {isEdit ? "Editar" : "Crear"} Ciclo Truck
              </DialogTitle>
              <DialogDescription>
                {isEdit ? "Edite" : "Agregue"} un nuevo ciclo truck al sistema
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-4">
              {/* Usuario */}
              <FormField
                control={control}
                name="userId"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Usuario</FormLabel>
                    <ComboBoxSearch data={dataUser} field={field} />
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Vehículo */}
              <FormField
                control={control}
                name="vehicleId"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Vehiculo</FormLabel>
                    <ComboBoxSearch
                      data={dataVehicle}
                      field={field}
                      filterKey="tagName"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Front Labor */}
              <FormField
                control={control}
                name="laborId"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Labor</FormLabel>
                    <ComboBoxSearch data={dataFrontLabor} field={field} />
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Turno */}
              <FormField
                control={control}
                name="shift"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Seleccionar Turno</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={loadingGlobal}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione Turno" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {dataTurn?.map((i) => (
                          <SelectItem key={i.value} value={i.value}>
                            {i.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Destino */}
              <FormField
                control={control}
                name="destiny"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Seleccionar Destino</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={loadingGlobal}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione Destino" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {dataDestiny?.map((i) => (
                          <SelectItem key={i.value} value={i.value}>
                            {i.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={control}
                name="tonnage"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Tonelaje</FormLabel>
                    <Input
                      type="number"
                      disabled={loadingGlobal}
                      placeholder="Ej. 10000"
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Material */}
              <FormField
                control={control}
                name="material"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Seleccionar Material</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={loadingGlobal}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione Material" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {dataMaterial?.map((i) => (
                          <SelectItem key={i.value} value={i.value}>
                            {i.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="duration"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Duración</FormLabel>
                    <Input
                      type="number"
                      disabled={loadingGlobal}
                      placeholder="Ej. 10000"
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="pt-6 flex gap-2">
              <Button
                type="button"
                className="w-1/2"
                onClick={() => onClose()}
                variant="secondary"
                disabled={loadingGlobal}
              >
                <IconClose className="fill-zinc-400/50 w-4 h-4" />
                Cancelar
              </Button>
              <Button type="submit" disabled={loadingGlobal} className="w-1/2">
                {loadingGlobal ? (
                  <>
                    <IconLoader className="w-4 h-4 text-zinc-200 fill-primary animate-spin" />
                    Cargando...
                  </>
                ) : (
                  <>
                    <IconToggle className="text-background w-4 h-4" />
                    {isEdit ? "Actualizar" : "Crear"}
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
