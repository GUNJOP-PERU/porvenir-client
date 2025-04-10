import DonutChart from "@/components/Dashboard/Charts/DonutChart";
import DonutAndSplineChart from "@/components/Dashboard/Charts/DonutAndSplineChart";
import LineAndBarChart from "@/components/Dashboard/Charts/LineAndBarChart";
import DonutAndTableChart from "@/components/Dashboard/Charts/DonutAndTableChart"

const ShortIntercalControl = () => {
  return (
    <div className="grid grid-cols-[1fr_4fr] h-full gap-10">
      <div className="flex flex-col justify-between">
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
      </div>

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-[1fr_1fr] rounded-lg p-4 gap-4 card-shadow">
          <DonutAndSplineChart
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
          />

          <DonutAndSplineChart
            title="EXTRACTION PLAN EXECUTION, kT"
            donutData={{
              total: 100,
              currentValue: 67,
              currentValueColor: "#ff7989",
            }}
            progressBarData= {{
              total: 12.0,
              currentValue: 8.2,
              prediction: 11.6,
              currentValueColor: "#ff7989",
              showDifference: true,
              forecastText: "Shiftend Forecast"
            }}
          />
        </div>

        <div className="grid grid-cols-[1fr_1fr] gap-4">
          <div className="card-shadow rounded-lg p-4 ">
            <LineAndBarChart
              title="SHOVELS ON SHIFT, MachShift"
            />
          </div>
          <div className="card-shadow rounded-lg p-4 ">
            <LineAndBarChart
              title="SHOVELS ON SHIFT, MachShift"
            />
          </div>

          <div className="card-shadow rounded-lg p-4">
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
          </div>
          <div className="card-shadow rounded-lg p-4 ">
            <DonutAndTableChart
              title="PLAN REJECTING REASONS, %"
              donutData={[
                { title: "AVAILABILITY",
                  total: 100,
                  currentValue: 72,
                  currentValueColor: "#04c285"
                },
                { title: "USABILITY",
                  total: 100,
                  currentValue: 64,
                  currentValueColor: "#04c285"
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
                  ]
                },
                {
                  title: "FACT",
                  currentValue: 68,
                  total: 100,
                  subData: []
                }
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShortIntercalControl