import { useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { filterData, filterValidTrips } from "@/lib/utilsGeneral";

export default function TravelsWeek({ data, isLoading, isError }) {
  const filteredInvalidData = useMemo(() => filterValidTrips(data), [data]);
  const filteredMineral = useMemo(() => filterData(data, "mineral"), [data]);
  const filteredDesmonte = useMemo(() => filterData(data, "desmonte"), [data]);

  const { categories, series } = useMemo(() => {
    const grouped = {};

    // Viajes válidos de mineral
    filteredMineral.forEach((item) => {
      if (!item.date) return;
      const dayMonth = `${new Date(item.date).getDate()}-${
        new Date(item.date).getMonth() + 1
      }`;
      if (!grouped[dayMonth])
        grouped[dayMonth] = {
          mineral: 0,
          desmonte: 0,
          remMineral: 0,
          remDesmonte: 0,
        };
      grouped[dayMonth].mineral++;
    });

    // Viajes válidos de desmonte
    filteredDesmonte.forEach((item) => {
      if (!item.date) return;
      const dayMonth = `${new Date(item.date).getDate()}-${
        new Date(item.date).getMonth() + 1
      }`;
      if (!grouped[dayMonth])
        grouped[dayMonth] = {
          mineral: 0,
          desmonte: 0,
          remMineral: 0,
          remDesmonte: 0,
        };
      grouped[dayMonth].desmonte++;
    });

    // Remanejo mineral y desmonte
    filteredInvalidData.forEach((item) => {
      if (!item.date) return;
      const dayMonth = `${new Date(item.date).getDate()}-${
        new Date(item.date).getMonth() + 1
      }`;
      if (!grouped[dayMonth])
        grouped[dayMonth] = {
          mineral: 0,
          desmonte: 0,
          remMineral: 0,
          remDesmonte: 0,
        };
      const mat = item.material?.toLowerCase();
      if (mat === "mineral") grouped[dayMonth].remMineral++;
      if (mat === "desmonte") grouped[dayMonth].remDesmonte++;
    });

    const sortedDates = Object.keys(grouped).sort((a, b) => {
      const [dayA, monthA] = a.split("-").map(Number);
      const [dayB, monthB] = b.split("-").map(Number);
      return monthA - monthB || dayA - dayB;
    });

    const series = [
      {
        name: "Mineral",
        data: sortedDates.map((d) => grouped[d].mineral),
        color: "#14B8A6",
      },
      {
        name: "Desmonte",
        data: sortedDates.map((d) => grouped[d].desmonte),
        color: "#F59E0B",
      },
      {
        name: "Remanejo Mineral",
        data: sortedDates.map((d) => grouped[d].remMineral),
        color: "#3770C2",
      },
      {
        name: "Remanejo Desmonte",
        data: sortedDates.map((d) => grouped[d].remDesmonte),
        color: "#898889",
      },
    ];

    return { categories: sortedDates, series };
  }, [data]);

  const options = useMemo(
    () => ({
      chart: { type: "column", backgroundColor: "transparent", height: 280 },
      title: { text: null },
      xAxis: {
        categories,
        lineColor: "transparent",
        crosshair: true,
        tickWidth: 0,
        tickLength: 0,
        labels: {
          style: {
            fontSize: "0.65rem",
            color: "#A6A6A6",
          },
        },
      },
      yAxis: {
        title: { text: null },
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
        style: {
          color: "#FFFFFF",
          fontSize: "0.65em",
        },
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
          grouping: true,
          pointPadding: 0,
          groupPadding: 0.05,
          borderWidth: 0,
          borderRadius: "20%",
          stacking: "normal", 
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
            backgroundColor: "rgba(255, 255, 255, 0.3)",
            borderRadius: 3,
            padding: 2,
            borderWidth: 0,
            formatter: function () {
              return this.y === 0 ? null : this.y;
            },
          },
        },
      },
      series,
      legend: {
        align: "right",
        verticalAlign: "top",
        layout: "horizontal",
        floating: false,
        itemStyle: {
          color: "#A6A6A6",
          fontSize: "9px",
          fontWeight: "bold",
          textTransform: "uppercase",
        },
        itemHoverStyle: {
          color: "#1EE0EE",
        },
        symbolWidth: 10,
        symbolHeight: 9,
        symbolRadius: 2,
        itemMarginTop: 0,
        itemMarginBottom: 0,
        zIndex: 10,
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
