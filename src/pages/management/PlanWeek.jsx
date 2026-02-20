import PlanDetails from "@/components/Management/PlanMonth/PlanDetails";
import PlanItems from "@/components/Management/PlanMonth/PlanItems";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import LoadingBuild from "@/components/ZShared/LoadingBuild";
import { MonthYearPicker } from "@/components/ZShared/MonthYearPicker";
import { useFetchData } from "@/hooks/useGlobalQueryV2";
import { countItems } from "@/lib/utilsGeneral";
import dayjs from "dayjs";
import { CircleFadingPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function PlanWeek() {
  const [selectedDate, setSelectedDate] = useState(dayjs().startOf("month"));
  const [selectedPlan, setSelectedPlan] = useState(null);

  const {
    data = [],
    isFetching,
    isError,
    isLoading,
    refetch,
  } = useFetchData(
    "planWeek",
    `planWeek?date=${dayjs(selectedDate).format("YYYY-MM")}`,
  );

  useEffect(() => {
    if (data?.length > 0) {
      setSelectedPlan(data[0]);
    } else {
      setSelectedPlan(null);
    }
  }, [data]);

  return (
    <>
      <PageHeader
        title="Gestión de Plan Semanal"
        description="Administre los planes y sus características."
        count={countItems(data)}
        refetch={refetch}
        isFetching={isFetching}
        actions={
          <Link to="/plan/weekly/new">
            <Button className="w-fit">
              <CircleFadingPlus className="w-5 h-5 text-white" />
              Añadir nuevo
            </Button>
          </Link>
        }
      />

      <div className="flex">
        <MonthYearPicker
          value={selectedDate}
          onChange={setSelectedDate}
          disabled={isLoading || isFetching}
        />
      </div>
      <LoadingBuild
        isLoading={isLoading || isFetching}
        isError={isError}
        isEmpty={!isLoading && !isFetching && data.length === 0}
        onRetry={refetch}
      />
      {!isLoading && !isFetching && !isError && data.length > 0 && (
        <div className="flex gap-4 w-full">
          <PlanItems
            data={data}
            setSelectedPlan={setSelectedPlan}
            selectedPlan={selectedPlan}
            mode="weekly"
            urlDelete="planWeek"
          />
          <PlanDetails plan={selectedPlan} mode="weekly" />
        </div>
      )}
    </>
  );
}

export default PlanWeek;
