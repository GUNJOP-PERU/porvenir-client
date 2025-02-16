import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useMemo } from "react";

export default function CardActivitiesChart({ data }) {
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
        categories: data?.labors, // Categorías de actividades
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
            text: null,
          },
          labels: {
            enabled: false,
            style: {
              color: "#F43F5E",
              fontSize: "0.6em",
            },
          },
          min: 0,
          gridLineWidth: 0.5,
          gridLineColor: "#D9D9D9",
        },
        {
          title: {
            text: null,
          },
          labels: {
            enabled: false,
            style: {
              color: "#40CEEB",
              fontSize: "0.6em",
            },
          },
          min: 0,
          gridLineWidth: 0,
          opposite: true, // Eje lado derecho
        },
      ],
      tooltip: {
        shared: true,
        valueSuffix: "hr",
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
            tooltipText += `<span style="color:${point.color}">●</span> <b>${point.series.name}</b>: ${Number(point.y).toFixed(1)}hr<br/>`;
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
            inside: true, //  números dentro de la columna
            verticalAlign: "middle", // Centra el número verticalmente dentro de la barra
            style: {
              fontSize: "9px",
              color: "#000", //  visibilidad dentro de la barra
              textOutline: "none",
            },
            backgroundColor: "rgba(255, 255, 255, 0.6)",
            borderRadius: 5,
            padding: 5,
            borderWidth: 0,
            formatter: function () {
              return this.y.toFixed(1);
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
              return this.y.toFixed(1);
            },
          },
        },
      },
      series: [
        {
          type: "column",
          name: "Suma de Cola por Origen",
          data: data?.sum_cola_origin,
          color: "#F43F5E",
          yAxis: 0, // Eje izquierdo
        },
        {
          type: "spline",
          name: "Prom. de Cola por Ciclo",
          data: data?.avg_cola_cycle,
          color: "#40CEEB",
          yAxis: 1, // Eje derecho
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
        itemHoverStyle: {
          color: "#1EE0EE",
        },
        symbolWidth: 10,
        symbolHeight: 9,
        symbolRadius: 2,
        itemMarginTop: 1,
        itemMarginBottom: 1,
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

  return (
    <>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </>
  );
}
