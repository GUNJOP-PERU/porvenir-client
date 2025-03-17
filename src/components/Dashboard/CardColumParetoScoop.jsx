import { useGraphicData } from "@/hooks/useGraphicData";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useMemo } from "react";

export default function CardColumParetoScoop() {
  const { data = [], isLoading, isError } = useGraphicData("pareto-scoop-no-productive-activities","dashboard/pareto/no-productive-activities?equipment=scoop" );
  const dataTemporal = {
    dates: [
      "01:02",
      "02:02",
      "03:02",
      "04:02",
      "06:02",
      "07:02",
      "08:02",
      "09:02",
      "10:02",
      "11:02",
      "12:02",
      "13:02",
      "14:02",
      "15:02",
      "16:02",
      "17:02",
      "18:02",
      "19:02",
      "20:02",
      "21:02",
      "22:02",
      "23:02",
      "24:02",
      "25:02",
      "26:02",
      "27:02",
      "28:02",
    ],
    maintenance_act: [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0,
    ],
  };

  const options = useMemo(
    () => ({
      chart: {
        type: "column",
        backgroundColor: "transparent",
        height: 280,
        marginTop: 25,
        marginBottom: 25,
      },
      title: {
        text: null,
      },
      xAxis: {
        categories: data?.dates || dataTemporal.dates,
        lineColor: "transparent",
        crosshair: true,
        tickWidth: 0,
        tickLength: 0,
        labels: {
          style: {
            color: "#A6A6A6",
            fontSize: "0.6em",
          },
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
          let tooltipText = `<b>${category}</b><br/>`; // Mostrar la fecha/hora correcta
          this.points.forEach((point) => {
            tooltipText += `<span style="color:${point.color}">●</span> <b>${
              point.series.name
            }</b>: ${Number(point.y).toFixed(1)}hr<br/>`;
          });

          return tooltipText;
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
              fontSize: "8px",
              color: "#000",
              fontWeight: "bold",
              textOutline: "none",
            },
            backgroundColor: "rgba(255, 255, 255, 0.5)",
            borderRadius: 3,
            padding: 3,
            borderWidth: 0,
            formatter: function () {
              return this.y !== 0 ? Number(this.y).toFixed(1) : "";
            },
          },
        },
      },
      series: [
        {
          type: "column",
          name: "Horas Parada por Mantenimiento",
          data: data?.maintenance_act,
          color: "#FF9500",
          stack: "Hour",
        },
        {
          type: "column",
          name: "Horas Improductivas No Gerenciales",
          data: data?.unplanned_act,
          color: "#347AE2",
          stack: "Hour",
        },
        {
          type: "column",
          name: "Horas Improductivas Gerenciales",
          data: data?.programming_act,
          color: "#22C2C5",
          stack: "Hour",
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
