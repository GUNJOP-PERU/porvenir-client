import { useEffect, useState } from "react";
// import DonutChart from "@/components/Dashboard/Charts/DonutChart";
import DonutAndSplineChartByDay from "@/components/Dashboard/Charts/DonutAndSplineChartByDay";
import LineAndBarChartByDay from "@/components/Dashboard/Charts/LineAndBarChartByDay";
import DonutAndTableChart from "@/components/Dashboard/Charts/DonutAndTableChart"
import { useFetchData } from "../../hooks/useGlobalQueryV2";
import CardItem from "@/components/Dashboard/CardItem";
// Types
import type { BeaconCycle, BeaconTrip } from "../../types/Beacon";
import type { Mineral } from "@/types/Mineral";
// Utils
import { getCurrentWeekStartEndDates } from "@/utils/dateUtils";
import { format } from "date-fns";

const RealTimeByHour = () => {
  const [baseStats, setBaseStats] = useState({
    totalUnits: 0,
    totalUnitsDay: 0,
    totalUnitsNight: 0,
    totalTrips: 0,
    totalTM: 0,
    totalDuration: 0,
    dayTrips: 0,
    nightTrips: 0,
    totalTMNight: 0,
    totalTMDay: 0
  });
  const [ baseData, setBaseData ] =  useState({mineral: 36, desmonte: 40});
  const [dateFilter, setDateFilter] = useState({
    startDate: getCurrentWeekStartEndDates().startDateString,
    endDate: getCurrentWeekStartEndDates().endDateString,
  });
  const [tripsByDay, setTripsByDay] = useState<{ date: string, trips: BeaconTrip[]}[]>([]);

  const {
    data,
    refetch,
  } = useFetchData<BeaconCycle[]>(
    "trip-group-by-days",
    `beacon-track/trip?startDate=${dateFilter.startDate}&endDate=${dateFilter.endDate}`
  );

  const {
    data : mineralData,
    refetch: refetchMineral,
  } = useFetchData<Mineral[]>("mineral", "mineral");

  useEffect(() => {
    if(mineralData && mineralData.length > 0) {
      const mineral = mineralData.find(charge => charge.name === "Mineral")?.value || 36;
      const desmonte = mineralData.find(charge => charge.name === "Desmonte")?.value || 40;
      setBaseData({ mineral, desmonte });
    }
  }, [mineralData])

  useEffect(() => {    
    const interval = setInterval(() => {
      refetch();
      refetchMineral();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if(data && mineralData) {
      const totalUnits = data.length;
      const totalUnitsDay = data.length;
      const totalUnitsNight = data.length
      const totalTrips = data.reduce((acc, day) => acc + day.totalTrips, 0);
      const totalTM = data.reduce((acc, day) => acc + (day.totalTrips * baseData.mineral), 0);
      const totalDuration = data.reduce((acc, tripsTruck) => acc + tripsTruck.trips.reduce((innerAcc, trip) => innerAcc + parseFloat(trip.totalDuration), 0), 0);
      const dayTrips = data.reduce((acc, day) => acc + day.trips.filter(trip => trip.shift === "dia").length, 0);
      const nightTrips = data.reduce((acc, day) => acc + day.trips.filter(trip => trip.shift === "noche").length, 0);
      const totalTMDay = dayTrips * baseData.mineral;
      const totalTMNight = nightTrips * baseData.mineral;

      setBaseStats({
        totalUnits,
        totalUnitsDay,
        totalUnitsNight,
        totalTrips,
        totalTM,
        totalDuration,
        dayTrips,
        nightTrips,
        totalTMDay,
        totalTMNight
      });
    }
    if(data){
      const trips = data.map((unitGroup) => unitGroup.trips).flat();
      const grouped: Record<string, BeaconTrip[]> = trips.reduce((acc, trip) => {
        const day = format(new Date(trip.startDate), 'yyyy-MM-dd');
        if (!acc[day]) acc[day] = [];
        acc[day].push(trip);
        return acc;
      }, {} as Record<string, BeaconTrip[]>);
      const groupedArray = Object.entries(grouped).map(([date, trips]) => ({ date, trips }));
      setTripsByDay(groupedArray);
    }
  }, [data, mineralData])

  if(!data || !mineralData) return <p>cargando</p>

  return (
    <div className="flex flex-col h-full gap-10">
      <div className="grid grid-cols-6 gap-4">
        <CardItem
          value={baseStats.totalUnits}
          title="Total de Camiones"
          valueColor= "text-[#000000]"
          unid="camiones"
        />
        <CardItem
          value={baseStats.totalTrips}
          title="Viajes Totales"
          valueColor= "text-[#1E64FA]"
          unid="viajes"
        />
        <CardItem
          value={baseStats.dayTrips}
          subtitle={baseStats.totalTMDay}
          subtitleUnid="TM"
          title="Viajes Diurnos"
          valueColor= "text-[#fac34c]"
          unid="viajes"
        />
        <CardItem
          value={baseStats.nightTrips}
          title="Viajes Nocturnos"
          subtitle={baseStats.totalTMNight}
          subtitleUnid="TM"
          valueColor= "text-[#3c3f43]"
          unid="viajes"
        />
        <CardItem
          value={baseStats.totalDuration/60}
          title="Duración Total (horas)"
          valueColor= "text-[#1E64FA]"
          unid="horas"
        />
        <CardItem
          value={baseStats.totalTM}
          title="Tonelaje Total (TM)"
          valueColor= "text-[#1E64FA]"
          unid="TM"
        />
      </div>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-[1fr_1fr] rounded-lg p-4 gap-4 card-shadow">
          <DonutAndSplineChartByDay
            title="Acumulado de Extracción de mineral Turno Día en TM"
            donutData={{
              total: 1200*7,
              currentValue: baseStats.totalTMDay,
              currentValueColor: "#fac34c",
            }}
            progressBarData= {{
              total: 1200*7,
              currentValue: baseStats.totalTMDay,
              prediction: (baseStats.totalTMDay / baseStats.totalUnitsDay) * 7,
              currentValueColor: "#ff7989",
              showDifference: false,
              forecastText: "Predicción"
            }}
            mineralWeight={baseData.mineral}
            chartData={{
              totalTrips: baseStats.dayTrips,
              statsByDay: tripsByDay.map(dayGroup => ({
                date: dayGroup.date,
                totalTrips: dayGroup.trips.filter(trip => trip.shift === "dia").length
              }))
            }}
          />
          <DonutAndSplineChartByDay
            title="Acumulado de Extracción de mineral Turno Noche en TM"
            donutData={{
              total: 1200*7,
              currentValue: baseStats.totalTMNight,
              currentValueColor: "#3c3f43",
            }}
            progressBarData= {{
              total: 1200*7,
              currentValue: baseStats.totalTMNight,
              prediction: (baseStats.totalTMNight / baseStats.totalUnitsNight) * 7,
              currentValueColor: "#ff7989",
              showDifference: false,
              forecastText: "Predicción"
            }}
            mineralWeight={baseData.mineral}
            chartData={{
              totalTrips: baseStats.nightTrips,
              statsByDay: tripsByDay.map(dayGroup => ({
                date: dayGroup.date,
                totalTrips: dayGroup.trips.filter(trip => trip.shift === "noche").length
              }))
            }}
          />
        </div>

        <div className="grid grid-cols-[1fr_1fr] gap-4">
          <div className="card-shadow rounded-lg p-2">
            <LineAndBarChartByDay
              title="Extracción de mineral turno Dia en TM"
              mineralWeight={baseData.mineral}
              chartColor="#fac34c"
              chartData={{
                totalTrips: baseStats.dayTrips,
                statsByDay: tripsByDay.map(dayGroup => ({
                  date: dayGroup.date,
                  totalTrips: dayGroup.trips.filter(trip => trip.shift === "dia").length
                }))
              }}
            />
          </div>

          <div className="card-shadow rounded-lg p-2">
            <LineAndBarChartByDay
              title="Extracción de mineral turno Noche en TM"
              mineralWeight={baseData.mineral}
              chartColor="#3c3f43"
              chartData={{
                totalTrips: baseStats.nightTrips,
                statsByDay: tripsByDay.map(dayGroup => ({
                  date: dayGroup.date,
                  totalTrips: dayGroup.trips.filter(trip => trip.shift === "noche").length
                }))
              }}
            />
          </div>
        </div>

        {/* <div className="grid grid-cols-[1fr] gap-4">
          <div className="card-shadow rounded-lg p-4 ">
            <LineAndBarChartByDay
              title="Extracción de mineral por dia en TM"
              chartData={data}
              mineralWeight={baseData.mineral}
            />
          </div>
          <div className="card-shadow rounded-lg p-4 ">
            <DonutAndTableChart
              title="Tiempos promedio del ciclo por Dia"
              donutData={[
                { title: "Tiempo Disponible",
                  total: 24 * data.totalUnits * data.statsByDay.length,
                  currentValue: Number((24 * data.totalUnits * data.statsByDay.length) - data.statsByDay.reduce((acc, day) => acc + day.totalMaintenanceTime, 0).toFixed(1)) || 0,
                  currentValueColor: "#04c285"
                },
                { title: "Tiempo Trabajado",
                  total: 24 * data.totalUnits * data.statsByDay.length,
                  currentValue: Number(data.statsByDay.reduce((acc, day) => acc + day.totalCycleTime, 0).toFixed(1)) || 0,
                  currentValueColor: "#04c285"
                }
              ]}
              tableData={[{
                  title: "Tiempo promedio del Ciclo",
                  currentValue: data.statsByDay.reduce((acc, day) => acc + day.avgCycleTime/data.statsByDay.length, 0).toFixed(1),
                  total: 300,
                  subData: [
                    { title: "Viaje Vació (min)",
                      currentValue: data.statsByDay.reduce((acc, day) => acc + day.avgEmptyTime/data.statsByDay.length, 0).toFixed(1),
                      total: 300
                      // total: data.statsByDay.reduce((acc, day) => acc + day.avgCycleTime/data.statsByDay.length, 0).toFixed(1)
                    },
                    { title: "Tiempo de Carga (min)",
                      currentValue: data.statsByDay.reduce((acc, day) => acc + day.avgLoadTime/data.statsByDay.length, 0).toFixed(1),
                      total: 300
                      // total: data.statsByDay.reduce((acc, day) => acc + day.avgCycleTime/data.statsByDay.length, 0).toFixed(1)
                    },
                    { title: "Viaje Lleno (min)",
                      currentValue: data.statsByDay.reduce((acc, day) => acc + day.avgFullTime/data.statsByDay.length, 0).toFixed(1),
                      total: 300
                      // total: data.statsByDay.reduce((acc, day) => acc + day.avgCycleTime/data.statsByDay.length, 0).toFixed(1)
                    },
                    { title: "Tiempo de Descarga (min)",
                      currentValue: data.statsByDay.reduce((acc, day) => acc + day.avgDischargeTime/data.statsByDay.length, 0).toFixed(1),
                      total: 300
                      // total: data.statsByDay.reduce((acc, day) => acc + day.avgCycleTime/data.statsByDay.length, 0).toFixed(1)
                    },
                  ]
                },
                // {
                //   title: "FACT",
                //   currentValue: 68,
                //   total: 100,
                //   subData: []
                // }
              ]}
            />
          </div>
        </div> */}
      </div>
    </div>
  )
}

export default RealTimeByHour