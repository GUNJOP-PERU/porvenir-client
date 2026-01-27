import { columns } from "@/components/Management/PlanMonth/columns";
import PlanDetails from "@/components/Management/PlanMonth/PlanDetails";
import PlanItems from "@/components/Management/PlanMonth/PlanItems";
import PageHeader from "@/components/PageHeader";
import { DataTable } from "@/components/Table/DataTable";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFetchData } from "@/hooks/useGlobalQueryV2";
import { countItems } from "@/lib/utilsGeneral";
import dayjs from "dayjs";
import { CircleFadingPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function PlanMonth() {
  const [selectedDate, setSelectedDate] = useState(dayjs().startOf("month"));
  const [selectedPlan, setSelectedPlan] = useState(null);

  const {
    data = [],
    isFetching,
    isError,
    isLoading,
    refetch,
  } = useFetchData(
    "planMonth",
    `planMonth?date=${dayjs(selectedDate).format("YYYY-MM")}`,
  );

  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const currentYear = dayjs().year();
  const years = Array.from({ length: 3 }, (_, i) => currentYear - 2 + i);

  const updateDate = (month, year) => {
    setSelectedDate(dayjs().year(year).month(month).startOf("month"));
  };

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
        title="Gestión de Plan Mensual"
        description="Administre los planes y sus características."
        count={countItems(data)}
        refetch={refetch}
        isFetching={isFetching}
        actions={
          <Link to="/plan/monthly/new">
            <Button className="w-fit">
              <CircleFadingPlus className="w-5 h-5 text-white" />
              Añadir nuevo
            </Button>
          </Link>
        }
      />

      <div className="flex">
        <div className="border border-zinc-200 rounded-lg flex">
          <Select
            value={selectedDate.month().toString()}
            onValueChange={(value) =>
              setSelectedDate(selectedDate.month(parseInt(value)))
            }
          >
            <SelectTrigger className="w-28 border-none shadow-none bg-transparent rounded-e-none">
              <SelectValue placeholder="Mes" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month, index) => (
                <SelectItem key={index} value={index.toString()}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedDate.year().toString()}
            onValueChange={(value) =>
              setSelectedDate(selectedDate.year(parseInt(value)))
            }
          >
            <SelectTrigger className="w-20 border-none shadow-none bg-transparent rounded-s-none">
              <SelectValue placeholder="Año" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex gap-4 w-full">
        <PlanItems
          data={data}
          setSelectedPlan={setSelectedPlan}
          selectedPlan={selectedPlan}
        />
        <PlanDetails plan={selectedPlan} />
      </div>
    </>
  );
}

export default PlanMonth;
