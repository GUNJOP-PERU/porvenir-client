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
  planDay?: {
    totalTonnage: number;
    totalTonnageBlending: number;
    totalTonnageModificado: number;
    planDayShift: PlanDay[];
    planDay: PlanDay[];
    planDataBlending: PlanDay[];
    planDataModificado: PlanDay[];
  }
}

const DonutAndSplineChartByHour = ({ chartColor= "#ff5000", progressBarData, chartData, mineralWeight, planDay }: IDonutAndSplineChartByHourProps) => {
  const xLabels = chartData.map((item) => item.hour ?? "");
  const tripsCounts = chartData.map((item) => item.trips.length * mineralWeight);

  const acummulativeTripsCounts = tripsCounts.map((trip, index) =>
    trip === 0
      ? NaN
      : tripsCounts.slice(0, index + 1).reduce((acc, val) => acc + val, 0)
  );

  const planValue = 100;

  const currentPlanDayBlending = planDay
  ? [0,...new Array(11).fill(planDay.totalTonnageBlending / 11)]
  : [];

  const currentPlanDayModificado = planDay
  ? [0,...new Array(11).fill(planDay.totalTonnageModificado / 11)]
  : [];
  
  const accumulativeCurrentPlanDayBlending = currentPlanDayBlending.map((_, index) =>
    currentPlanDayBlending.slice(0, index + 1).reduce((acc, val) => acc + val, 0)
  );

  const accumulativeCurrentPlanDayModificado = currentPlanDayModificado.map((_, index) =>
    currentPlanDayModificado.slice(0, index + 1).reduce((acc, val) => acc + val, 0)
  );

  const options = {
    chart: {
      type: "areaspline",
      height: 300,
      marginBottom: 78,
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
        categories: accumulativeCurrentPlanDayModificado.map(
          (value) => `${roundAndFormat(value)} TM`
        ),
        opposite: false,
        linkedTo: 0,
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
        categories: accumulativeCurrentPlanDayBlending.map(
          (value) => `${roundAndFormat(value)} TM`
        ),
        opposite: false,
        linkedTo: 0,
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
        data: accumulativeCurrentPlanDayBlending,
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
          return `
          <span style='display: flex; align-items: center; color:#000000'>
            <span style='width: 8px; height: 8px; background-color: #ff5000; border-radius: 5px; display: inline-block; margin-right: 4px;'></span>
            Real
          </span>`;
        } else {
          return `
            <div style="display: flex; flex-direction: column; gap: 4px;">
              <span style='color:#A6A6A6'>
                <span style='width:8px; height: 8px; border-color: #A6A6A6; border-width: 2px; border-style: solid; transform: rotate(45deg); display: inline-block; margin-right: 5px;'></span>  
                P.Campo
              </span>
              <span style='color:#A6A6A6'>
                <span style='width:8px; height: 8px; border-color: #A6A6A6; border-width: 2px; border-style: solid; display: inline-block; margin-right: 5px;'></span>  
                P.Blending
              </span>
            </div>
          `;
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
      symbolWidth: 0,
      symbolHeight: 0,
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
      <HighchartsReact 
        highcharts={Highcharts} 
        options={options} 
        key={chartKey}
      />
    </div>
  );
};

export default DonutAndSplineChartByHour;
