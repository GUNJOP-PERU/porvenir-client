import clsx from "clsx";
import { Dialog, DialogContent } from "../../ui/dialog";

export const DetailsUser = ({ isOpen, onClose, dataCrud }) => {

  return (
    <Dialog open={isOpen} onOpenChange={onClose} modal={true}>
      <DialogContent className="w-[380px] p-0">
        <div className="flex flex-col items-center justify-center bg-custom_grey-800/80 rounded-3xl px-8 py-6 relative">
          <div
            className={clsx(
              "w-16 h-16 rounded-2xl bg-cover bg-center flex items-center justify-center overflow-hidden mx-auto",
              {
                "bg-[url('/src/assets/vehicle/scoop.png')]":
                  dataCrud?.type === "scoop",
                "bg-[url('/src/assets/vehicle/truck.png')]":
                  dataCrud?.type === "truck",
                "bg-[url('/src/assets/vehicle/drill.png')]":
                  dataCrud?.type === "drill",
              }
            )}
          ></div>

          <div className="mt-2.5 text-center">
            <h4 className="text-xs text-custom_grey-100 leading-3">
              Placa del vehículo
            </h4>
            <span className="text-zinc-900 font-black text-3xl">
              {dataCrud?.tagName || "###"}
            </span>
          </div>
          <p className="text-xs text-zinc-500 leading-4 my-5 mx-auto max-w-[180px] text-center">
            El vehiculo se registro con un kiometraje de{" "}
            <strong className="text-zinc-800 ">
              {dataCrud?.horometer || "###"}
            </strong>{" "}
            km
          </p>
          <div className="w-full flex flex-col items-center justify-between text-xs font-semibold gap-1.5">
            <div className="w-full flex items-center justify-between ">
              <span className="text-zinc-400  ">Tag</span>
              <span className="">STN-CV-12</span>
            </div>
            <div className="w-full flex items-center justify-between ">
              <span className="text-zinc-400  ">Odómetro</span>
              <span className="">5200</span>
            </div>
            <div className="w-full flex items-center justify-between ">
              <span className="text-zinc-400  ">Modelo</span>
              <span className="">Volvo FH16</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
