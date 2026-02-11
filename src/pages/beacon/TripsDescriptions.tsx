import { useMemo, useState, useEffect } from "react";
import { useFetchData } from "../../hooks/useGlobalQueryV2";
// Components
import { Calendar } from "react-date-range";
import PageHeader from "@/components/PageHeaderV2";
import XRangeTripsChartHistorico from "@/components/Dashboard/Charts//XRangeTripsChartHistorico";
// Types
import type { BeaconCycle } from "../../types/Beacon";
// Utils
import { format } from "date-fns";
import { MultiSelect } from "@/components/Configuration/MultiSelect";

const TripsDescriptionRT = () => {
  const [routeFilter, setRouteFilter] = useState<string[]>([]);
  const [shiftFilter, setShiftFilter] = useState<string>("dia");
  const [isTooltipOpen, setIsTooltipOpen] = useState<boolean>(false);
  const [dateFilter, setDateFilter] = useState<Date>(new Date());

  const {
    data = [],
    refetch,
    isFetching,
    isLoading: tripsLoading,
    isError: tripsError,
  } = useFetchData<BeaconCycle[]>(
    "trip-group-by-current-day-truck-historico",
    `beacon-track/trip?startDate=${format(dateFilter, "yyyy-MM-dd")}&endDate=${format(dateFilter, "yyyy-MM-dd")}${shiftFilter ? `&shift=${shiftFilter}` : ""}`,
  );

  const routeOptions = useMemo(() => {
    const trips = (data || []).flatMap((u) => u.trips || []);
    const routes = trips.map((t) => `${t.startUbication} → ${t.endUbication}`);
    return Array.from(new Set(routes)).sort();
  }, [data]);

  const filteredData = useMemo(() => {
    if (!routeFilter?.length) return data;

    return data
      .map((unit) => {
        const trips = unit.trips.filter((t) =>
          routeFilter.some((route) => {
            const [startR, endR] = route.split(" → ");
            return t.startUbication === startR && t.endUbication === endR;
          }),
        );

        return { ...unit, trips, totalTrips: trips.length };
      })
      .filter((unit) => unit.trips.length > 0);
  }, [data, routeFilter]);

  const formatData = useMemo(() => {
    return filteredData
      .sort((a, b) => a.unit.localeCompare(b.unit))
      .map((unit) => {
        return {
          ...unit,
          allTrips: [
            ...unit.trips,
            ...unit.beforeInitialTrips.map((trip) => ({
              ...trip,
              endUbication: "",
            })),
            ...unit.uncompletedTrips.map((trip) => ({
              ...trip,
              endUbication: "",
            })),
          ].sort(
            (a, b) =>
              new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
          ),
        };
      });
  }, [filteredData]);

  useEffect(() => {
    refetch();
  }, [shiftFilter, dateFilter]);

  return (
    <div className="flex flex-col flex-1 w-full gap-4">
      <PageHeader
        title="Linea de Tiempo por Turno / Histórico"
        description={`Información en tiempo real de los viajes realizados por los equipos del ${format(dateFilter, "dd-MM-yyyy")}.`}
        refetch={refetch}
        isFetching={isFetching}
        setDialogOpen={false}
        className="col-span-2 mb-2"
        count={data.length}
        actions={
          <div className="flex flex-row gap-2">
            <div className="flex flex-row items-center gap-1">
              <span className="flex bg-[#ff5000] w-2 h-2 rounded-full" />
              <p className="text-[11px] font-bold">Viajes</p>
            </div>
            <div className="flex flex-row items-center gap-1">
              <span className="flex bg-[#66d20e] w-2 h-2 rounded-full" />
              <p className="text-[11px] font-bold">Bocamina</p>
            </div>
            <div className="flex flex-row items-center gap-1">
              <span className="flex bg-[#dbdbdb] w-2 h-2 rounded-full" />
              <p className="text-[11px] font-bold">Otros</p>
            </div>
          </div>
        }
        actionsRight={
          <div className="relative flex flex-row gap-2">
            <label className="flex flex-col gap-0.5 text-[12px] font-bold">
              Ruta :
              <div>
                <MultiSelect
                  placeholder={"Selecciona ruta..."}
                  options={routeOptions.map((r) => ({ value: r, label: r }))}
                  value={routeFilter}
                  onChange={setRouteFilter}
                />
              </div>
            </label>
            <label className="flex flex-col gap-0.5 text-[12px] font-bold">
              Turno
              <select
                value={shiftFilter}
                onChange={(e) => setShiftFilter(e.target.value)}
                className="text-[12px] font-bold px-2 py-1 bg-white text-black rounded-md hover:bg-gray-100 border border-gray-600"
              >
                <option value="dia">Turno Día</option>
                <option value="noche">Turno Noche</option>
              </select>
            </label>
            <label className="flex flex-col gap-0.5 text-[12px] font-bold">
              Fecha
              <button
                onClick={() => setIsTooltipOpen(!isTooltipOpen)}
                className="text-[12px] font-bold px-2 py-1 bg-white text-black rounded-md hover:bg-gray-100 border border-gray-600"
              >
                {dateFilter && `${format(dateFilter, "dd/MM/yyyy")}`}
              </button>
            </label>
            {isTooltipOpen && (
              <div className="absolute right-0 top-10 z-10 mt-2 bg-white border border-gray-300 rounded-md shadow-lg">
                <Calendar
                  editableDateInputs={false}
                  onChange={(item) => {
                    setDateFilter(item);
                    setIsTooltipOpen(false);
                  }}
                  date={dateFilter}
                />
              </div>
            )}
          </div>
        }
      />
      <div className="col-span-2 border border-zinc-100 shadow-sm rounded-xl p-3">
        <XRangeTripsChartHistorico
          data={formatData}
          isLoading={isFetching || tripsLoading}
          isError={tripsError}
        />
      </div>
    </div>
  );
};

export default TripsDescriptionRT;
