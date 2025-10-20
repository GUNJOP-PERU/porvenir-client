import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useMemo } from "react";
import { roundAndFormat } from "@/lib/utilsGeneral";
// Types
import type { BeaconUnitTrip } from "@/types/Beacon";

interface LineAndBarChartByDayProps {
  title?: string;
  mineralWeight: number;
  chartColor?: string;
  chartData: {
    date: string;
    label: string;
    trips: BeaconUnitTrip[];
  }[];
  planDay: {
    totalTonnage: number;
    planDay: {
      date: string;
      tonnage: number;
    }[];
  }
}

const LineAndBarChartByDay= ({ title, chartData, mineralWeight, chartColor = "#000000", planDay }: LineAndBarChartByDayProps) => {

  const xLabels = chartData.map(item => item.label ?? "")
  const tripsCounts = chartData.map(item => item.trips.length * mineralWeight);
  const currentPlanDay = planDay.planDay.map(p => p.tonnage);

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
      ? "#f9c83e"
      : "#3c3c3c";
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
        categories: planDay?.planDay.map(p => `${roundAndFormat(p.tonnage)} TM`) ?? [],
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
        visible: true,
        showInLegend: true,
        animation: false,
        dataLabels: {
          enabled: true,
          formatter: function (this: any) {
            return `${roundAndFormat(diffPlanDay[this.point.index])}`;
          },
        },
      },
      {
        name: "Plan",
        data: tripsCounts.map((e, i) => {
          const planValue = currentPlanDay && currentPlanDay[i] !== undefined ? currentPlanDay[i] : 0;
          if (e === 0) return NaN;
          return e > planValue ? planValue : e;
        }),
        color: chartColor,
        visible: true,
        showInLegend: true,
        animation: false,
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

  const chartKey = useMemo(() => {
    return JSON.stringify({
      dataLength: chartData?.length || 0,
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

export default LineAndBarChartByDay;
