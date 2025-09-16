import CardTimeline from "@/components/Dashboard/TimeDistribution/CardTimeline";
import { useGraphicData } from "@/hooks/useGraphicData";

export default function TimelineTruck() {
  const { data, isLoading, isError } = useGraphicData(
    "truck-activities-per-hour",
    "dashboard/truck/activities-per-hour",
  );

  return (
    <div className="flex-1 w-full h-full">
      <CardTimeline data={data} isLoading={isLoading} isError={isError} />
    </div>
  );
}
