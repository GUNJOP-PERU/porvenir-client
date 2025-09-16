import { useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { StatusDisplay } from "../StatusDisplay";
import dayjs from "dayjs";

export default function RemanejoWeek({ data, selectedRange, isLoading, isError }) {
  const { categories, series } = useMemo(() => {
    if (!selectedRange) return { categories: [], series: [] };

    // 🔹 Generar todas las fechas del rango
    const start = dayjs(selectedRange.startDate);
    const end = dayjs(selectedRange.endDate);

    const allDates = [];
    for (let d = start; d.isBefore(end) || d.isSame(end, "day"); d = d.add(1, "day")) {
      allDates.push(d.format("DD-MM"));
    }

    // 🔹 Filtrar solo combinaciones permitidas
    const allowedPairs = [
      { origin: "cancha 100", destiny: "pahuaypite" },
      { origin: "cancha 100", destiny: "dique 4" },
      { origin: "cancha 100", destiny: "faja 4" },
      { origin: "faja 4", destiny: "planta" },
    ];

    const filtered = data.filter((item) => {
      if (!item.date || !item.origin || !item.destiny) return false;

      const origin = item.origin.trim().toLowerCase();
      const destiny = item.destiny.trim().toLowerCase();

      const isExactAllowed = allowedPairs.some(
        (pair) => pair.origin === origin && pair.destiny === destiny
      );

      const isBcAllowed = origin.startsWith("bc-") && destiny === "pahuaypite";

      return isExactAllowed || isBcAllowed;
    });

    // 🔹 Agrupar por fecha y origen → destino
    const grouped = {};
    filtered.forEach((item) => {
      const dayMonth = dayjs(item.date).format("DD-MM");
      const origin = item.origin.trim().toLowerCase();
      const destiny = item.destiny.trim().toLowerCase();
      const key = `${origin} → ${destiny}`;

      if (!grouped[dayMonth]) grouped[dayMonth] = {};
      if (!grouped[dayMonth][key]) grouped[dayMonth][key] = 0;
      grouped[dayMonth][key]++;
    });

    // 🔹 Todas las combinaciones que existen en los datos filtrados
    const allKeys = Array.from(
      new Set(
        filtered.map((item) => {
          const origin = item.origin.trim().toLowerCase();
          const destiny = item.destiny.trim().toLowerCase();
          return `${origin} → ${destiny}`;
        })
      )
    ).sort();

    // 🔹 Construir series con todos los días
    const series = allKeys.map((key) => ({
      name: key
        .split(" → ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" → "),
      data: allDates.map((date) => grouped[date]?.[key] || 0),
      color: undefined,
    }));

    return { categories: allDates, series };
  }, [data, selectedRange]);

  const options = useMemo(
    () => ({
      colors: [
        "#663532",
        "#834943",
        "#b3685b",
        "#f79885",
        "#ffdbb6",
        "#c5986b"
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
