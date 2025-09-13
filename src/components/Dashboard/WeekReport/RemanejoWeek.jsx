import { useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { filterValidTrips } from "@/lib/utilsGeneral";

export default function RemanejoWeek({ data, isLoading, isError }) {
  const filteredInvalidData = useMemo(() => filterValidTrips(data), [data]);

  const { categories, series } = useMemo(() => {
    const grouped = {}; 

    filteredInvalidData.forEach((item) => {
      if (!item.date || !item.origin) return;
      
      const dayMonth = `${new Date(item.date).getDate()}-${
        new Date(item.date).getMonth() + 1
      }`;
      
      // Normalizamos el destino para agrupar correctamente
      const destKey = item.origin.trim().toLowerCase(); 
      
      if (!grouped[dayMonth]) grouped[dayMonth] = {};
      if (!grouped[dayMonth][destKey]) grouped[dayMonth][destKey] = 0;
      grouped[dayMonth][destKey]++;
    });

    const sortedDates = Object.keys(grouped).sort((a, b) => {
      const [dayA, monthA] = a.split("-").map(Number);
      const [dayB, monthB] = b.split("-").map(Number);
      return monthA - monthB || dayA - dayB;
    });

    // Obtener todos los destinos únicos
    const allDestinations = Array.from(
      new Set(filteredInvalidData.map((item) => item.origin.trim().toLowerCase()))
    ).sort();

    // Construir series: cada destino es una serie con datos por día
    const series = allDestinations.map((destKey) => ({
      name: destKey.charAt(0).toUpperCase() + destKey.slice(1), 
      data: sortedDates.map((date) => grouped[date][destKey] || 0),
      color: undefined,
    }));

    return { categories: sortedDates, series };
  }, [filteredInvalidData]);

  const options = useMemo(
    () => ({
      chart: { type: "column", backgroundColor: "transparent", height: 280 },
      title: { text: null },
      xAxis: {
        categories,
        lineColor: "transparent",
        tickWidth: 0,
        tickLength: 0,
        labels: {
          style: {
            fontSize: "0.65em",
            color: "#A6A6A6",
          },
          rotation: 0,
        },
      },
      yAxis: {
        title: {
          text: null,
        },
        labels: {
          enabled: false,
        },
        gridLineColor: "#D9D9D9",
        gridLineWidth: 0.5,
        gridLineDashStyle: "Dash",
      },
      tooltip: {
        backgroundColor: "#111214",
        borderWidth: 0,
        shadow: false,
        borderRadius: 10,
        padding: 10,
        style: { color: "#FFFFFF", fontSize: "0.65em" },
        shared: true,
        formatter: function () {
          const category =
            this.series.chart.xAxis[0].categories[this.point.x] || this.x;
          let tooltipText = `<b>${category}</b><br/>`;
          this.points.forEach((point) => {
            tooltipText += `<span style="color:${point.color}">●</span> <b>${point.series.name}</b>: ${point.y}<br/>`;
          });
          return tooltipText;
        },
      },
      plotOptions: {
        column: {
          stacking: "normal",
          valueSuffix: "tn",
          borderRadius: "15%",
          pointPadding: 0.05,
          groupPadding: 0.05,
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            inside: true,
            style: {
              fontSize: "0.7em",
              color: "#000",
              fontWeight: "bold",
              textOutline: "none",
              lineHeight: "1",
            },
            backgroundColor: "rgba(255, 255, 255, 0.5)",
            borderRadius: 3,
            padding: 3,
            borderWidth: 0,
            formatter: function () {
              return this.y === 0 ? null : this.y;
            },
          },
        },
      },
      series,
      legend: {
        align: "left",
        verticalAlign: "top",
        layout: "horizontal",
        floating: false,
        itemStyle: {
          color: "#A6A6A6",
          fontSize: "9px",
          fontWeight: "bold",
          textTransform: "uppercase",
        },
        itemHoverStyle: { color: "#1EE0EE" },
        symbolWidth: 10,
        symbolHeight: 9,
        symbolRadius: 2,
      },
      credits: { enabled: false },
      exporting: { enabled: false },
      accessibility: { enabled: false },
    }),
    [categories, series]
  );

  if (isLoading)
    return (
      <div className="bg-zinc-200 rounded-2xl flex items-center justify-center h-[280px] w-full animate-pulse" />
    );

  if (isError)
    return (
      <div className="flex items-center justify-center h-[280px] w-full">
        <span className="text-[10px] text-red-500">Ocurrió un error</span>
      </div>
    );

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}
