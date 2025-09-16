import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useMemo } from "react";

export default function ParetoTime({ data, isLoading, isError }) {

    const mockData = {
    labors: [
      "Espera el primer inicio de carguío",
      "Espera para inicio de carguío",
      "Espera para reinicio de carguío",
      "Tráfico en la vía",
      "Falta de Scoop",
      "Espera en Parrilla",
      "Obstrucción de Vías con agua/equipos",
      "Espera zona de descarga Planta cancha",
      "Cambio de Orden",
      "Espera Operador Scoop",
    ],
    sum_cola_origin: [162.52, 135.39, 52.05, 37.14, 29.14, 15.22, 9.35, 7.8, 7.69, 6.7],
    avg_cola_cycle: [34.8, 74.94, 82.89, 89.13, 92.28, 94.3, 96.8, 97.7, 99.1, 100],
  };

  const chartData = data ?? mockData;

  const options = useMemo(
    () => ({
      chart: {
        type: "column",
        backgroundColor: "transparent",
        height: 280,
        marginTop: 45,
        marginBottom: 25,
      },
      title: { text: null },
      xAxis: {
        categories: chartData.labors,
        lineColor: "transparent",
        crosshair: true,
        tickWidth: 0,
        tickLength: 0,
        labels: {
          style: { color: "#A6A6A6", fontSize: "0.6em" },
          rotation: 0,
        },
      },
      yAxis: [
        {
          title: { text: null },
          labels: { enabled: false },
          min: 0,
          gridLineWidth: 0.5,
          gridLineColor: "#D9D9D9",
        },
        {
          title: { text: null },
          labels: { enabled: false },
          min: 0,
          gridLineWidth: 0,
          opposite: true,
        },
      ],
      tooltip: {
        shared: true,
        backgroundColor: "#111214",
        borderWidth: 0,
        shadow: false,
        borderRadius: 10,
        padding: 15,
        style: { color: "#FFFFFF", fontSize: "11px" },
        formatter: function () {
          const category = this.series.chart.xAxis[0].categories[this.point.x] || this.x;
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
          pointPadding: 0.1,
          groupPadding: 0.1,
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            inside: true,
            verticalAlign: "middle",
            style: { fontSize: "9px", color: "#000", textOutline: "none" },
            formatter: function () {
              return this.y.toFixed(1);
            },
          },
        },
        spline: {
          marker: { enabled: true, radius: 3, symbol: "circle" },
          dataLabels: {
            enabled: true,
            style: { fontSize: "9px", color: "#A1A1AA", fontWeight: "bold", textOutline: "none" },
            formatter: function () {
              return this.y.toFixed(1);
            },
          },
        },
      },
      series: [
        {
          type: "column",
          name: "Suma de Cola por Origen",
          data: chartData.sum_cola_origin,
          color: "#F43F5E",
          yAxis: 0,
        },
        {
          type: "spline",
          name: "Prom. de Cola por Ciclo",
          data: chartData.avg_cola_cycle,
          color: "#40CEEB",
          yAxis: 1,
        },
      ],
      legend: {
        align: "right",
        verticalAlign: "top",
        layout: "horizontal",
        itemStyle: { color: "#A6A6A6", fontSize: "9px", fontWeight: "bold", textTransform: "uppercase" },
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

  if (isLoading)
    return (
      <div className="bg-zinc-200 rounded-2xl flex items-center justify-center h-[280px] w-full animate-pulse"></div>
    );
  if (isError)
    return (
      <div className="flex items-center justify-center h-[280px] w-full ">
        <span className="text-[10px] text-red-500">Ocurrió un error</span>
      </div>
    );

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}
