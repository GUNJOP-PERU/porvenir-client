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
    totalTonnageBlending: number;
    totalTonnageModificado: number;
    planWeek: {
      date: string;
      tonnage: number;
    }[];
    planDataBlending: {
      date: string;
      tonnage: number;
    }[];
    planDataModificado: {
      date: string;
      tonnage: number;
    }[];
  }
}

const LineAndBarChartByDay= ({ title, chartData, mineralWeight, chartColor = "#000000", planDay }: LineAndBarChartByDayProps) => {
  const xLabels = chartData.map(item => item.label ?? "")
  const tripsCounts = chartData.map(item => item.trips.length * mineralWeight);

  const tripsTurnDay = chartData.map((item) => ({
    ...item,
    tonnage: item.trips.filter(trip => trip.shift === 'dia').length * mineralWeight
  }))
  const tripsTurnNight = chartData.map((item) => ({
    ...item,
    tonnage: item.trips.filter(trip => trip.shift === 'noche').length * mineralWeight
  }))

  const planWeek = planDay.planWeek.map(p => p.tonnage);

  const diffPlanDay = planWeek.map((exp, i) => {
    const currentData = tripsCounts;
    const value =
      typeof currentData[i] === "number" ? (currentData[i] as number) : 0;
    const e = Math.abs(exp - value);
    return +e;
  });

  const diffColorPlanDay = planWeek.map((exp, i) => {
    const currentData = tripsCounts;
    return currentData[i] !== undefined && currentData[i] >= exp
      ? "#68c970"
      : "#f9c83e";
  });

  const options = {
    chart: {
      type: "column",
      height: 300,
      marginBottom: 90,
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
        categories: planDay.planDataModificado.map(p => `${roundAndFormat(p.tonnage)} TM`) ?? [],
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
        categories: planDay.planDataBlending.map(p => `${roundAndFormat(p.tonnage)} TM`) ?? [],
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
        categories: planDay.planWeek.map(p => `${roundAndFormat(p.tonnage)} TM`) ?? [],
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
        name: "Turno Día",
        data: tripsTurnDay.map((e, i) => e.tonnage),
        color: chartColor,
        animation: false,
        dataLabels: {
          enabled: true,
          formatter: function (this: any) {
            return `${roundAndFormat(this.y)} ( ${Math.round(this.y/mineralWeight)}V )`;
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
        } else if (this.index === 1) {
          return `
          <div style="display: flex; flex-direction: column; gap: 7px;">
            <span style='color:#A6A6A6'>
              <span style='width:8px; height: 8px; border-color: #A6A6A6; border-width: 2px; border-style: solid; transform: rotate(45deg); display: inline-block; margin-right: 5px;'></span>  
              P.Campo
            </span>
            <span style='color:#A6A6A6'>
              <span style='width:8px; height: 8px; border-color: #A6A6A6; border-width: 2px; border-style: solid; display: inline-block; margin-right: 5px;'></span>  
              P.Blending
            </span>
            <span style='color:#A6A6A6'>
              <span style='width:8px; height: 8px; border-color: #A6A6A6; border-width: 2px; border-style: solid; display: inline-block; margin-right: 5px;'></span>  
              P.Semanal
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
