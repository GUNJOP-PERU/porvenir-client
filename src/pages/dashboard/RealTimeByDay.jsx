import { useEffect, useState } from "react";
// import DonutChart from "@/components/Dashboard/Charts/DonutChart";
import DonutAndSplineChartByDay from "@/components/Dashboard/Charts/DonutAndSplineChartByDay";
import LineAndBarChartByDay from "@/components/Dashboard/Charts/LineAndBarChartByDay";
import DonutAndTableChart from "@/components/Dashboard/Charts/DonutAndTableChart"
import { useFetchData } from "../../hooks/useGlobalQuery";
import { set, addDays, subDays } from "date-fns";

const RealTimeByHour = () => {
  const [ baseData, setBaseData ] =  useState({
    mineral: 30,
    desmonte: 29
  }) 
  const [dateFilter, setDateFilter] = useState({
    startDate: null,
    endDate: null,
  });

  const getCurrentWeekDates = () => {
    const currentDate = new Date();
    const currentDay = currentDate.getDay();
    const thursdayOffset = (currentDay >= 4) ? currentDay - 4 : currentDay + 3;
    const thursday = new Date(currentDate);
    thursday.setDate(currentDate.getDate() - thursdayOffset);
    const weekDate = {
      startDate: subDays(new Date(thursday), 1),
      endDate: addDays(new Date(thursday), 6)
    }

    setDateFilter({
      startDate: set(weekDate.startDate, { hours: 18, minutes: 0, seconds: 0, milliseconds: 0 }).getTime(),
      endDate: set(weekDate.endDate, { hours: 18, minutes: 0, seconds: 0, milliseconds: 0 }).getTime()
    });
  };

  const {
    data,
    // isFetching,
    // isLoading,
    // isError,
    refetch,
  } = useFetchData(
    "trip-group-by-days",
    `trip/stats-by-days?startDate=${dateFilter.startDate}&endDate=${dateFilter.endDate}`
  );

  const {
    data : mineralData = [],
    // isFetching,
    // isLoading,
    // isError,
    // refetch : refetchMineral
  } = useFetchData("mineral", "mineral");

  useEffect(() => {
    setBaseData({
      mineral: mineralData.find((item) => item.name.toLowerCase() === "mineral")?.value || 30,
      desmonte: mineralData.find((item) => item.name.toLowerCase() === "desmonte")?.value || 29
    });
  }, [mineralData])

  useEffect(() => {
    getCurrentWeekDates();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      getCurrentWeekDates();
      refetch();
    }, 10000);

    return () => clearInterval(interval);
  }, [refetch]);

  if(!data || !mineralData) return <p>cargando</p>

  return (
    <div className="grid grid-cols-[1fr] h-full gap-10">
      {/* <div className="flex flex-col justify-between">
        <DonutChart
          title="OVERALL PLAN, kM³"
          donutData={{
            total: 100,
            currentValue: 21,
            currentValueColor: "#04c285",
          }}
          progressBar= {{
            total: 1600,
            currentValue: 340,
            prediction: 1620,
            currentValueColor: "#04c285",
          }}
        />

        <DonutChart
          title="EXTRACTION, kT"
          donutData={{
            total: 100,
            currentValue: 21,
            currentValueColor: "#ff7989"
          }}
          progressBar= {{
            total: 1080,
            currentValue: 224,
            prediction: 1064,
            currentValueColor: "#ff7989"
          }}
        />

        <div className="flex flex-col gap-1">
          <h3 className="font-bold text-center">
            SHOVELS AND TRUCK
          </h3>
          <h3 className="font-bold text-center">
            AVAILABILITY
          </h3>
          <div className="grid grid-cols-[1fr_1fr]">
            <DonutChart
              donutData={{
                total: 100,
                currentValue: 65,
                currentValueColor: "#04c285"
              }}
            />
            <DonutChart
              donutData={{
                total: 100,
                currentValue: 72,
                currentValueColor: "#04c285"
              }}
            />
          </div>
          <h3 className="font-bold text-center">
            USABILITY
          </h3>
          <div className="grid grid-cols-[1fr_1fr]">
            <DonutChart
              donutData={{
                total: 100,
                currentValue: 58,
                currentValueColor: "#ff7989"
              }}
            />
            <DonutChart
              donutData={{
                total: 100,
                currentValue: 64,
                currentValueColor: "#04c285"
              }}
            />
          </div>
        </div>
      </div> */}

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-[1fr] rounded-lg p-4 gap-4 card-shadow">
          {/* <DonutAndSplineChart
            title="OVERALL PLAN EXECUTION, kM³"
            donutData={{
              total: 100,
              currentValue: 68,
              currentValueColor: "#04c285",
            }}
            progressBarData= {{
              total: 18.2,
              currentValue: 13.2,
              prediction: 18.4,
              currentValueColor: "#04c285",
              showDifference: true,
              forecastText: "Shiftend Forecast"
            }}
          /> */}

          <DonutAndSplineChartByDay
            title="Acumulado de Extracción de mineral por dia en TM"
            donutData={{
              total: 554205 / 4,
              currentValue: data.statsByDay ? data.statsByDay.reduce((acc, day) => acc + day.totalTrips, 0) * baseData.mineral : 0,
              currentValueColor: "#ff7989",
            }}
            progressBarData= {{
              total: 554205 / 4,
              currentValue: data.statsByDay ? data.statsByDay.reduce((acc, day) => acc + day.totalTrips, 0) * baseData.mineral : 0,
              prediction: data.statsByDay ? (Math.round(data.statsByDay.reduce((acc, day) => acc + day.totalTrips, 0)/data.statsByDay.length))*7*baseData.mineral : 0,
              currentValueColor: "#ff7989",
              showDifference: false,
              forecastText: "Predicción"
            }}
            mineralWeight={baseData.mineral}
            chartData={data}
          />
        </div>

        <div className="grid grid-cols-[1fr] gap-4">
          {/* <div className="card-shadow rounded-lg p-4 ">
            <LineAndBarChart
              title="SHOVELS ON SHIFT, MachShift"
            />
          </div> */}
          <div className="card-shadow rounded-lg p-4 ">
            <LineAndBarChartByDay
              title="Extracción de mineral por dia en TM"
              chartData={data}
              mineralWeight={baseData.mineral}
            />
          </div>

          {/* <div className="card-shadow rounded-lg p-4">
            <DonutAndTableChart
              title="PLAN REJECTING REASONS, %"
              donutData={[
                { title: "AVAILABILITY",
                  total: 100,
                  currentValue: 66,
                  currentValueColor: "#04c285"
                },
                { title: "USABILITY",
                  total: 100,
                  currentValue: 58,
                  currentValueColor: "#ff7989"
                }
              ]}
              tableData={[{
                title: "PLAN",
                currentValue: 66.9,
                total: 100,
                subData: [
                  { title: "Bucket Load",
                    currentValue: 7,
                    total: 50
                  },
                  { title: "Duration of truck load",
                    currentValue: 3.9,
                    total: 50
                  },
                  { title: "No truck for load",
                    currentValue: 0.9,
                    total: 50
                  },
                  { title: "Material idles",
                    currentValue: 0.7,
                    total: 50
                  },
                  { title: "Production idles",
                    currentValue: 0.4,
                    total: 50
                  }
                ]},
                {
                  title: "FACT",
                  currentValue: 68,
                  total: 100,
                  subData: []
                }
              ]}
            />
          </div> */}
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
        </div>
      </div>
    </div>
  )
}

export default RealTimeByHour