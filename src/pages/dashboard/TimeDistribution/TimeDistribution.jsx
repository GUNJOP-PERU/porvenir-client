import Body from "@/components/Dashboard/TimeDistribution/Body";
import { useFetchDataRealtime } from "@/hooks/useGraphicData";
import { useSocketTopicValue } from "@/hooks/useSocketValue";

export default function TimeDistribution() {
  useSocketTopicValue("truck-progress-day", [
    "shift-variable",
    "truck-progress-day",
  ]);
  useSocketTopicValue("truck-job-cycle", ["shift-variable", "truck-job-cycle"]);

  useSocketTopicValue("pareto-truck-improductive-activities-by-shift", [
    "shift-variable",
    "truck-improductive-activities",
  ]);

  useSocketTopicValue("truck-activities-per-hour", [
    "shift-variable",
    "truck-activities-per-hour",
  ]);

  const { data: progressDay } = useFetchDataRealtime({
    queryKey: ["shift-variable", "truck-progress-day"],
    endpoint: "dashboard/truck/progress-day",
  });

  const {
    data: jobCycle,
    isLoading: isLoadingJobCycle,
    isError: isErrorJobCycle,
  } = useFetchDataRealtime({
    queryKey: ["shift-variable", "truck-job-cycle"],
    endpoint: "dashboard/truck/job-cycle",
  });

  const {
    data: improductiveActivities,
    isLoading: isLoadingImproductiveActivities,
    isError: isErrorImproductiveActivities,
  } = useFetchDataRealtime({
    queryKey: ["shift-variable", "truck-improductive-activities"],
    endpoint:
      "dashboard/pareto/truck/no-productive-activities-chart-by-shift?quantity=7",
  });
  const {
    data: timelineTrucks,
    isLoading,
    isError,
  } = useFetchDataRealtime({
    queryKey: ["shift-variable", "truck-activities-per-hour"],
    endpoint: "dashboard/truck/activities-per-hour",
  });

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-bold leading-none">
          Distribución de tiempos volquetes Tiempo real
        </h1>
      </div>

      <Body
        progressDay={progressDay}
        jobCycle={jobCycle}
        improductiveActivities={improductiveActivities}
        timelineTrucks={timelineTrucks}
        isLoading={isLoading}
        isError={isError}
        isLoadingJobCycle={isLoadingJobCycle}
        isErrorJobCycle={isErrorJobCycle}
        isLoadingImproductiveActivities={isLoadingImproductiveActivities}
        isErrorImproductiveActivities={isErrorImproductiveActivities}
      />
    </>
  );
}
