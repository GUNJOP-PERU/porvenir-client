import IconWarning from "@/icons/IconWarning";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useMemo } from "react";

export default function CardRange({ data, title }) {
  const minValue = data?.data?.averages?.length
    ? Math.min(...data.data.averages.map(([min]) => min))
    : null;
  const maxValue = data?.data?.averages?.length
    ? Math.max(...data.data.averages.map(([, max]) => max))
    : null;

  const formatHours = (hours) => {
    const h = Math.floor(hours); // Horas completas
    const m = Math.round((hours - h) * 60); // Minutos (resto convertido a minutos)
    return `${h}:${m < 10 ? "0" + m : m}`; // Formato hh:mm
  };

  console.log(data,"range")

  const parseTimeToDecimal = (timeString) => {
    if (!timeString) return null;
    const [hours, minutes] = timeString.split(":").map(Number);
    return hours + minutes / 60;
  };

  
  const options = useMemo(
    () => ({
      chart: {
        type: "columnrange",
        backgroundColor: "transparent",
        height: 260,
        marginBottom:35,
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
      yAxis: {
        title: {
          text: null,
        },
        min: 0, // Inicio del eje Y en 0 horas
        max: 24, // Fin del eje Y en 24 horas
        tickInterval: 2, // Intervalos cada 2 horas para mejor visualización
        labels: {
          style: {
            color: "#A6A6A6",
            fontSize: "0.6em",
          },
          formatter: function () {
            return formatHours(this.value); // Manteniendo el formateo de horas
          },
        },
        gridLineColor: "#D9D9D9",
        gridLineWidth: 0.5,
        gridLineDashStyle: "Dash",
        plotLines: [
          {
            value: minValue || 0,
            color: "#A855F7",
            width: 1,
            dashStyle: "Dash",
            label: {
              text: `Prom: ${formatHours(minValue)}`,
              align: "right",
              style: {
                color: "#A855F7",
                fontSize: "0.5em",
              },
            },
          },
          {
            value: maxValue || 0,
            color: "#A855F7",
            width: 1,
            dashStyle: "Dash",
            label: {
              text: `Prom: ${formatHours(maxValue)}`,
              align: "right",
              style: {
                color: "#A855F7",
                fontSize: "0.5em",
              },
            },
          },
        ],
      },
      tooltip: {
        shared: true,
        valueSuffix: " hr",
        backgroundColor: "#111214",
        borderWidth: 0,
        shadow: false,
        borderRadius: 10,
        padding: 10,
        style: {
          color: "#FFFFFF",
          fontSize: "11px",
        },
        formatter: function () {
          return `${this.series.name}: <b>${formatHours(this.y)}</b> hr`; // Formato de 2 decimales para horas
        },
      },
      plotOptions: {
        columnrange: {
          borderRadius: "50%",
          pointPadding: 0.2,
          groupPadding: 0.2,
          borderWidth: 0,
          color: "#1E64FA",
        },
      },
      series: [
        {
          name: "Tiempos",
          data: data?.data?.averages.map(([min, max]) => [
            parseTimeToDecimal(min), // Convertir el mínimo
            parseTimeToDecimal(max), // Convertir el máximo
          ]),
        },
      ],      
      legend: {
        enabled: false,
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
      {data?.data?.dates.length > 0 ? (
        <>
          <h4 className="text-xs font-bold">{title}</h4>
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
                        {data?.perfomance_summary.best_day.value.toLocaleString(
                          "es-MX"
                        )}{" "}
                        toneladas
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
                      <li>No hay datos para el peor día </li> // Mensaje alternativo
                    )}
                  </>
                ) : (
                  <li>No hay datos disponibles</li> // Si no hay datos
                )}
              </ul>
            </div>
          </div>
        </>
      ) : (
        <p className="mx-auto text-zinc-400 text-[10px] leading-3 max-w-20 text-center">
          No hay datos disponibles
        </p>
      )}
    </>
  );
}
