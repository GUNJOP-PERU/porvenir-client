import { deleteDataRequest } from "@/api/api";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useQueryClient } from "@tanstack/react-query";
import IconLoader from "@/icons/IconLoader";
import { IconDelete } from "@/icons/IconDelete";
import { useToast } from "@/hooks/useToaster";
import { ReceiptText } from "lucide-react";
import { ModalDelete } from "@/components/ModalDelete";
import { Button } from "@/components/ui/button";

export const PlanDayDetails = ({ isOpen, onClose, dataCrud }) => {
  console.log(dataCrud, "dataCrud");
  const [deleModal, setDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const totalTonnage = dataCrud?.data.reduce(
    (acc, item) => acc + (item.tonnage || 0),
    0
  );

  const handleDeleteModal = (item) => {
    setSelectedItem(item);
    setDeleteModal(true);
  };
  return (
    <>
      <Dialog key={dataCrud?.data?.length} open={isOpen} onOpenChange={onClose}>
        <DialogContent className="w-[650px]">
          <DialogHeader>
            <div className="flex gap-2 items-center">
              <div>
                <ReceiptText className="w-6 h-6 text-zinc-400 " />
              </div>
              <div>
                <DialogTitle>Detalles de Plan</DialogTitle>
                <DialogDescription>
                  Información del plan seleccionado
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
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
                      {dataCrud?.data[0]?.dateString}
                    </th>
                    <th className="bg-[#FF5000]"></th>
                  </tr>
                </thead>

                <tbody>
                  {dataCrud?.data.map((item, index) => (
                    <tr key={item._id} className="">
                      <td className="text-center border border-[#FF500030] bg-[#959493] text-white">
                        {index + 1}
                      </td>

                      <td className="px-3 py-1.5 border border-[#FF500030] ">
                        {item.frontLabor}
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

                  {/* TOTAL */}
                  <tr className="bg-gray-800 text-white font-bold">
                    <td className="border border-[#FF500030]"></td>
                    <td className="px-3 py-1.5 border border-[#FF500030]">
                      TOTAL
                    </td>
                    <td className="border border-[#FF500030]"></td>
                    <td className="px-3 py-1.5 border border-[#FF500030] text-right text-lg">
                      {totalTonnage?.toLocaleString()} TM
                    </td>
                    <td className="border border-[#FF500030]"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ModalDelete
        isOpen={deleModal}
        onClose={() => {
          setDeleteModal(false);
          setSelectedItem(null);
          onClose();
        }}
        urlDelete={`planDay/${selectedItem?._id}`}
        itemId={selectedItem?._id}
        queryKeyToUpdate={"planDay"}
      />
    </>
  );
};
