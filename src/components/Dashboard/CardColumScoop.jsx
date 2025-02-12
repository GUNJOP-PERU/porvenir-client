import { formatThousands } from "@/lib/utilsGeneral";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useMemo } from "react";

export default function CardColumScoop({ data }) {

  const dataTemporal = {
    hours: [
      "18:00",
      "19:00",
      "20:00",
      "21:00",
      "22:00",
      "23:00",
      "00:00",
      "01:00",
      "02:00",
      "03:00",
      "04:00",
      "05:00",
      "06:00",
    ],
    advance: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    production: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  };

  const options = useMemo(
    () => ({
      chart: {
        type: "column",
        backgroundColor: "transparent",
        height: 180,
        marginTop: 35,
        marginBottom: 30,
      },
      title: {
        text: null,
      },
      xAxis: {
        categories: data?.hours || dataTemporal.hours,
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
          data: data?.advance || dataTemporal.advance,
          color: "#F59E0B",
          stack: "Tiempo",
        },
        {
          type: "column",
          name: "Produccion",
          data: data?.production || dataTemporal.production,
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
      accessibility: {
        enabled: false,
      },
    }),
    [data]
  );

  return (
    <>
      <h4 className="text-xs font-bold">Tonelaje - Planificado vs Ejecutado</h4>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </>
  );
}
