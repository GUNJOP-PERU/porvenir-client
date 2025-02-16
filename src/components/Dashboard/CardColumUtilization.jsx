import { formatThousands } from "@/lib/utilsGeneral";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useMemo } from "react";

export default function CardColumUtilization({ data }) {
  // console.log(data, "Utilization");

  const options = useMemo(
    () => ({
      chart: {
        type: "column",
        backgroundColor: "transparent",
        height: 300,
        marginTop: 5,
      },
      title: {
        text: null,
      },
      xAxis: {
        categories: data?.dates, // Categorías de días
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
        valueSuffix: " toneladas",
        backgroundColor: "#111214",
        borderWidth: 0,
        shadow: false,
        borderRadius: 10,
        padding: 15,
        style: {
          color: "#FFFFFF",
          fontSize: "11px",
          fontWeight: "",
        },
      },
      plotOptions: {
        column: {
          stacking: "normal", // Si usas apilamiento, mantenlo, de lo contrario elimínalo
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
            borderWidth: 0,
            formatter: function () {
              return formatThousands(this.y); // Asegúrate de formatear correctamente
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
          name: "Prod/dia",
          data: data?.production_by_day,
          color: "#5BB66B",
          yAxis: 0, // Asigna esta serie al primer eje Y (monto)
          stack: "Tiempo",
        },
        {
          type: "spline",
          name: "Utilización",
          data: data?.percentage_utilization,
          color: "#4070EB",
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

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}
