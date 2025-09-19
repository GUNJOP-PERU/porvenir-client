import { useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { filterData, filterValidTrips } from "@/lib/utilsGeneral";
import { StatusDisplay } from "../StatusDisplay";
import { formatShortDay } from "@/lib/utilsGeneral";
import dayjs from "dayjs";

export default function TravelsWeek({ data, selectedRange, isLoading, isError }) {
  const filteredInvalidData = useMemo(() => filterValidTrips(data), [data]);
  const filteredMineral = useMemo(() => filterData(data, "mineral"), [data]);
  const filteredDesmonte = useMemo(() => filterData(data, "desmonte"), [data]);

  const { categories, series } = useMemo(() => {
    if (!selectedRange) return { categories: [], series: [] };
  
    const start = dayjs(selectedRange.startDate);
    const end = dayjs(selectedRange.endDate);
    const allDates = [];
    for (let d = start; d.isBefore(end) || d.isSame(end, "day"); d = d.add(1, "day")) {
      allDates.push(d.format("YYYY-MM-DD")); 
    }
  
    const grouped = {};
  
    allDates.forEach((date) => {
      grouped[date] = { mineral: 0, desmonte: 0, remMineral: 0, remDesmonte: 0 };
    });
  
    filteredMineral.forEach((item) => {
      if (!item.date) return;
      const dayKey = dayjs(item.date).format("YYYY-MM-DD");
      if (!grouped[dayKey]) grouped[dayKey] = { mineral: 0, desmonte: 0, remMineral: 0, remDesmonte: 0 };
      grouped[dayKey].mineral++;
    });
  
    filteredDesmonte.forEach((item) => {
      if (!item.date) return;
      const dayKey = dayjs(item.date).format("YYYY-MM-DD");
      if (!grouped[dayKey]) grouped[dayKey] = { mineral: 0, desmonte: 0, remMineral: 0, remDesmonte: 0 };
      grouped[dayKey].desmonte++;
    });
  
    filteredInvalidData.forEach((item) => {
      if (!item.date) return;
      const dayKey = dayjs(item.date).format("YYYY-MM-DD");
      if (!grouped[dayKey]) grouped[dayKey] = { mineral: 0, desmonte: 0, remMineral: 0, remDesmonte: 0 };
      const mat = item.material?.toLowerCase();
      if (mat === "mineral") grouped[dayKey].remMineral++;
      if (mat === "desmonte") grouped[dayKey].remDesmonte++;
    });
  
    const displayDates = allDates.map(formatShortDay);
  
    const series = [
      { name: "Mineral", data: allDates.map((d) => grouped[d].mineral), color: "#14B8A6", total: allDates.reduce((total, d) => total + grouped[d].mineral, 0) },
      { name: "Desmonte", data: allDates.map((d) => grouped[d].desmonte), color: "#F59E0B", total: allDates.reduce((total, d) => total + grouped[d].desmonte, 0) },
      { name: "Remanejo Mineral", data: allDates.map((d) => grouped[d].remMineral), color: "#6EE7B7", total: allDates.reduce((total, d) => total + grouped[d].remMineral, 0) },
      { name: "Remanejo Desmonte", data: allDates.map((d) => grouped[d].remDesmonte), color: "#FFD580", total: allDates.reduce((total, d) => total + grouped[d].remDesmonte, 0) },
    ];
  
    return { categories: displayDates, series };
  }, [data, selectedRange]);  

  const options = useMemo(
    () => ({
      chart: { type: "column", backgroundColor: "transparent", height: 280 },
      title: { text: null },
      xAxis: {
        categories: categories,
        lineColor: "transparent",
        crosshair: true,
        tickWidth: 0,
        tickLength: 0,
        labels: {
          style: {
            fontSize: "0.65rem",
            color: "#A6A6A6",
            fontWeight: "600",
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
        labelFormatter: function () {
          return `<b style="color:#000">${this.options.total}</b> | ${this.name}`; 
        },
      },
      credits: { enabled: false },
      exporting: { enabled: false },
      accessibility: { enabled: false },
    }),
    [categories, series]
  );

  const noData =
  !categories.length || !series.length || series.every(s => s.data.every(d => d === 0));


  if (isLoading || isError || noData) {
    return (
      <StatusDisplay
        isLoading={isLoading}
        isError={isError}
        noData={noData}
        height="280px"
      />
    );
  }

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}
