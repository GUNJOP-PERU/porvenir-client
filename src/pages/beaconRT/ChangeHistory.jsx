import { columns } from "@/components/Dashboard/ChangeHistory/ChangeHistoryColumns";
import PageHeader from "@/components/PageHeader";
import { DataTable } from "@/components/Table/DataTable";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useFetchGeneral, useFetchTrucks } from "@/hooks/useGlobalQuery";
import { countItems, getDefaultDate } from "@/lib/utilsGeneral";
import { es } from "date-fns/locale";
import dayjs from "dayjs";
import { CalendarIcon, ChevronDown } from "lucide-react";
import { useState, useMemo } from "react";

export default function ChangeHistory() {
  const [date, setDate] = useState(getDefaultDate());

  const {
    data = [],
    isFetching,
    isLoading,
    isError,
    refetch,
  } = useFetchGeneral({
    queryKey: "audit",
    endpoint: "audit-log",
    filters: ``,
  });

  return (
    <>
      <PageHeader
        title="Historial de cambios"
        count={countItems(data || 0)}
        description="Registro de Modificaciones."
        refetch={refetch}
        isFetching={isFetching}
      />

      <DataTable
        data={data}
        columns={columns}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        tableType={"changeHistory"}
        toolbarContent={<></>}
      />
    </>
  );
}
