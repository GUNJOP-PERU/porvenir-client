import CardTimeline from "@/components/Dashboard/CardTimeline";
import CardTitle from "@/components/Dashboard/CardTitle";
import { useToast } from "@/hooks/useToaster";
import IconDash1 from "@/icons/Dashboard/IconDash1";

export default function TimelineScoop() {

  return (
    <div className="flex-1 grid grid-rows-1 gap-2 grid-cols-1">
      <div className=" border border-[#F0F0F0] shadow-sm rounded-2xl flex flex-col gap-1 px-4 p-3">
        <CardTitle
          title="Eventos por vehiculo y labor"
          subtitle="Eventos por vehículo y tipo de labor.."
          icon={IconDash1}
        />
        <CardTimeline />
      </div>
     
    </div>
  );
}
