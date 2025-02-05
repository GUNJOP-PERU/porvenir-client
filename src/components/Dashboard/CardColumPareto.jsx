import { formatThousands } from "@/lib/utilsGeneral";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useMemo } from "react";

export default function CardColumPareto({ data }) {
  console.log(data);
  const options = useMemo(
    () => ({
      chart: {
        type: "column",
        backgroundColor: "transparent",
        height: 280,
        marginTop: 35,
      },
      title: {
        text: null,
      },
      xAxis: {
        categories: data?.days,
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

      yAxis: {
        title: {
          text: null,
        },
        labels: {
          enabled: false, // Oculta solo los números del eje Y
        },
        gridLineColor: "#D9D9D9",
        gridLineWidth: 0.5,
        gridLineDashStyle: "Dash",
      },

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
          stacking: "normal",
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
              return formatThousands(this.y);
            },
          },
        },
      },
      series: [
        {
          type: "column",
          name: "Día",
          data: data?.values_day,
          color: "#FAC34C",
          stack: "Tiempo",
        },
        {
          type: "column",
          name: "Noche",
          data: data?.values_night,
          color: "#3C3F43",
          stack: "Tiempo",
        },
        {
          type: "spline",
          name: "Proyectado",
          data: data?.goal_tonnages,
          color: "#1EE0EE",
          marker: {
            enabled: true, // Muestra los puntos en la línea
            radius: 3, // Tamaño de los puntos
            symbol: "circle", // Forma del punto (puedes cambiarlo a square, diamond, etc.)
          },
          dataLabels: {
            enabled: true, // Activa las etiquetas
            style: {
              fontSize: "9px",
              color: "#A1A1AA",
              fontWeight: "bold",
              textOutline: "none",
            },
            formatter: function () {
              return formatThousands(this.y); // Aplica el formato de miles
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
    }),
    [data]
  );

  return (
    <>
      {data?.days?.length > 0 ? (
        <>
          <h4 className="text-xs font-bold">
            Tonelaje - Planificado vs Ejecutado
          </h4>
          <HighchartsReact highcharts={Highcharts} options={options} />
         
        </>
      ) : (
        <p className="mx-auto text-zinc-400 text-[10px] leading-3 max-w-20 text-center">
          No hay datos disponibles
        </p>
      )}
    </>
  );
}
