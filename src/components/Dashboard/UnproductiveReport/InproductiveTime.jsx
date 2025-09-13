import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useMemo } from "react";

export default function InproductiveTime({ data, isLoading, isError }) {
  // 🔹 Datos de ejemplo
  const mockData = {
    dates: [
      "22/05/2025",
      "23/05/2025",
      "24/05/2025",
      "25/05/2025",
      "26/05/2025",
      "27/05/2025",
      "28/05/2025",
    ],
    t_improductivo: [35.43, 57.72, 61.47, 71.37, 70.12, 89.92, 80.98],
    perc_improductivo: [6.2, 8.3, 9.1, 10.5, 10.3, 13.2, 12.0],
  };

  const chartData = data ?? mockData;

  const options = useMemo(
    () => ({
      chart: {
        backgroundColor: "transparent",
        height: 300,
      },
      title: {
        text: "Tiempo Improductivo (Hrs)",
        align: "center",
        style: { fontSize: "14px", fontWeight: "bold" },
      },
      xAxis: {
        categories: chartData.dates,
        crosshair: true,
        labels: {
          style: { fontSize: "10px", color: "#666" },
        },
      },
      yAxis: [
        {
          title: { text: "Horas" },
          min: 0,
        },
        {
          title: { text: "%" },
          min: 0,
          max: 15, // límite según tu gráfico
          opposite: true,
        },
      ],
      tooltip: {
        shared: true,
        formatter: function () {
          let tooltipText = `<b>${this.x}</b><br/>`;
          this.points.forEach((point) => {
            tooltipText += `<span style="color:${point.color}">●</span> <b>${
              point.series.name
            }</b>: ${point.y}${point.series.name.includes("%") ? "%" : " hr"}<br/>`;
          });
          return tooltipText;
        },
      },
      plotOptions: {
        column: {
          borderRadius: 5,
          dataLabels: {
            enabled: true,
            style: { fontSize: "9px" },
            formatter: function () {
              return this.y.toFixed(2);
            },
          },
        },
        spline: {
          dataLabels: {
            enabled: true,
            style: { fontSize: "9px", fontWeight: "bold", color: "#333" },
            formatter: function () {
              return `${this.y.toFixed(1)}%`;
            },
          },
        },
      },
      series: [
        {
          type: "column",
          name: "T_IMPRODUCTIVO",
          data: chartData.t_improductivo,
          color: "#60A5FA",
          yAxis: 0,
        },
        {
          type: "spline",
          name: "%_IMPRODUCTIVO",
          data: chartData.perc_improductivo,
          color: "#2563EB",
          yAxis: 1,
        },
      ],
      legend: {
        align: "center",
        verticalAlign: "bottom",
      },
      credits: { enabled: false },
    }),
    [chartData]
  );

  if (isLoading)
    return <div className="bg-gray-200 animate-pulse rounded-lg h-[300px]"></div>;
  if (isError)
    return (
      <div className="flex items-center justify-center h-[300px]">
        <span className="text-red-500 text-xs">Ocurrió un error</span>
      </div>
    );

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}
