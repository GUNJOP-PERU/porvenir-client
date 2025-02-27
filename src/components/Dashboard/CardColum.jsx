import { useGraphicData } from "@/hooks/useGraphicData";
import IconWarning from "@/icons/IconWarning";
import { formatThousands } from "@/lib/utilsGeneral";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useMemo } from "react";

export default function CardColum() {
  const {
    data = [],
    isLoading,
    isError,
  } = useGraphicData( "monthly-chart-tonnes","dashboard/monthly/chart-tonnes",);

  const options = useMemo(
    () => ({
      chart: {
        type: "column",
        backgroundColor: "transparent",
        height: 280,
        marginTop: 5,
        marginBottom: 35,
      },
      title: {
        text: null,
      },
      xAxis: {
        categories: data?.dates,
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
          enabled: false,
        },
        gridLineColor: "#D9D9D9",
        gridLineWidth: 0.5,
        gridLineDashStyle: "Dash",
      },

      tooltip: {
        shared: true,
        valueSuffix: "tn",
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
            }</b>: ${Number(point.y).toFixed(1)}tn<br/>`;
          });

          return tooltipText;
        },
      },
      plotOptions: {
        column: {
          stacking: "normal",
          valueSuffix: "tn",
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
              return formatThousands(this.y);
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
      <div className="bg-zinc-200 rounded-2xl flex items-center justify-center h-full w-full animate-pulse"></div>
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
      <div className="border-[1px] border-red-500/50 bg-red-50 w-fit rounded-lg px-2.5 py-1 flex gap-1 text-red-500 text-[10px] leading-3">
        <IconWarning className="text-red-500 w-3 h-3" />
        <div className="flex items-center">
          <ul className="list-disc ml-3 flex flex-wrap gap-x-6 ">
            {/* Verificar si los datos existen antes de renderizar */}
            {data?.perfomance_summary ? (
              <>
                {data?.perfomance_summary.level_production?.high?.advice ? (
                  <li>
                    {data?.perfomance_summary.level_production.high.advice}
                  </li>
                ) : (
                  <li>No hay consejo para nivel alto</li> // Mensaje alternativo
                )}

                {data?.perfomance_summary.level_production?.low?.advice ? (
                  <li>
                    {data?.perfomance_summary.level_production.low.advice}
                  </li>
                ) : (
                  <li>No hay consejo para nivel bajo</li> // Mensaje alternativo
                )}

                {data?.perfomance_summary.best_day?.date &&
                data?.perfomance_summary.best_day?.value ? (
                  <li>
                    Mejor día: {data?.perfomance_summary.best_day.date}{" "}
                    {data?.perfomance_summary.best_day.value} toneladas
                  </li>
                ) : (
                  <li>No hay datos para el mejor día</li> // Mensaje alternativo
                )}

                {data?.perfomance_summary.worst_day?.date &&
                data?.perfomance_summary.worst_day?.value ? (
                  <li>
                    Peor día: {data?.perfomance_summary.worst_day.date} con{" "}
                    {data?.perfomance_summary.worst_day.value} toneladas
                  </li>
                ) : (
                  <li>No hay datos para el peor día</li> // Mensaje alternativo
                )}
              </>
            ) : (
              <li>No hay datos disponibles</li> // Si no hay datos
            )}
          </ul>
        </div>
      </div>
    </>
  );
}
