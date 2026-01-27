import { useState } from "react";
import { IconDelete } from "@/icons/IconDelete";
import { ModalDelete } from "@/components/ModalDelete";
import { Button } from "@/components/ui/button";
import dayjs from "dayjs";
import IconDay from "@/icons/IconDay";
import IconNight from "@/icons/IconNight";
import TimeAgo from "timeago-react";
import IconLoader from "@/icons/IconLoader";
import IconWarning from "@/icons/IconWarning";

export const PlanDayDetails = ({ dataCrud = [], isLoading, isError }) => {
  const planDay = dataCrud?.[0];

  const [deleModal, setDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const totalTonnage =
    planDay?.data?.reduce((acc, item) => acc + (item.tonnage || 0), 0) || 0;

  const handleDeleteModal = (item) => {
    setSelectedItem(item);
    setDeleteModal(true);
  };
  return (
    <>
      <div className="mt-2">
        <div className="flex justify-between items-center gap-2">
          <div>
            <h1 className="text-base font-extrabold leading-5">
              Planificación /{" "}
              <strong className="font-extrabold capitalize text-primary">
                {planDay?.dateString ? (
                  <>
                    {planDay?.dateString &&
                      dayjs(planDay.dateString).format("DD MMMM")}
                  </>
                ) : (
                  <span className="text-zinc-300 font-bold">--</span>
                )}
              </strong>
            </h1>
            <span className="text-2xl font-extrabold">
              {totalTonnage.toLocaleString("es-MX")} <small>TM</small>
            </span>
          </div>
          <div className="flex items-center gap-1 border border-zinc-200 rounded-[10px] py-0.5 pl-1 pr-3">
            <div className="inline-flex items-center justify-center w-8 h-8 rounded-[10px]">
              {planDay?.shift === "dia" ? (
                <IconDay className="h-5 w-5 fill-orange-400" />
              ) : (
                <IconNight className="h-5 w-5 fill-sky-400" />
              )}
            </div>
            <div className="flex flex-col items-start gap-0.5 min-w-[40px]">
              <span className="text-[10px] text-zinc-400 leading-[8px]">
                Turno
              </span>
              <span className="text-[14px] font-bold leading-[12px] text-zinc-800">
                {planDay?.shift === "dia" ? "Día" : "Noche"}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-8">
          <div className="overflow-x-auto">
            <table className="w-full border border-[#FF500030] text-sm">
              <thead>
                <tr>
                  <th className="w-10 bg-[#959493] text-white border border-[#FF500030]"></th>
                  <th className="bg-[#959493] text-white px-3 py-1.5 border border-[#FF500030]">
                    LABOR
                  </th>
                  <th className="bg-[#FF5000] text-white px-3 py-1.5 border border-[#FF500030]">
                    FASE
                  </th>
                  <th className="bg-[#FF5000] text-white px-3 py-1.5 border border-[#FF500030] text-right">
                    {planDay?.dateString}
                  </th>
                  <th className="bg-[#FF5000]"></th>
                </tr>
              </thead>
              <tbody>
                {isError ? (
                  <tr>
                    <td colSpan={5} className="text-center">
                      <div className="space-y-4 flex-1 flex flex-col">
                        <div className="max-w-[150px] leading-3 mx-auto flex-1 flex flex-col items-center justify-center gap-1">
                          <IconWarning className="size-8 text-[#D32F2F]" />
                          <p className="text-center text-[#B71C1C] text-[11px] font-medium">
                            Hubo un error al cargar los datos. Por favor,
                            intente nuevamente más tarde.
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : isLoading ? (
                  <tr>
                    <td colSpan={5} className="text-center">
                      <div className="max-w-xs m-auto py-24 flex flex-col items-center gap-0.5">
                        <IconLoader className="size-7" />
                        <span className="text-zinc-400 text-[8px]">
                          Cargando
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : dataCrud.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center">
                      <div className="max-w-xs m-auto py-24">
                        <p className="text-center text-zinc-400 leading-4 mb-4 text-[11px]">
                          <strong className="text-zinc-500 font-semibold">
                            Sin datos disponibles
                          </strong>
                          <br />
                          Lo sentimos, no hay datos para mostrar en este
                          momento. Por favor, verifica tu selección e intente de
                          nuevo más tarde.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <>
                    {planDay?.data?.map((item, index) => (
                      <tr key={item._id} className="">
                        <td className="text-center border border-[#FF500030] bg-[#959493] text-white">
                          {index + 1}
                        </td>
                        <td className="px-3 py-1.5 border border-[#FF500030] ">
                          <div className="flex flex-col gap-1">
                            <h4 className="font-semibold leading-none">
                              {item.frontLabor}
                            </h4>
                            <span className="text-[10px] text-zinc-400 leading-[8px]">
                              Creado{" "}
                              <TimeAgo datetime={item.updatedAt} locale="es" />
                            </span>
                          </div>
                        </td>
                        <td className="px-3 py-1.5 border border-[#FF500030] bg-[#FF500015] relative capitalize">
                          {item.phase}
                        </td>
                        <td className="px-3 py-1.5 border border-[#FF500030] text-right">
                          {item.tonnage?.toLocaleString()}
                        </td>
                        <td className="px-1 border border-[#FF500030] text-right">
                          <Button
                            onClick={() => handleDeleteModal(item)}
                            variant="ghost"
                            className="flex h-8 w-8 p-0 hover:bg-red-100 mx-auto"
                          >
                            <IconDelete className="size-4 text-red-500" />
                          </Button>
                        </td>
                      </tr>
                    ))}

                    <tr className="bg-gray-800 text-white font-bold">
                      <td></td>
                      <td className="px-3 py-1.5">TOTAL</td>
                      <td></td>
                      <td className="px-3 py-1.5 text-right text-lg">
                        {totalTonnage.toLocaleString()} TM
                      </td>
                      <td></td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <ModalDelete
        isOpen={deleModal}
        onClose={() => setDeleteModal(false)}
        urlDelete={`planDay/${selectedItem?._id}`}
        itemId={selectedItem?._id}
        queryKeyToUpdate="planDay"
      />
    </>
  );
};
