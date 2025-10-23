import Highcharts, { animate, Series } from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useMemo } from "react";
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
  planDay?: {
    totalTonnage: number;
    planDayShift: PlanDay[];
    planDay: PlanDay[];
  }
}

const LineAndBarChartByHour = ({ title, chartData, mineralWeight, chartColor = "#000000", planDay }: LineAndBarChartByHourProps) => {
  const xLabels = chartData.map(item => item.hour ?? "");
  const tripsCounts = chartData.map(item => item.trips.length * mineralWeight);
  const currentPlanDay = planDay
    ? [0, ...new Array(11).fill(planDay.totalTonnage / 11)]
    : [];

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
      ? "#68c970"
      : "#ff8b8b";
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
      animation: false
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
            textDecoration: "underline",
            fontSize: "0.9em",
            fontWeight: "bold",
          },
        },
      },
      {
        title: "",
        categories: currentPlanDay.map(e => `${roundAndFormat(e)} TM`),      
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
        data: diffPlanDay.map((value, index) => {
          const hasTrips = (tripsCounts[index] || 0) > 0;
          return {
            y: value,
            color: hasTrips ? diffColorPlanDay[index] : 'transparent',
            borderColor: hasTrips ? diffColorPlanDay[index] : '#6b7280',
            borderWidth: hasTrips ? 0 : 2
          };
        }),
        xAxis: 1,
        animation: false,
        dataLabels: {
          enabled: true,
          formatter: function (this: any) {
            return `${roundAndFormat(diffPlanDay[this.point.index])} (${Math.round(Number(diffPlanDay[this.point.index])/mineralWeight)}V)`;
          },
        },
      },
      {
        name: "Plan",
        data: tripsCounts.map((e,i) => e > currentPlanDay[i] ? currentPlanDay[i] : e === 0 ? NaN : e),
        color: chartColor,
        animation: false,
        dataLabels: {
          enabled: true,
          formatter: function (this: any) {
            return `${roundAndFormat(this.y)} ( ${Math.round(this.y/mineralWeight)}V )`;
          },
        },
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
        const categoryName = this.points[0]?.point?.category || xLabels[this.x];
        let tooltipText = `<b>${categoryName}</b><br/>`;
        // Mostrar siempre el valor de "Extraído"
        const extraido = this.points.find((p: any) => p.series.name === "Extraído");
        if (extraido) {
          tooltipText += `<span style='color:${extraido.color}'>●</span> Extraído: <b>${roundAndFormat(extraido.y)} TM</b><br/>`;
        }
        this.points.forEach(function (point: any) {
          if (point.series.name !== "Extraído") {
            tooltipText += `<span style='color:${point.color}'>●</span> ${point.series.name}: <b>${roundAndFormat(point.y)} TM</b><br/>`;
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
      labelFormatter: function (this: any) {
        if (this.index === 0) {
          return `
          <span style='display: flex; align-items: center; color:#000000'>
            <span style='width: 8px; height: 8px; background-color: #ff5000; border-radius: 5px; display: inline-block; margin-right: 4px;'></span>
            Real
          </span>`;
        } else {
          return `
          <span style='color:#A6A6A6'>
            <span style='width:8px; height: 8px; border-color: #A6A6A6; border-width: 2px; border-style: solid; transform: rotate(45deg); display: inline-block; margin-right: 5px;'></span>  
            ${this.name}
          </span>`;
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

  const chartKey = useMemo(() => {
    return JSON.stringify({
      dataLength: chartData?.length || 0,
      firstHour: chartData?.[0]?.hour || '',
      lastHour: chartData?.[chartData?.length - 1]?.hour || '',
      totalTrips: chartData?.reduce((acc, val) => acc + val.trips.length, 0) || 0,
    });
  }, [chartData]);

  return (
    <>
      <h3 className="font-bold text-center text-sm">{title}</h3>
        <HighchartsReact 
          highcharts={Highcharts} 
          options={options} 
          key={chartKey}
        />
      
    </>
  );
};

export default LineAndBarChartByHour;
