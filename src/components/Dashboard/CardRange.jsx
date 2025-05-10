import { useCallback, useMemo } from "react";
import IconWarning from "@/icons/IconWarning";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useGraphicData } from "@/hooks/useGraphicData";

export default function CardRange({ symbol, endpoint }) {
  const { data = [], isLoading, isError } = useGraphicData(symbol, endpoint);

  const parseTimeToCustomScale = useCallback((timeString) => {
    if (!timeString || !timeString.includes(":")) return null;
    const [hours, minutes] = timeString.split(":").map(Number);
    if (isNaN(hours) || isNaN(minutes)) return null;
    return hours + minutes / 60;
  }, []);

  const prepareSeriesData = useMemo(() => {
    return data?.dates?.map((date, index) => {
      const average = data.averages?.[index];
  
      let minOriginal = null;
      let maxOriginal = null;
      let start = null;
      let end = null;
  
      if (Array.isArray(average) && average.length === 2) {
        minOriginal = average[0];
        maxOriginal = average[1];
        start = minOriginal ? parseTimeToCustomScale(minOriginal) : null;
        end = maxOriginal ? parseTimeToCustomScale(maxOriginal) : null;
      }
  
      return {
        x: index,
        low: start,
        high: end,
        originalStart: minOriginal,
        originalEnd: maxOriginal,
      };
    });
  }, [data]);

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
        min: 0, // Comienza a las 19:00 (como 0 en la escala)
        max: 24, // Termina a las 18:59 del día siguiente (como 24 en la escala)
        tickInterval: 2,
        labels: {
          style: {
            color: "#A6A6A6",
            fontSize: "0.6em",
          },
          formatter: function () {
            const hour = Math.floor(this.value);
            return hour + ":00";
          },
        },
        gridLineColor: "#D9D9D9",
        gridLineWidth: 0.5,
        gridLineDashStyle: "Dash",
        plotLines: [
          {
            value: 8, // Hora 8:00
            color: "#FF0000",
            width: 1.5,
            dashStyle: "Dash",
            label: {
              text: "8:00",
              align: "right",
              x: -5,
              y: 12,
              style: {
                color: "#FF0000",
                fontSize: "0.6em",
                fontWeight: "bold",
              },
            },
            zIndex: 5,
          },
          {
            value: 19, // Hora 19:00
            color: "#FF0000",
            width: 1.5,
            dashStyle: "Dash",
            label: {
              text: "19:00",
              align: "right",
              x: -5,
              y: -5,
              style: {
                color: "#FF0000",
                fontSize: "0.6em",
                fontWeight: "bold",
              },
            },
            zIndex: 5,
          },
        ],
      },
      tooltip: {
        shared: false,
        valueSuffix: "h",
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
          const category =
            this.series.chart.xAxis[0].categories[this.point.x] || this.x;

          return `
            <b>${category}</b><br/>
            <span style="color:${this.series.color}">●</span>           
            Inicio: <b>${this.point.originalStart || "N/A"}</b> <br/>
            <span style="color:${this.series.color}">●</span>
            Fin: <b>${this.point.originalEnd || "N/A"}</b>
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
          name: "Turno Mañana",
          data: prepareSeriesData,         
          // data: dataPrueba.ranges.mañana.map((item, index) => ({
          //   x: index,
          //   low: item.low,
          //   high: item.high,
          //   originalStart: item.low + ":00",
          //   originalEnd: item.high + ":00",
          // })),
          pointPlacement: 0,
          color: "#1E64FA",
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

  if (isLoading)
    return (
      <div className="bg-zinc-200 rounded-2xl flex items-center justify-center h-[250px] w-full animate-pulse"></div>
    );
  if (isError)
    return (
      <div className="flex items-center justify-center h-[250px] w-full ">
        <span className="text-[10px] text-red-500">Ocurrió un error</span>
      </div>
    );

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}
