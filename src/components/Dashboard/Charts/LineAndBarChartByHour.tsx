import Highcharts, { Series } from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { roundAndFormat } from "@/lib/utilsGeneral";
// Types
import type { BeaconUnitTrip } from "@/types/Beacon";
import type { PlanDay } from "@/types/Plan";

interface LineAndBarChartByHourProps {
  title?: string;
  mineralWeight: number;
  chartColor?: string;
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

const LineAndBarChartByHour = ({ title, chartData, mineralWeight, chartColor = "#000000", mode = "hour", planDay }: LineAndBarChartByHourProps) => {

  const xLabels = mode === "day" 
    ? chartData.map(item => item.label ?? "")
    : chartData.map(item => item.hour ?? "");

  const tripsCounts = chartData.map(item => item.trips.length * mineralWeight);

  const planValue = mode === "day" ? 1200 : 100;
  const plan = new Array(chartData.length).fill(planValue);
  
  const diff = plan.map((exp, i) => {
    const currentData = tripsCounts;
    const value =
      typeof currentData[i] === "number" ? (currentData[i] as number) : 0;
    const e = Math.abs(exp - value);
    return +e;
  });

  const diffColor = plan.map((exp, i) => {
    const currentData = tripsCounts;
    return currentData[i] !== undefined && currentData[i] >= exp
      ? "#04c286"
      : "#fe7887";
  });

  const currentPlanDay = planDay ? new Array(chartData.length).fill(planDay.totalTonnage/12) : [];
  const diffPlanDay = currentPlanDay.map((exp, i) => {
    const currentData = tripsCounts;
    const value =
      typeof currentData[i] === "number" ? (currentData[i] as number) : 0;
    const e = Math.abs(exp - value);
    return +e;
  });
  const diffColorPlanDay = currentPlanDay.map((exp, i) => {
    const currentData = tripsCounts;
    return currentData[i] !== undefined && currentData[i] >= exp
      ? "#04c286"
      : "#fe7887";
  });

  const options = {
    chart: {
      type: "column",
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
        title: "",
        categories: tripsCounts.map(value => `${value ? roundAndFormat(value) : "-"} TM`),
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
        title: "",
        categories: mode === "day" ? plan.map((e) => `${roundAndFormat(e)} TM`) : currentPlanDay.map((e) => `${roundAndFormat(e)} TM`),
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
        title: "",
        categories: xLabels,
        opposite: true,
        linkedTo: 0,
        lineColor: "#D9D9D9",
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
      title: "",
      visible: false,
    },

    plotOptions: {
      column: {
        stacking: "normal",
        pointPadding: 0,
        groupPadding: 0.05,
        borderWidth: 0,
        borderRadius: "20%",
        dataLabels: {
          enabled: true,
          inside: true,
          style: {
            fontSize: "0.7em",
            color: "#fff",
            fontWeight: "bold",
            textOutline: "none",
            lineHeight: "1",
          },
          backgroundColor: "#00000050",
          borderRadius: 3,
          padding: 2,
          borderWidth: 0,
        },
      },
    },
    series: [
      {
        name: "Diferencia",
        data: diff.map((diff,i) => {
          return tripsCounts[i] ? diff : NaN
        }),
        colorByPoint: true,
        colors: diffColor,
        xAxis: 1,
        visible: mode === "day",
        showInLegend: mode === "day",
        dataLabels: {
          enabled: true,
          formatter: function () {
            return `${roundAndFormat(diff[this.point.index])}`;
          },
        },
      },
      {
        name: "Diferencia",
        data: diffPlanDay.map((diff,i) => {
          return tripsCounts[i] ? diff : NaN
        }),
        colorByPoint: true,
        colors: diffColorPlanDay,
        visible: mode === "hour",
        xAxis: 1,
        dataLabels: {
          enabled: true,
          formatter: function () {
            return `${roundAndFormat(diff[this.point.index])}`;
          },
        },
      },
      {
        name: "Plan",
        data: tripsCounts.map((e,i) => e > plan[i] ? plan[i] : e === 0 ? NaN : e),  
        color: chartColor,
        visible: true,
      },
    ],
    tooltip: {
      shared: true,
      valueSuffix: "TM",
      backgroundColor: "#111214",
      borderWidth: 0,
      shadow: false,
      borderRadius: 10,
      padding: 12,
      style: {
        color: "#FFFFFF",
        fontSize: "0.65em",
        zIndex: 10,
      },
      formatter: function (this: any) {
        const categoryName = this.points[0]?.point?.category || hourLabels[this.x];
        let tooltipText = `<b>${categoryName}</b><br/>`;
        // Mostrar siempre el valor de "Extraído"
        const extraido = this.points.find((p: any) => p.series.name === "Extraído");
        if (extraido) {
          tooltipText += `<span style='color:${extraido.color}'>●</span> Extraído: <b>${extraido.y} TM</b><br/>`;
        }
        this.points.forEach(function (point: any) {
          if (point.series.name !== "Extraído") {
            tooltipText += `<span style='color:${point.color}'>●</span> ${point.series.name}: <b>${point.y} TM</b><br/>`;
          }
        });
        return tooltipText;
      },
    },
    legend: {
      align: "left",
      verticalAlign: "bottom",
      layout: "vertical",
      floating: false,
      labelFormatter: function () {
        if (this.index === 0 || this.index === 1) {
          return `<span style='color:#000000'>Real</span>`;
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
  };

  return (
    <>
      <h3 className="font-bold text-center text-sm">{title}</h3>
        <HighchartsReact highcharts={Highcharts} options={options} />
      
    </>
  );
};

export default LineAndBarChartByHour;
