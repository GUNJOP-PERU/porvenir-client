import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useMemo } from "react";
import { roundAndFormat } from "@/lib/utilsGeneral";
// Types
import type { BeaconUnitTrip } from "@/types/Beacon";

interface LineAndBarChartByMonthProps {
  mineralWeight: number;
  chartColor?: string;
  chartData: {
    monthName: string;
    monthNumber: number;
    tonelajeDia: number;
    tonelajeNoche: number;
  }[];
  planDay: {
    monthName: string;
    month: number;
    totalTonnage: number;
  }[];
}

const LineAndBarChartByMonth = ({
  chartData,
  mineralWeight,
  chartColor = "#000000",
  planDay,
}: LineAndBarChartByMonthProps) => {
  const xLabels = chartData.map((item) => item.monthName ?? "");
  const tripsCounts = chartData.map(
    (item) => (item.tonelajeDia + item.tonelajeNoche) * mineralWeight
  );

  const tripsTurnDay = chartData.map((item) => ({
    ...item,
    tonnage: item.tonelajeDia * mineralWeight,
  }));
  const tripsTurnNight = chartData.map((item) => ({
    ...item,
    tonnage: item.tonelajeNoche * mineralWeight,
  }));

  const planMonth = planDay?.map((p) => p.totalTonnage) ?? [];
  const planLabels = planDay?.map((p) => p.monthName) ?? [];

  const diffPlanDay = planMonth.map((exp, i) => {
    const currentData = tripsCounts;
    const value =
      typeof currentData[i] === "number" ? (currentData[i] as number) : 0;
    const e = Math.abs(exp - value);
    return +e;
  });

  const diffColorPlanDay = planMonth.map((exp, i) => {
    const currentData = tripsCounts;
    return currentData[i] !== undefined && currentData[i] >= exp
      ? "#68c970"
      : "#f9c83e";
  });

  const options = {
    chart: {
      type: "column",
      height: 300,
      marginBottom: 50,
      marginTop: 40,
      marginLeft: 50,
      marginRight: 0,
      spacing: [0, 0, 0, 0],
      animation: false,
    },
    title: "",
    xAxis: [
      {
        title: "",
        categories: tripsCounts.map(
          (value) => `${value ? roundAndFormat(value) : "-"} TM`
        ),
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
        categories:
          planDay.map((p) => `${roundAndFormat(p.totalTonnage)} TM`) ?? [],
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
        title: "",
        categories: planLabels,
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
            color: hasTrips ? diffColorPlanDay[index] : "transparent",
            borderColor: hasTrips ? diffColorPlanDay[index] : "#6b7280",
            borderWidth: hasTrips ? 0 : 2,
          };
        }),
        xAxis: 1,
        animation: false,
        dataLabels: {
          enabled: true,
          formatter: function (this: any) {
            return `${roundAndFormat(
              diffPlanDay[this.point.index]
            )} (${Math.round(
              Number(diffPlanDay[this.point.index]) / mineralWeight
            )}V)`;
          },
        },
      },
      {
        name: "Turno Día",
        data: tripsTurnDay.map((e, i) => e.tonnage),
        color: chartColor,
        animation: false,
        dataLabels: {
          enabled: true,
          formatter: function (this: any) {
            return `${roundAndFormat(this.y)} ( ${Math.round(
              this.y / mineralWeight
            )}V )`;
          },
        },
      },
      {
        name: "Turno Noche",
        data: tripsTurnNight.map((e, i) => e.tonnage),
        color: "#3c3c3c",
        animation: false,
        dataLabels: {
          enabled: true,
          formatter: function (this: any) {
            return `${roundAndFormat(this.y)} ( ${Math.round(
              this.y / mineralWeight
            )}V )`;
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
        const extraido = this.points.find(
          (p: any) => p.series.name === "Extraído"
        );
        if (extraido) {
          tooltipText += `<span style='color:${
            extraido.color
          }'>●</span> Extraído: <b>${roundAndFormat(extraido.y)} TM</b><br/>`;
        }
        this.points.forEach(function (point: any) {
          if (point.series.name !== "Extraído") {
            tooltipText += `<span style='color:${point.color}'>●</span> ${
              point.series.name
            }: <b>${roundAndFormat(point.y)} TM</b><br/>`;
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
        } else if (this.index === 1) {
          return `
          <div style="display: flex; flex-direction: column; gap: 7px;">
            <span style='color:#A6A6A6'>
              <span style='width:8px; height: 8px; border-color: #A6A6A6; border-width: 2px; border-style: solid; display: inline-block; margin-right: 5px;'></span>  
              P.Mensual
            </span>
          </div>`;
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
      itemMarginTop: 6,
      itemMarginBottom: 0,
      x: 0,
      y: 24,
    },
    credits: {
      enabled: false,
    },
  };

  return (
    <>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </>
  );
};

export default LineAndBarChartByMonth;
