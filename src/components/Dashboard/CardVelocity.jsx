import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useMemo } from "react";

export default function CardVelocity({ data, title }) {
  console.log(data, "velocity");
  const options = useMemo(
    () => ({
      chart: {
        type: "spline",
        backgroundColor: "transparent",
        height: 280,
        marginTop: 45,
        marginBottom: 25,
      },
      title: {
        text: null,
      },
      xAxis: {
        categories: data?.dates, // Horas
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
          enabled: true,
          style: {
            color: "#A6A6A6",
            fontSize: "0.6em",
          },
        },
        min: 0, // Evita que muestre valores en 0
        softMin: 1, // Para que no empiece en 0 si hay datos bajos
        gridLineWidth: 0.5,
        gridLineColor: "#D9D9D9",
      },
      tooltip: {
        shared: true,
        backgroundColor: "#111214",
        borderWidth: 0,
        shadow: false,
        borderRadius: 10,
        padding: 15,
        style: {
          color: "#FFFFFF",
          fontSize: "11px",
        },
      },
      plotOptions: {
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
              return this.y ? this.y.toFixed(1) : ""; // Oculta etiquetas en 0
            },
          },
        },
      },
      series: [
        {
          name: "Velocidad Vacio",
          data: data?.velocities_lleno,
          color: "#F43F5E",
        },
        {
          name: "Velocidad Cargado",
          data: data?.velocities_empty,
          color: "#84CC16",
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
        enabled: false
      },
    }),
    [data]
  );

  return (
    <>
      {data?.dates?.length > 0 ? (
        <>
          <h4 className="text-xs font-bold">{title}</h4>
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
