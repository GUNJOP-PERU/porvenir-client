import IconWarning from "@/icons/IconWarning";
import { formatThousands } from "@/lib/utilsGeneral";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useMemo } from "react";
const projectedValues = [
  5234, 8790, 6352, 7998, 5543, 9000, 7684, 8321, 7120, 6955, 8473, 5998, 7450,
  8201, 6593, 8745, 5102, 8888, 5342, 7999, 6011, 8555, 7777, 6900, 5400, 8692,
  8150, 7250, 7355, 8801, 7923,
];

export default function CardColum({ data }) {
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
        categories: data?.data?.dates,
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
          data: data?.data?.values_day,
          color: "#FAC34C",
          stack: "Tiempo",
        },
        {
          type: "column",
          name: "Noche",
          data: data?.data?.values_night,
          color: "#3C3F43",
          stack: "Tiempo",
        },
        {
          type: "spline",
          name: "Proyectado",
          data: projectedValues,
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
    <div>
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
    </div>
  );
}
