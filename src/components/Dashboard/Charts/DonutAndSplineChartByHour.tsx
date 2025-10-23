import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { roundAndFormat } from "@/lib/utilsGeneral";
import Progress from "./Progress";
import DonutChart from "./DonutChart";
// Types
import type { BeaconUnitTrip } from "@/types/Beacon";
import type { PlanDay } from "@/types/Plan";
import { useMemo } from "react";

interface IDonutAndSplineChartByHourProps {
  title?: string;
  mineralWeight: number;
  chartColor?: string;
  progressBarData: {
    total: number;
    currentValue: number;
    prediction?: number;
    predictionText?: string;
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
    planDay: PlanDay[];
  }
}

const DonutAndSplineChartByHour = ({ chartColor= "#ff5000", progressBarData, chartData, mineralWeight, mode = "hour", planDay }: IDonutAndSplineChartByHourProps) => {
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
          : [
              0, 
              ...new Array(11).fill(planDay.totalTonnage / 11) 
            ]
      )
    : [];
  
  const accumulativeCurrentPlanDay = currentPlanDay.map((_, index) =>
    currentPlanDay.slice(0, index + 1).reduce((acc, val) => acc + val, 0)
  );
  const options = {
    chart: {
      type: "areaspline",
      height: 300,
      marginBottom: 55,
      marginTop: 40,
      marginLeft: 50,
      marginRight: 0,
      spacing: [0, 0, 0, 0],
      animation: false,
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
            color: "#1e1e1e",
            textDecoration: "underline",
            fontSize: "0.9em",
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
            fontSize: "0.7em",
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
        fillColor: chartColor + "80",
        color: chartColor,
        animation: false,
        marker: {
          fillColor: "white",
          lineWidth: 2,
          lineColor: chartColor,
        },
        dataLabels: {
          enabled: true,
          style: {
            color: "#ff5000",
            fontSize: "12px",
            fontWeight: "bold",
            textOutline: "none"
          },
          formatter: function(this: any) {
            return `${roundAndFormat(this.y)} TM <br/> ${Math.ceil(this.y / mineralWeight)}V`;
          }
        },
      },
      {
        name: "Plan",
        data: mode === "day" ? accumulativePlanData : accumulativeCurrentPlanDay,
        xAxis: 1,
        fillColor: "#b8b8b880",
        color: "#b8b8b8",
        areaColor: "#b8b8b880",
        animation: false,
        marker: {
          fillColor: "white",
          lineWidth: 2,
          lineColor: "#b8b8b8",
        },
        zones: acummulativeTripsCounts.map((realValue, index) => {
          const hasRealData = realValue !== undefined && !isNaN(realValue) && realValue > 0;
          return {
            value: index,
            dashStyle: hasRealData ? 'Solid' : 'Dash',
            color: hasRealData ? "#757575" : "#bdbdbd",
            fillColor: hasRealData ? "#f5f5f580" : "#f5f5f520"
          };
        }),
        zoneAxis: 'x',
      }
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
      pointFormatter: function (this: any) {
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
      labelFormatter: function (this: any) {
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
  }

  const chartKey = useMemo(() => {
    return JSON.stringify({
      dataLength: chartData?.length || 0,
      firstHour: chartData?.[0]?.hour || '',
      lastHour: chartData?.[chartData?.length - 1]?.hour || '',
      totalTrips: chartData?.reduce((acc, val) => acc + val.trips.length, 0) || 0,
    });
  }, [chartData]);

  return (
    <div className="flex flex-col gap-0">
      {/* <div className="flex flex-row items-center w-full">
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
          prediction={progressBarData.prediction}
          predictionText={progressBarData.predictionText}
          unit="TM"
          className="py-0 px-2 w-full"
          showLegend={false}
        />
      </div> */}
      <HighchartsReact 
        highcharts={Highcharts} 
        options={options} 
        key={chartKey}
      />
    </div>
  );
};

export default DonutAndSplineChartByHour;
