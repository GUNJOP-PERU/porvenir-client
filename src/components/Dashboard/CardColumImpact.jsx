import { useGraphicData } from "@/hooks/useGraphicData";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useMemo } from "react";

export default function CardColumImpact({ symbol, endpoint }) {
  const { data = [], isLoading, isError } = useGraphicData(symbol, endpoint);

  const options = useMemo(
    () => ({
      chart: {
        type: "column",
        backgroundColor: "transparent",
        height: 280,
        marginTop: 45,
        marginBottom: 25,
      },
      title: {
        text: null,
      },
      xAxis: {
        categories: data?.categories, // Categorías de días
        lineColor: "transparent",
        crosshair: true,
        tickWidth: 0,
        tickLength: 0,
        labels: {
          style: {
            color: "#A6A6A6",
            fontSize: "0.6em",
          },
          rotation: 0,
        },
      },
      yAxis: [
        {
          title: {
            text: null, // Título del eje
          },
          labels: {
            enabled: false,
          },
          min: 0,
          gridLineWidth: 0,
        },
        // Segundo eje Y (para los porcentajes)
        {
          title: {
            text: null,
          },
          labels: {
            enabled: true,
            format: "{value}%",
            style: {
              color: "#A6A6A6",
              fontSize: "0.6em",
            },
          },
          min: 0,
          max: 100,
          tickInterval: 10,
          gridLineWidth: 0.5,
        },
      ],
      tooltip: {
        shared: true,
        valueSuffix: "",
        backgroundColor: "#111214",
        borderWidth: 0,
        shadow: false,
        borderRadius: 10,
        padding: 15,
        style: {
          color: "#FFFFFF",
          fontSize: "11px",
        },
        formatter: function () {
          const category =
            this.series.chart.xAxis[0].categories[this.point.x] || this.x;

          let tooltipText = `<b>${category}</b><br/>`;

          this.points.forEach((point) => {
            tooltipText += `<span style="color:${point.color}">●</span> <b>${
              point.series.name
            }</b>: ${Number(point.y).toFixed(1)}<br/>`;
          });

          return tooltipText;
        },
      },

      plotOptions: {
        column: {
          stacking: "normal", // Si usas apilamiento
          borderRadius: "15%",
          pointPadding: 0.05,
          groupPadding: 0.05,
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            style: {
              fontSize: "9px",
              color: "#000",
              fontWeight: "",
              textOutline: "none",
            },
            backgroundColor: "#C1F0F7",
            borderRadius: 5,
            padding: 5,
            borderWidth: 0,
            formatter: function () {
              return this.y.toFixed(1); // Formatear como porcentaje
            },
          },
        },
        spline: {
          marker: {
            enabled: true,
            radius: 3,
            symbol: "circle",
          },
          dataLabels: {
            enabled: true,
            style: {
              fontSize: "9px",
              color: "#A1A1AA",
              fontWeight: "bold",
              textOutline: "none",
            },
            formatter: function () {
              return this.y.toFixed(1) + "%"; // Formatear como porcentaje
            },
          },
        },
      },
      series: [
        {
          type: "column",
          name: "Indice de impacto",
          data: data?.index_impact,
          color: "#84CC16",
          yAxis: 0, // Asigna esta serie al primer eje Y (monto)
          stack: "Tiempo",
        },
        {
          type: "spline",
          name: "Porcentaje acumulado",
          data: data?.percentages,
          color: "#38BDF8",
          yAxis: 1, // Asigna esta serie al segundo eje Y (porcentaje)
          dataLabels: {
            enabled: true,
            style: {
              fontSize: "9px",
              color: "#A1A1AA",
              fontWeight: "bold",
              textOutline: "none",
            },
            formatter: function () {
              return this.y.toFixed(1) + "%"; // Formatear como porcentaje
            },
          },
        },
      ],
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
        itemMarginTop: 1,
        itemMarginBottom: 1,
        zIndex: 10,
      },
      credits: {
        enabled: false,
      },
      exporting: {
        enabled: false,
      },
      accessibility: {
        enabled: false,
      },
    }),
    [data]
  );

  if (isLoading)
    return (
      <div className="bg-zinc-200 rounded-2xl flex items-center justify-center h-[280px] w-full animate-pulse"></div>
    );
  if (isError)
    return (
      <div className="flex items-center justify-center h-full w-full ">
        <span className="text-[10px] text-red-500">Ocurrió un error</span>
      </div>
    );

  return (
    <>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </>
  );
}
