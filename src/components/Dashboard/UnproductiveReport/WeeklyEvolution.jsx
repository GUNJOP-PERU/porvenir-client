import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useMemo } from "react";

export default function WeeklyEvolution({ data, isLoading, isError }) {
  // 🔹 Datos de ejemplo
  const mockData = {
    weeks: ["19", "20", "21", "22"],
    t_impr: [670.52, 651.73, 442.98, 467.0], // horas improductivas
    improd_viaje: [9.87, 9.41, 6.21, 6.14], // minutos por viaje
    perc_impr: [14.1, 13.5, 9.1, 10.0], // %
    viajes: [4077, 4155, 4283, 4566], // número de viajes
    year: 2025,
  };

  const chartData = data ?? mockData;

  const options = useMemo(
    () => ({
      chart: {
        backgroundColor: "transparent",
        height: 300,
      },
      title: {
        text: "Evolución Semanal",
        align: "center",
        style: { fontSize: "14px", fontWeight: "bold" },
      },
      xAxis: {
        categories: chartData.weeks.map((w) => `Sem ${w}`),
        crosshair: true,
        labels: { style: { fontSize: "10px", color: "#666" } },
      },
      yAxis: [
        {
          title: { text: "Tiempo Improductivo (Hrs)" },
          min: 0,
        },
        {
          title: { text: "Improd/Viaje (min)" },
          min: 0,
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
            }</b>: ${point.y}${
              point.series.name.includes("Improd/Viaje") ? " min" : " hr"
            }<br/>`;
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
              return this.y.toFixed(2);
            },
          },
        },
      },
      series: [
        {
          type: "column",
          name: "T. Impr (Hrs)",
          data: chartData.t_impr,
          color: "#9CA3AF",
          yAxis: 0,
        },
        {
          type: "spline",
          name: "Improd/Viaje (min)",
          data: chartData.improd_viaje,
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

  return (
    <div>
      {/* 🔹 Gráfico */}
      <HighchartsReact highcharts={Highcharts} options={options} />

      {/* 🔹 Tabla resumen */}
      <table className="w-full text-xs mt-4 border border-gray-300 rounded-lg overflow-hidden">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th>Año</th>
            <th>Semana</th>
            <th>Viajes</th>
            <th>Tiempo Improductivo</th>
            <th>% Improductivo</th>
            <th>Improd/viaje</th>
          </tr>
        </thead>
        <tbody>
          {chartData.weeks.map((w, i) => (
            <tr key={i} className="text-center border-t">
              <td>{chartData.year}</td>
              <td>Sem{w}</td>
              <td>{chartData.viajes[i]}</td>
              <td>{chartData.t_impr[i]}</td>
              <td>{chartData.perc_impr[i]}%</td>
              <td>{chartData.improd_viaje[i]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
