import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { roundAndFormat } from "@/lib/utilsGeneral";
import Progress from "./Progress";
// Types
import type { BeaconUnitTrip } from "@/types/Beacon";

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
    hour: string;
    trips: BeaconUnitTrip[];
  }[];
}

const DonutAndSplineChartByHour = ({ progressBarData, chartData, mineralWeight }: IDonutAndSplineChartByHourProps) => {
  const hourLabels = chartData.map(item => item.hour);
  const tripsCounts = chartData.map(item => item.trips.length * mineralWeight);
  const acummulativeTripsCounts = tripsCounts.map((_, index) =>
    tripsCounts.slice(0, index + 1).reduce((acc, val) => acc + val, 0)
  );
  const planData = new Array(12).fill(100);
  const accumulativePlanData = planData.map((_, index) =>
    planData.slice(0, index + 1).reduce((acc, val) => acc + val, 0)
  );

  const options = {
    chart: {
      type: "areaspline",
      height: 250,
      marginBottom: 70,
      marginTop: 70,
      marginLeft: 0,
      marginRight: 0,
      spacing: [0, 0, 0, 0],
    },
    title: "",
    xAxis: [
      {
        categories: acummulativeTripsCounts.map(value => `${roundAndFormat(value)} TM`),
        opposite: false,
        lineColor: "transparent",
        labels: {
          style: {
            color: "#000000",
            fontSize: "0.8em",
            fontWeight: "bold",
          },
        },
      },
      {
        categories: accumulativePlanData.map(value => `${roundAndFormat(value)} TM`),
        opposite: false,
        lineColor: "transparent",
        labels: {
          y: 0,
          style: {
            color: "#00000080",
            fontSize: "0.8em",
            fontWeight: "bold",
          },
        },
      },
      {
        categories: hourLabels,
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
        name: "Fact",
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
        data: accumulativePlanData,
        xAxis: 1,
        fillColor: "#ffd0d63d",
        color: "#fe7887",
        marker: {
          fillColor: "white",
          lineWidth: 2,
          lineColor: "#fe7887",
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
      align: "right",
      verticalAlign: "top",
      layout: "horizontal",
      floating: false,
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
      itemMarginTop: 0,
      itemMarginBottom: 0,
    },
    credits: {
      enabled: false,
    },
  };

  return (
    <div className="flex flex-col gap-0">
      <Progress
        title=""
        value={progressBarData.currentValue}
        total={progressBarData.total}
        color={progressBarData.currentValueColor}
        unit="TM"
        className="py-0 px-2"
      />
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default DonutAndSplineChartByHour;
