import { formatThousands } from "@/lib/utilsGeneral";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useMemo } from "react";

export default function CardColumScoop({}) {
  const advance = [10, 20, 30,0, 20, 0,0, 20, 30,10, 20, 30,2];
  const production = [5, 0, 15, 15, 15, 15, 5, 10,5, 0, 0, 0, 0];
  const hour = [
    "07:00",
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
  ];
  const options = useMemo(
    () => ({
      chart: {
        type: "column",
        backgroundColor: "transparent",
        height: 200,
        marginTop: 35,
        marginBottom:30,
      },
      title: {
        text: null,
      },
      xAxis: {
        categories: hour,
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
      // yAxis: {
      //   title: {
      //     text: null,
      //   },
      //   labels: {
      //     style: {
      //       color: "#A6A6A6",
      //       fontSize: "0.6em",
      //     },
      //   },
      //   gridLineColor: "#D9D9D9",
      //   gridLineWidth: 0.5,
      //   gridLineDashStyle: "Dash",
      // },
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
          pointPadding: 0.2,
          groupPadding: 0.2,
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
          name: "Avance",
          data: advance,
          color: "#F59E0B",
          stack: "Tiempo",
        },
        {
          type: "column",
          name: "Produccion",
          data: production,
          color: "#14B8A6",
          stack: "Tiempo",
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
    [advance]
  );

  return (
    <>
      {advance.length > 0 ? (
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
