import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { roundAndFormat } from "@/lib/utilsGeneral";
import Progress from "./Progress";
import DonutChart from "./DonutChart";
// Types
import type { BeaconUnitTrip } from "@/types/Beacon";
import type { PlanDay } from "@/types/Plan";

interface IDonutAndSplineChartByHourProps {
  title?: string;
  mineralWeight: number;
  progressBarData: {
    total: number;
    currentValue: number;
    prediction: number;
    currentValueColor: string;
    showDifference: boolean;
    forecastText: string;
  };
  chartData: {
    hour?: string;
    label?: string;
    trips: BeaconUnitTrip[];
  }[];
  mode?: "hour" | "day";
  planDay?: {
    totalTonnage: number;
    planDayShift: PlanDay[];
    planDay: PlanDay[];
  }
}

const DonutAndSplineChartByHour = ({
  progressBarData,
  chartData,
  mineralWeight,
  mode = "hour",
  planDay
}: IDonutAndSplineChartByHourProps) => {
  const xLabels =
    mode === "day"
      ? chartData.map((item) => item.label) 
      : chartData.map((item) => item.hour ?? "");

  const tripsCounts = chartData.map(
    (item) => item.trips.length * mineralWeight
  );
  const acummulativeTripsCounts = tripsCounts.map((trip, index) =>
    trip === 0
      ? NaN
      : tripsCounts.slice(0, index + 1).reduce((acc, val) => acc + val, 0)
  );

  const planValue = mode === "day" ? 1200 : 100;
  const planData = new Array(chartData.length).fill(planValue);
  const accumulativePlanData = mode === "day" && planDay
  ? planDay.planDay.map((p, i) => 
      planDay.planDay.slice(0, i + 1).reduce((acc, val) => acc + val.tonnage, 0)
    )
  : planData.map((_, index) =>
      planData.slice(0, index + 1).reduce((acc, val) => acc + val, 0)
    );

  const currentPlanDay = planDay 
  ? (
      mode === "day"
        ? planDay.planDay.map(p => p.tonnage)   
        : new Array(12).fill(planDay.totalTonnage / 12) 
    )
  : [];
  const accumulativeCurrentPlanDay = currentPlanDay.map((_, index) =>
    currentPlanDay.slice(0, index + 1).reduce((acc, val) => acc + val, 0)
  );
  const options = {
    chart: {
      type: "areaspline",
      height: 280,
      marginBottom: 50,
      marginTop: 40,
      marginLeft: 50,
      marginRight: 0,
      spacing: [0, 0, 0, 0],
    },
    title: "",
    xAxis: [
      {
        categories: acummulativeTripsCounts.map(
          (value) => `${roundAndFormat(value)} TM`
        ),
        opposite: false,
        lineColor: "transparent",
        labels: {
          style: {
            color: "#000000",
            fontSize: "0.6em",
            fontWeight: "bold",
          },
        },
      },
      {
        categories: mode === "day" ? accumulativePlanData.map(
          (value) => `${roundAndFormat(value)} TM`
        ) : accumulativeCurrentPlanDay.map(
          (value) => `${roundAndFormat(value)} TM`
        ),
        opposite: false,
        lineColor: "transparent",
        labels: {
          y: 0,
          style: {
            color: "#00000080",
            fontSize: "0.6em",
            fontWeight: "bold",
          },
        },
      },
      {
        categories: xLabels,
        opposite: true,
        linkedTo: 0,
        lineColor: "transparent",
        labels: {
          style: {
            color: "#00000080",
            fontSize: "0.8em",
            fontWeight: "bold",
          },
        },
      },
    ],
    yAxis: {
      title: { text: "" },
      opposite: true,
      labels: { enabled: false },
      gridLineColor: "#D9D9D9",
      gridLineWidth: 0.5,
      gridLineDashStyle: "Dash",
    },
    series: [
      {
        name: "Real",
        data: acummulativeTripsCounts,
        xAxis: 0,
        fillColor: "#bfefe1",
        color: "#04c286",
        marker: {
          fillColor: "white",
          lineWidth: 2,
          lineColor: "#04c286",
        },
      },
      {
        name: "Plan",
        data: mode === "day" ? accumulativePlanData : accumulativeCurrentPlanDay,
        xAxis: 1,
        fillColor: "#ffd0d63d",
        color: "#00000080",
        marker: {
          fillColor: "white",
          lineWidth: 2,
          lineColor: "#00000080",
        },
      },
    ],
    tooltip: {
      shared: true,
      backgroundColor: "#111214",
      borderWidth: 0,
      shadow: false,
      borderRadius: 10,
      padding: 12,
      style: {
        color: "#FFFFFF",
        fontSize: "0.65em",
      },
      pointFormatter: function () {
        return `<span style="color:${this.color}">●</span> ${
          this.series.name
        }: <b>${roundAndFormat(this.y)} TM</b><br/>`;
      },
    },

    legend: {
      align: "left",
      verticalAlign: "bottom",
      layout: "vertical",
      floating: false,
      labelFormatter: function () {
        if (this.index === 0) {
          return `<span style='color:#000000'>${this.name}</span>`;
        } else {
          return `<span style='color:#A6A6A6'>${this.name}</span>`;
        }
      },
      useHTML: true,
      itemStyle: {
        color: "#A6A6A6",
        fontSize: "0.55em",
        fontWeight: "600",
        textTransform: "uppercase",
      },
      itemHoverStyle: { color: "black" },
      symbolWidth: 10,
      symbolHeight: 9,
      symbolRadius: 2,
      itemMarginTop: 4,
      itemMarginBottom: 0,
      x: 0,
      y: 0,
    },
    credits: {
      enabled: false,
    },
  };

  return (
    <div className="flex flex-col gap-0">
      <div className="flex flex-row items-center w-full">
        <DonutChart
          title=""
          size="mini"
          donutData={{
            currentValue: progressBarData.currentValue,
            total: progressBarData.total,
            currentValueColor: progressBarData.currentValueColor,
          }}
        />
        <Progress
          title=""
          value={progressBarData.currentValue}
          total={progressBarData.total}
          color={progressBarData.currentValueColor}
          unit="TM"
          className="py-0 px-2 w-full"
          showLegend={false}
        />
      </div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default DonutAndSplineChartByHour;
