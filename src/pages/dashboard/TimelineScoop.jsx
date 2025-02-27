import CardTimeline from "@/components/Dashboard/CardTimeline";
import { useGraphicData } from "@/hooks/useGraphicData";

export default function TimelineScoop() {
  const { data, isLoading, isError } = useGraphicData(
    "scoop-activities-per-hour",
    "dashboard/scoop/activities-per-hour",
  );
  return (
    <div className="flex-1 w-full h-full">
      <CardTimeline data={data} isLoading={isLoading} isError={isError} />
    </div>
  );
}
