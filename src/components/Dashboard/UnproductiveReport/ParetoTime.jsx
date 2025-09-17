import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useMemo } from "react";
import { StatusDisplay } from "../StatusDisplay";
import { roundAndFormat } from "@/lib/utilsGeneral";

export default function ParetoTime({ data, limit = 10, isLoading, isError }) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        labors: [],
        sum_cola_origin: [],
        cumulative_percent: [],
      };
    }

    const grouped = data.reduce((acc, curr) => {
      const name = curr.activityName || "Sin Nombre";
      if (!acc[name]) acc[name] = [];
      acc[name].push(curr.duration ?? 0);
      return acc;
    }, {});

    const laborsRaw = Object.keys(grouped).map((name) => ({
      name,
      sum: grouped[name].reduce((a, b) => a + b, 0),
    }));
    laborsRaw.sort((a, b) => b.sum - a.sum);

    const topLaborsRaw = laborsRaw.slice(0, limit);

    const labors = topLaborsRaw.map((item) => item.name);
    const sum_cola_origin = labors.map((name) =>
      grouped[name].reduce((a, b) => a + b, 0)
    );

    const total = sum_cola_origin.reduce((a, b) => a + b, 0);
    let cumulative = 0;
    const cumulative_percent = sum_cola_origin.map((val) => {
      cumulative += val;
      return (cumulative / total) * 100;
    });

    return { labors, sum_cola_origin, cumulative_percent, topLaborsRaw };
  }, [data]);

  const options = useMemo(
    () => ({
      chart: {
        type: "column",
        backgroundColor: "transparent",
        height: 330,
      },
      title: { text: null },
      xAxis: {
        categories: chartData.labors,
        lineColor: "transparent",
        crosshair: true,
        tickWidth: 0,
        tickLength: 0,
        labels: {
          useHTML: true,
          formatter: function () {
            const maxChars = 10; // máx. caracteres por línea
            const words = this.value.split(" ");
            let line = "";
            let lines = [];

            words.forEach((word) => {
              if ((line + word).length > maxChars) {
                // si pasaríamos del límite, cerramos línea
                lines.push(line.trim());
                line = word + " ";
              } else {
                line += word + " ";
              }
            });
            if (line.trim().length > 0) lines.push(line.trim());

            return lines.join("<br>");
          },
          style: {
            display: "block",
            textAlign: "center",
            whiteSpace: "normal",
            fontSize: "0.6rem",
            fontWeight: "600",
            color: "#A1A1AA",
            fontFamily: "Nunito, sans-serif",
            lineHeight: "10px",
          },
        },
      },

      yAxis: [
        {
          title: { text: null },
          labels: {
            enabled: false,
          },
          gridLineColor: "#D9D9D9",
          gridLineWidth: 0.5,
          gridLineDashStyle: "Dash",
        },
        {
          title: { text: null },
          labels: {
            enabled: false,
          },
          gridLineColor: "#D9D9D9",
          gridLineWidth: 0.5,
          gridLineDashStyle: "Dash",
        },
      ],
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
            tooltipText += `<span style="color:${point.color}">●</span> <b>${
              point.series.name
            }</b>: ${Number(point.y).toFixed(1)} hr<br/>`;
          });
          return tooltipText;
        },
      },
      plotOptions: {
        column: {
          borderRadius: "15%",
          pointPadding: 0.02,
          groupPadding: 0.02,
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            inside: true,
            verticalAlign: "middle",
            style: { fontSize: "0.6rem", color: "#000", textOutline: "none" },
            formatter: function () {
              return this.y == 0 ? "" : roundAndFormat(this.y);
            },
          },
        },
        spline: {
          marker: { enabled: true, radius: 4, symbol: "circle" },
          dataLabels: {
            enabled: true,
            style: {
              fontSize: "0.6rem",
              color: "#4070EB",
              fontWeight: "600",
              textOutline: "none",
            },
            formatter: function () {
              return `${this.y.toFixed(2)}%`;
            },
            backgroundColor: "#eaeaea80",
            borderRadius: 3,
            padding: 3,
          },
        },
      },
      series: [
        {
          type: "column",
          name: "Horas acumuladas",
          data: chartData.sum_cola_origin.map((val, i) => ({
            y: val,
            color: i < 3 ? "#41b3ff" : "#D9D9D9",
          })),
          yAxis: 0,
        },
        {
          type: "spline",
          name: "% acumulado",
          data: chartData.cumulative_percent,
          color: "#4070EB",
          yAxis: 1,
          tooltip: {
            valueSuffix: "%",
          },
        },
      ],
      legend: {
        align: "right",
        verticalAlign: "top",
        layout: "horizontal",
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
        itemMarginTop: 1,
        itemMarginBottom: 1,
      },
      credits: { enabled: false },
      exporting: { enabled: false },
      accessibility: { enabled: false },
    }),
    [chartData]
  );

  if (isLoading || isError || !data || data.length === 0)
    return (
      <StatusDisplay
        isLoading={isLoading}
        isError={isError}
        noData={!data || data.length === 0}
        height={280}
      />
    );

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}
