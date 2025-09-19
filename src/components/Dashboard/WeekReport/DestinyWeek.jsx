import { useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { filterData } from "@/lib/utilsGeneral";
import { StatusDisplay } from "../StatusDisplay";
import dayjs from "dayjs";
import { formatShortDay } from "@/lib/utilsGeneral";

export default function DestinyWeek({ data, selectedRange, isLoading, isError }) {
  const filteredData = useMemo(() => filterData(data), [data]);

  const { categories, series } = useMemo(() => {
    if (!selectedRange) return { categories: [], series: [] };

    const start = dayjs(selectedRange.startDate);
    const end = dayjs(selectedRange.endDate);

    const allDates = [];
    for (let d = start; d.isBefore(end) || d.isSame(end, "day"); d = d.add(1, "day")) {
      allDates.push(d.format("YYYY-MM-DD"));
    }

    const grouped = {};
    filteredData.forEach((item) => {
      if (!item.date || !item.destiny) return;

      const dayMonth = dayjs(item.date).format("YYYY-MM-DD");
      const destKey = item.destiny.trim().toLowerCase();

      if (!grouped[dayMonth]) grouped[dayMonth] = {};
      if (!grouped[dayMonth][destKey]) grouped[dayMonth][destKey] = 0;
      grouped[dayMonth][destKey]++;
    });

    const allowedDestinations = [
      "dique 4",
      "planta",
      "pocket 3",
      "parrilla 1",
      "parrilla 2",
      "cancha 100",
      "faja 4",
      "pahuaypite",
      "labor a labor",
    ];

    const allDestinations = Array.from(
      new Set(filteredData.map((item) => item.destiny.trim().toLowerCase()))
    ).filter((dest) => allowedDestinations.includes(dest));

    const series = allDestinations.map((destKey) => ({
      name: destKey.charAt(0).toUpperCase() + destKey.slice(1),
      data: allDates.map((date) => grouped[date]?.[destKey] || 0),
      total: allDates.reduce((total, date) => total + (grouped[date]?.[destKey] || 0), 0),
    }));

    const displayDates = allDates.map(formatShortDay);

    return { categories: displayDates, series };
  }, [filteredData, selectedRange]);


  const options = useMemo(
    () => ({
      colors: [
        "#6B46C1", // morado intenso
        "#9F7AEA", // lila brillante
        "#D6BCFA", // lila claro
        "#F687B3", // rosa fuerte
        "#FBB6CE", // rosa pastel
        "#3B82F6", // azul vibrante
        "#60A5FA", // azul medio
        "#93C5FD", // azul claro
        "#BFDBFE", // azul pastel luminoso
      ],
      chart: { type: "column", backgroundColor: "transparent", height: 280 },
      title: { text: null },
      xAxis: {
        categories,
        lineColor: "transparent",
        tickWidth: 0,
        tickLength: 0,
        labels: {
          style: {
            color: "#A6A6A6",
            fontSize: "0.65em",
            fontWeight: "600",
          },
          rotation: 0,
        },
      },
      yAxis: {
        title: { text: null },
        labels: { enabled: false },
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
