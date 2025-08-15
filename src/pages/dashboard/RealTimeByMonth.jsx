import { useEffect, useState } from "react";
import DonutChart from "@/components/Dashboard/Charts/DonutChart";
import DonutAndSplineChart from "@/components/Dashboard/Charts/DonutAndSplineChartByMonth";
import LineAndBarChart from "@/components/Dashboard/Charts/LineAndBarChartByMonth";
import DonutAndTableChart from "@/components/Dashboard/Charts/DonutAndTableChart"
import { useFetchData } from "../../hooks/useGlobalQuery";
import { sub, add } from "date-fns";

const RealTimeByMonth = () => {
  const [ baseData, setBaseData ] =  useState({
    mineral: 30,
    desmonte: 29
  })
  const [dateFilter, setDateFilter] = useState({
    startDate: null,
    endDate: null,
  });

  const setDateFilterBasedOnTime = () => {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0).getTime();
    const endDate = new Date(now.getFullYear(), 11, 31, 0, 0, 0, 0).getTime();
    
    setDateFilter({
      startDate: sub(startDate, { hours: 6 }).getTime(),
      endDate: add(endDate, { hours: 18 }).getTime()
    });
  };

  const {
    data,
    refetch
  } = useFetchData(
    "trip-group-by-months",
    `trip/stats-by-months?startDate=${dateFilter.startDate}&endDate=${dateFilter.endDate}`
  );

  const {
    data : mineralData = []
  } = useFetchData("mineral", "mineral");

  useEffect(() => {
    setBaseData({
      mineral: mineralData.find((item) => item.name.toLowerCase() === "mineral")?.value || 30,
      desmonte: mineralData.find((item) => item.name.toLowerCase() === "desmonte")?.value || 29
    });
  }, [mineralData])

  useEffect(() => {
    setDateFilterBasedOnTime();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setDateFilterBasedOnTime();
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

          <DonutAndSplineChart
            title="Acumulado de Extracción de mineral por mes en kTM"
            donutData={{
              total: Number((554205*12/1000).toFixed(2)),
              currentValue: data.statsByMonth ? +(data.statsByMonth.reduce((acc, hour) => acc + hour.totalTrips, 0) * baseData.mineral/1000).toFixed(2) : 0,
              currentValueColor: "#ff7989",
            }}
            progressBarData= {{
              total: Number((554205*12/1000).toFixed(2)),
              currentValue: data.statsByMonth ? +(data.statsByMonth.reduce((acc, hour) => acc + hour.totalTrips, 0) * baseData.mineral/1000).toFixed(2) : 0,
              prediction: data.statsByMonth ? +(data.statsByMonth.reduce((acc, month) => acc + month.totalTrips/data.statsByMonth.length, 0)*12*baseData.mineral/1000).toFixed(2) : 0,
              currentValueColor: "#ff7989",
              showDifference: false,
              forecastText: "Predicción"
            }}
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
            <LineAndBarChart
              title="Extracción de mineral por mes en kTM"
              chartData={data}
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
              title="PLAN REJECTING REASONS, %"
              donutData={[
                { title: "Tiempo Disponible",
                  total: data.totalUnits * data.statsByMonth.length * 8640,
                  currentValue: Number((data.totalUnits * data.statsByMonth.length * 8640) - data.statsByMonth.reduce((acc, hour) => acc + hour.totalMaintenanceTime, 0).toFixed(2)) || 0,
                  currentValueColor: "#04c285"
                },
                { title: "USABILITY",
                  total: data.totalUnits * data.statsByMonth.length * 8640,
                  currentValue: Number(data.statsByMonth.reduce((acc, hour) => acc + hour.totalCycleTime, 0).toFixed(2)) || 0,
                  currentValueColor: "#04c285"
                }
              ]}
              tableData={[{
                  title: "Tiempo Trabajado",
                  currentValue: 66.9,
                  total: 100,
                  subData: [
                    { title: "Viaje Vació (min)",
                      currentValue: data.statsByMonth.reduce((acc, hour) => acc + hour.avgEmptyTime/data.statsByMonth.length, 0).toFixed(1),
                      total: data.statsByMonth.reduce((acc, hour) => acc + hour.avgCycleTime/data.statsByMonth.length, 0).toFixed(1)
                    },
                    { title: "Tiempo de Carga (min)",
                      currentValue: data.statsByMonth.reduce((acc, hour) => acc + hour.avgLoadTime/data.statsByMonth.length, 0).toFixed(1),
                      total: data.statsByMonth.reduce((acc, hour) => acc + hour.avgCycleTime/data.statsByMonth.length, 0).toFixed(1)
                    },
                    { title: "Viaje Lleno (min)",
                      currentValue: data.statsByMonth.reduce((acc, hour) => acc + hour.avgFullTime/data.statsByMonth.length, 0).toFixed(1),
                      total: data.statsByMonth.reduce((acc, hour) => acc + hour.avgCycleTime/data.statsByMonth.length, 0).toFixed(1)
                    },
                    { title: "Tiempo de Descarga (min)",
                      currentValue: data.statsByMonth.reduce((acc, hour) => acc + hour.avgDischargeTime/data.statsByMonth.length, 0).toFixed(1),
                      total: data.statsByMonth.reduce((acc, hour) => acc + hour.avgCycleTime/data.statsByMonth.length, 0).toFixed(1)
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

export default RealTimeByMonth