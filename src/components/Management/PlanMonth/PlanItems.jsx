import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { formatDay, formatFecha, getMonthName } from "@/lib/utilsGeneral";

export default function PlanItems({ data, setSelectedPlan, selectedPlan }) {
  return (
    <div className="flex flex-col gap-1 h-[40vh] overflow-y-auto w-[15%]">
      {data.map((item) => (
        <div
          key={item._id}
          className={cn(
            " items-center px-2 py-2.5 cursor-pointer hover:bg-zinc-100 rounded-lg select-none border",
            item._id === selectedPlan?._id
              ? "border-primary bg-primary/5"
              : "border-zinc-100",
          )}
          onClick={() => setSelectedPlan(item)}
        >
          <div className="flex items-center ">
            <div
              className={cn(
                "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                item._id === selectedPlan?._id
                  ? "bg-primary text-white border-primary"
                  : "opacity-50 [&_svg]:invisible text-zinc-200",
              )}
            >
              <Check className="size-3" />
            </div>
            <div className="flex flex-col justify-center gap-0.5">
              <h4 className="text-[12.5px] font-semibold leading-4 flex capitalize">
                {getMonthName(item.month)} /{" "}
                <span className="text-zinc-500 pl-1">#Sem {item.week}</span>
              </h4>
              <span className="text-[11px] leading-3 text-zinc-400 md:inline capitalize ">
                {formatDay(item.startDate)} - {formatDay(item.endDate)}
              </span>
            </div>
          </div>
          <div className="mt-2 flex flex-col justify-center pl-5">
            <span className="text-[11px] leading-3 text-zinc-400 md:inline lowercase">
              Fecha de creación {formatFecha(item.createdAt)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
