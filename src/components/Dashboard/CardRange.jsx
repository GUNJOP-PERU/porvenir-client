import { useCallback, useMemo } from "react";
import IconWarning from "@/icons/IconWarning";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

export default function CardRange({ data }) {


  const parseTimeToCustomScale = useCallback((timeString) => {
    if (!timeString || !timeString.includes(":")) return null;
    const [hours, minutes] = timeString.split(":").map(Number);
    if (isNaN(hours) || isNaN(minutes)) return null; // Evita NaN
    let decimalTime = hours + minutes / 60;
    let adjustedTime = decimalTime - 19;
    if (adjustedTime < 0) adjustedTime += 24;
    return adjustedTime;
  }, []);
  
  const options = useMemo(
    () => ({
      chart: {
        type: "columnrange",
        backgroundColor: "transparent",
        height: 250,
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
          formatter: function () {
            return this.value.substring(0, 2); // 2 caracteres
          },
        },
      },
      yAxis: {
        title: { text: null },
        min: 0,   // Comienza a las 19:00 (como 0 en la escala)
        max: 24,  // Termina a las 18:59 del día siguiente (como 24 en la escala)
        tickInterval: 2,
        labels: {
          style: {
            color: "#A6A6A6",
            fontSize: "0.6em",
          },
          formatter: function () {
            let hour = (this.value + 19) % 24; // Volver a formato 24h
            return hour + ":00"; 
          },
        },
        gridLineColor: "#D9D9D9",
        gridLineWidth: 0.5,
        gridLineDashStyle: "Dash",
      },      
      tooltip: {
        shared: false,
        valueSuffix: " h",
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
          const category = this.series.chart.xAxis[0].categories[this.point.x] || this.x;
      
          // 📌 Usamos los valores originales guardados
          const start = this.point.originalStart || "N/A";
          const end = this.point.originalEnd || "N/A";
      
          return `
            <b>${category}</b><br/>
            <span style="color:${this.series.color}">●</span> 
            <b>${this.series.name}</b><br/>
            Inicio: <b>${start}</b> <br/>
            Fin: <b>${end}</b>
          `;
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
          data: data?.dates?.map((date, index) => {
            const min = data.averages?.[index]?.[0] || null;
            const max = data.averages?.[index]?.[1] || null;
      
            // Convertir solo si hay valores
            const start = min && min !== "" ? parseTimeToCustomScale(min) : null;
            const end = max && max !== "" ? parseTimeToCustomScale(max) : null;
      
            return [index, start, end]; // Mantenemos el índice para asegurar todas las fechas en X
          }),
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
        enabled: false,
      },
    }),
    [data]
  );

  return (
    <>
      <HighchartsReact highcharts={Highcharts} options={options} />
      <div className="border-[1px] border-red-500/50 bg-red-50 w-fit rounded-lg px-2.5 py-1 flex gap-1 text-red-500 text-[10px] leading-3">
        <IconWarning className="text-red-500 w-3 h-3" />
        <div className="flex items-center">
          <ul className="list-disc ml-3 flex flex-wrap gap-x-6 ">
           
            {data?.perfomance_summary ? (
              <>
                {data?.perfomance_summary.level_production?.high?.advice ? (
                  <li>
                    {data?.perfomance_summary.level_production.high.advice}
                  </li>
                ) : null}

                {data?.perfomance_summary.level_production?.low?.advice ? (
                  <li>
                    {data?.perfomance_summary.level_production.low.advice}
                  </li>
                ) : null}

                {data?.perfomance_summary.best_day?.date &&
                data?.perfomance_summary.best_day?.value ? (
                  <li>
                    Mejor día: {data?.perfomance_summary.best_day.date}{" "}
                    {data?.perfomance_summary.best_day.value.toLocaleString(
                      "es-MX"
                    )}{" "}
                    toneladas
                  </li>
                ) : null}

                {data?.perfomance_summary.worst_day?.date &&
                data?.perfomance_summary.worst_day?.value ? (
                  <li>
                    Peor día: {data?.perfomance_summary.worst_day.date} con{" "}
                    {data?.perfomance_summary.worst_day.value} toneladas
                  </li>
                ) : null}
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
