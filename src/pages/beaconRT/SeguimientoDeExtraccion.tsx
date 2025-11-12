import { useMemo, useState, useEffect } from "react";
import { useFetchData } from "../../hooks/useGlobalQueryV2";
// Components
import PageHeader from "@/components/PageHeaderV2";
import CardTitle from "@/components/Dashboard/CardTitleV2";
import CardItem from "@/components/Dashboard/CardItemV2";
import SplineFrontLaborChart from "@/components/Dashboard/Charts/SplineFrontLaborChart";
import BarChartFrontLabor from "@/components/Dashboard/Charts/BarChartFrontLabor";
// Types
import type { BeaconCycle } from "../../types/Beacon";
import type { Mineral } from "@/types/Mineral";
import type { PlanDay, PlanWeek } from "@/types/Plan";
// Utils
import { format, startOfWeek, endOfWeek } from "date-fns";
import DonutChart from "@/components/Dashboard/Charts/DonutChart";
import { getCurrentDay } from "@/utils/dateUtils";
// Icons
import IconTruck from "@/icons/IconTruck";

const SeguimientoDeExtraccion = () => {
  const [shiftFilter, setShiftFilter] = useState<string>(getCurrentDay().shift);
  const [weekFilter, setWeekFilter] = useState({
    startDate: startOfWeek(new Date(), { weekStartsOn: 1 }),
    endDate: endOfWeek(new Date(), { weekStartsOn: 1 }),
  });
  const [dateFilter, setDateFilter] = useState<
    [{ startDate: Date; endDate: Date; key: string }]
  >([
    {
      startDate: new Date(getCurrentDay().startDate),
      endDate: new Date(getCurrentDay().endDate),
      key: "selection",
    },
  ]);

  const {
    data: mineralTripsData = [],
    refetch: refetchMineral,
    isFetching,
    isLoading: tripsLoading,
    isError: tripsError,
  } = useFetchData<BeaconCycle[]>(
    "trip-group-by-current-day-truck-rt",
    `beacon-track/trip?material=mineral&startDate=${format(
      dateFilter[0].startDate,
      "yyyy-MM-dd"
    )}&endDate=${format(dateFilter[0].endDate, "yyyy-MM-dd")}${
      shiftFilter ? `&shift=${shiftFilter}` : ""
    }`,
    { refetchInterval: 5000 }
  );

  const {
    data: desmonteTripsData = [],
    refetch: refetchDesmonte,
    isFetching: isFetchingDesmonte,
    isLoading: desmonteLoading,
    isError: desmonteError,
  } = useFetchData<BeaconCycle[]>(
    "trip-group-by-current-day-truck-rt",
    `beacon-track/trip?material=desmonte&startDate=${format(
      dateFilter[0].startDate,
      "yyyy-MM-dd"
    )}&endDate=${format(dateFilter[0].endDate, "yyyy-MM-dd")}${
      shiftFilter ? `&shift=${shiftFilter}` : ""
    }`,
    { refetchInterval: 5000 }
  );

  const { data: mineralData } = useFetchData<Mineral[]>("mineral", "mineral", {
    refetchInterval: 5000,
  });

  const { data: beaconTruck = [] } = useFetchData<{ status: string }[]>(
    "beacon-truck",
    "beacon-truck",
    { refetchInterval: 10000 }
  );

  const { data: planData = [], refetch: refetchPlanDay } = useFetchData<
    PlanDay[]
  >(
    "planday-rt",
    `planDay/by-date-range?startDate=${format(
      dateFilter[0].startDate,
      "yyyy-MM-dd"
    )}&endDate=${format(dateFilter[0].endDate, "yyyy-MM-dd")}&type=modificado`,
    { refetchInterval: 5000 }
  );

  const baseData = useMemo(() => {
    const mineral =
      mineralData?.find((charge) => charge.name === "Mineral")?.value || 36;
    const desmonte =
      mineralData?.find((charge) => charge.name === "Desmonte")?.value || 40;
    return { mineral, desmonte };
  }, [mineralData]);

  const planDay = useMemo(() => {
    const mineralPlan = planData.filter(
      (plan) =>
        plan.phase === "mineral" &&
        plan.shift === shiftFilter
    );
    const desmontePlan = planData.filter(
      (plan) =>
        plan.phase === "desmonte" &&
        plan.shift === shiftFilter
    );
    const totalTonnage = planData.reduce((acc, plan) => acc + plan.tonnage, 0);
    const mineralTonnage = mineralPlan.reduce(
      (acc, plan) => acc + plan.tonnage,
      0
    );
    const desmonteTonnage = desmontePlan.reduce(
      (acc, plan) => acc + plan.tonnage,
      0
    );
    const mineralTrips = mineralTonnage / baseData.mineral;
    const desmonteTrips = desmonteTonnage / baseData.desmonte;
    const totalTrips = mineralTrips + desmonteTrips;

    return {
      mineralPlan,
      desmontePlan,
      totalTonnage,
      mineralTonnage,
      desmonteTonnage,
      mineralTrips,
      desmonteTrips,
      totalTrips,
    };
  }, [planData, shiftFilter, baseData]);

  const mineralTrips = useMemo(() => {
    if (mineralTripsData.length === 0) return [];

    const allTrips = mineralTripsData.map((unit) => unit.trips).flat();

    return allTrips.map((trip) => ({
      ...trip,
      frontLabor: trip.frontLaborList[0]
        ? trip.frontLaborList[0].name
        : "Otros",
    }));
  }, [mineralTripsData]);

  const desmonteTrips = useMemo(() => {
    if (desmonteTripsData.length === 0) return [];

    const allTrips = desmonteTripsData.map((unit) => unit.trips).flat();

    return allTrips.map((trip) => ({
      ...trip,
      frontLabor: trip.frontLaborList[0]
        ? trip.frontLaborList[0].name
        : "Otros",
    }));
  }, [mineralTripsData]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (getCurrentDay().shift !== shiftFilter) {
        setShiftFilter(getCurrentDay().shift);
        setDateFilter([
          {
            startDate: new Date(getCurrentDay().startDate),
            endDate: new Date(getCurrentDay().endDate),
            key: "selection",
          },
        ]);
        refetchMineral();
        refetchDesmonte();
        refetchPlanDay();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [shiftFilter]);

  return (
    <div className="flex flex-1 flex-col gap-2">
      <PageHeader
        title="Seguimiento de Extracción / Plan de Campo"
        description={`Reporte en tiempo real de los viajes realizados por los camiones del ${format(
          dateFilter[0].startDate,
          "dd-MM-yyyy"
        )}.`}
        className="col-span-2"
        refetch={() => {
          refetchMineral();
          refetchDesmonte();
        }}
        isFetching={isFetching}
        setDialogOpen={false}
        status={[
          {
            value: beaconTruck.filter((unit) => unit.status === "operativo")
              .length,
            color: "#2fd685",
          },
          {
            value: beaconTruck.filter((unit) => unit.status === "mantenimiento")
              .length,
            color: "#e6bf27",
          },
          {
            value: beaconTruck.filter((unit) => unit.status === "inoperativo")
              .length,
            color: "#ff4d4f",
          },
        ]}
      />

      <div className="grid grid-cols-[8fr_2fr] gap-2">
        <div className="flex flex-col">
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_250px] gap-2">
            <div className="w-full gap-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-[repeat(auto-fit,minmax(150px,1fr))]">
              <CardItem
                value={planDay.totalTonnage}
                title="Tonelaje Programado (TM)"
                valueColor="text-[#000000]"
                unid="tm"
              />
              <CardItem
                value={
                  mineralTrips.length * baseData.mineral +
                  desmonteTrips.length * baseData.desmonte
                }
                title="Tonelaje Ejecutado (TM)"
                valueColor="text-[#f79d65]"
                unid="tm"
              />
              <CardItem
                value={
                  mineralTrips.length * baseData.mineral +
                  desmonteTrips.length * baseData.desmonte -
                  planDay.totalTonnage
                }
                title="Variación (TM)"
                valueColor="text-[#d4a373]"
                unid="tm"
              />
              <CardItem
                value={planDay.totalTrips}
                title="Viajes Programados"
                valueColor="text-[#00a6fb]"
                unid="viajes"
              />
              <CardItem
                value={mineralTrips.length + desmonteTrips.length}
                title="Viajes Ejecutados"
                valueColor="text-[#02c39a]"
                unid="viajes"
              />
              <CardItem
                value={
                  mineralTrips.length +
                  desmonteTrips.length -
                  planDay.totalTrips
                }
                title="Variaciones Viajes"
                valueColor="text-[#076594]"
                unid="viajes"
              />
            </div>
            <DonutChart
              title="Cumplimiento del tonelaje programado"
              size="medium"
              type="pie"
              donutData={{
                currentValue:
                  mineralTrips.length * baseData.mineral +
                  desmonteTrips.length * baseData.desmonte,
                total: planDay.totalTonnage ? planDay.totalTonnage : 1,
                currentValueColor: "#ff5000",
              }}
            />
          </div>

          {planDay.mineralPlan.length > 0 ? (
            <CardTitle
              title="Mineral Extraído por Tajo"
              icon={IconTruck}
              classIcon="fill-yellow-500 h-7 w-14"
              className="custom-class"
              actions={
                <div className="flex flex-row gap-2">
                  <div className="flex flex-row items-center gap-1">
                    <span className="flex bg-[#ff5000] w-2 h-2 rounded-full" />
                    <p className="text-[11px] font-bold">Mineral Extraído</p>
                  </div>
                  <div className="flex flex-row items-center gap-1">
                    <span className="flex bg-[#A6A6A6] w-2 h-2 rounded-full" />
                    <p className="text-[11px] font-bold">Planificado</p>
                  </div>
                </div>
              }
            >
              <div className="w-full gap-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-[repeat(auto-fit,minmax(150px,1fr))]">
                <CardItem
                  value={planDay.mineralTonnage}
                  title="Tonelaje Programado (TM)"
                  valueColor="text-[#000000]"
                  unid="tm"
                />
                <CardItem
                  value={mineralTrips.length * baseData.mineral}
                  title="Tonelaje Ejecutado (TM)"
                  valueColor="text-[#f79d65]"
                  unid="tm"
                />
                <CardItem
                  value={
                    mineralTrips.length * baseData.mineral -
                    planDay.mineralTonnage
                  }
                  title="Variación (TM)"
                  valueColor="text-[#d4a373]"
                  unid="tm"
                />
                <CardItem
                  value={planDay.mineralTrips}
                  title="Viajes Programados"
                  valueColor="text-[#00a6fb]"
                  unid="viajes"
                />
                <CardItem
                  value={mineralTrips.length}
                  title="Viajes Ejecutados"
                  valueColor="text-[#02c39a]"
                  unid="viajes"
                />
                <CardItem
                  value={mineralTrips.length - planDay.mineralTrips}
                  title="Variaciones Viajes"
                  valueColor="text-[#076594]"
                  unid="viajes"
                />
              </div>
              <div className="flex flex-row gap-2">
                <SplineFrontLaborChart
                  mineralWeight={baseData.mineral}
                  trips={mineralTrips}
                  planDay={planDay.mineralPlan}
                />
                <DonutChart
                  title="Avance de Extracción de Mineral"
                  size="medium"
                  donutData={{
                    currentValue: mineralTrips.length * baseData.mineral,
                    total: planDay.mineralTonnage,
                    currentValueColor: "#ff5000",
                  }}
                />
              </div>
            </CardTitle>
          ) : (
            <div className="flex justify-center items-center  border border-zinc-100 shadow-sm rounded-xl p-3 w-full h-50">
              <p>Agrega un plan de desmonte para ver los datos.</p>
            </div>
          )}

          {planDay.desmontePlan.length > 0 ? (
            <CardTitle
              title="Desmonte Extraído por Tajo"
              icon={IconTruck}
              classIcon="fill-yellow-500 h-7 w-14"
              className="custom-class"
              actions={
                <div className="flex flex-row gap-2">
                  <div className="flex flex-row items-center gap-1">
                    <span className="flex bg-[#ff5000] w-2 h-2 rounded-full" />
                    <p className="text-[11px] font-bold">Desmonte Extraído</p>
                  </div>
                  <div className="flex flex-row items-center gap-1">
                    <span className="flex bg-[#A6A6A6] w-2 h-2 rounded-full" />
                    <p className="text-[11px] font-bold">Planificado</p>
                  </div>
                </div>
              }
            >
              <div className="w-full gap-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-[repeat(auto-fit,minmax(150px,1fr))]">
                <CardItem
                  value={planDay.desmonteTonnage}
                  title="Tonelaje Programado (TM)"
                  valueColor="text-[#000000]"
                  unid="tm"
                />
                <CardItem
                  value={desmonteTrips.length * baseData.desmonte}
                  title="Tonelaje Ejecutado (TM)"
                  valueColor="text-[#f79d65]"
                  unid="tm"
                />
                <CardItem
                  value={
                    desmonteTrips.length * baseData.desmonte -
                    planDay.desmonteTonnage
                  }
                  title="Variación (TM)"
                  valueColor="text-[#d4a373]"
                  unid="tm"
                />
                <CardItem
                  value={planDay.desmonteTonnage}
                  title="Viajes Programados"
                  valueColor="text-[#00a6fb]"
                  unid="viajes"
                />
                <CardItem
                  value={desmonteTrips.length}
                  title="Viajes Ejecutados"
                  valueColor="text-[#02c39a]"
                  unid="viajes"
                />
                <CardItem
                  value={desmonteTrips.length - planDay.desmonteTrips}
                  title="Variaciones Viajes"
                  valueColor="text-[#076594]"
                  unid="viajes"
                />
              </div>
              <div className="flex flex-row gap-2">
                <SplineFrontLaborChart
                  mineralWeight={baseData.desmonte}
                  trips={desmonteTrips}
                  planDay={planDay.desmontePlan}
                />
                <DonutChart
                  title="Avance de Extracción de Desmonte"
                  size="medium"
                  donutData={{
                    currentValue: planDay.desmonteTonnage
                      ? desmonteTrips.length * baseData.desmonte
                      : 1,
                    total: planDay.desmonteTonnage
                      ? planDay.desmonteTonnage
                      : 1,
                    currentValueColor: "#ff5000",
                  }}
                />
              </div>
            </CardTitle>
          ) : (
            <div className="flex justify-center items-center  border border-zinc-100 shadow-sm rounded-xl p-3 w-full h-50">
              <p>Agrega un plan de desmonte para ver los datos.</p>
            </div>
          )}
        </div>

        <div className="row-span-3">
          <DonutChart
            title="Cumplimiento del tonelaje Semanal"
            size="large"
            type="pie"
            donutData={{
              currentValue:
                mineralTrips.length * baseData.mineral +
                desmonteTrips.length * baseData.desmonte,
              total: 12500,
              currentValueColor: "#ff5000",
            }}
          />
          <BarChartFrontLabor
            title="VH - Producción"
            color="#ff5000"
            trips={mineralTrips}
          />
          <BarChartFrontLabor
            title="VH - Avances"
            color="#b8b8b8"
            trips={planDay.mineralPlan}
          />
        </div>
      </div>
    </div>
  );
};

export default SeguimientoDeExtraccion;
