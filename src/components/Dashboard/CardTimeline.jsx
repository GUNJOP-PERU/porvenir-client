import { useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highchartsXrange from "highcharts/modules/xrange";
import dayjs from "dayjs";
import "dayjs/plugin/timezone";

// Si la librería está disponible, la inicializamos
if (typeof highchartsXrange === "function") {
  highchartsXrange(Highcharts);
}

// Establecer la zona horaria por defecto
dayjs.tz.setDefault("America/Lima");

export default function CardTimeline({ data }) {
  // const dataGen = {
  //   shift: "dia",
  //   data: [
  //     { x: "06:10", x2: "07:40", y: "SC-21 TJ-381", color: "red", format: 1 },
  //     { x: "06:50", x2: "08:20", y: "SC-22 TJ-382", color: "blue", format: 1 },
  //     { x: "08:45", x2: "09:15", y: "SC-23 TJ-383", color: "green", format: 1 },
  //     { x: "11:35", x2: "12:15", y: "SC-23 TJ-383", color: "gray", format: 1 },
  //     { x: "13:45", x2: "15:15", y: "SC-23 TJ-383", color: "pink", format: 1 },
  //     { x: "15:35", x2: "15:45", y: "SC-23 TJ-383", color: "gray", format: 1 },
  //     { x: "15:46", x2: "15:55", y: "SC-23 TJ-383", color: "pink", format: 1 },
  //     { x: "16:35", x2: "17:15", y: "SC-23 TJ-383", color: "gray", format: 1 },
  //     { x: "17:30", x2: "17:45", y: "SC-23 TJ-383", color: "pink", format: 1 },
  //   ],
  //   categories: ["SC-21 TJ-381", "SC-22 TJ-382", "SC-23 TJ-383"],
  // };

  const getTimeRange = (shift) => {
    if (shift === "dia") {
      return {
        min: Date.UTC(2025, 0, 5, 6, 0), // 5 de enero de 2025 a las 07:00
        max: Date.UTC(2025, 0, 5, 18, 0), // 5 de enero de 2025 a las 19:00
      };
    } else if (shift === "noche") {
      return {
        min: Date.UTC(2025, 0, 5, 18, 0), // 5 de enero de 2025 a las 19:00
        max: Date.UTC(2025, 0, 6, 6, 0), // 6 de enero de 2025 a las 07:00
      };
    }
    return {};
  };

  // Transformar los datos para ajustarlos al formato de Highcharts
  const transformedData = useMemo(() => {
    return data?.data?.map((item) => {
      const [startHour, startMinute] = item.x.split(":").map(Number);
      const [endHour, endMinute] = item.x2.split(":").map(Number);

      let startTime, endTime;

      if (item.format === 1) {
        // Si el formato es 1, usamos el 5 de enero
        startTime = Date.UTC(2025, 0, 5, startHour, startMinute);
        endTime = Date.UTC(2025, 0, 5, endHour, endMinute);
      } else if (item.format === 2) {
        // Si el formato es 2, usamos el 6 de enero
        startTime = Date.UTC(2025, 0, 6, startHour, startMinute);
        endTime = Date.UTC(2025, 0, 6, endHour, endMinute);
      }

      return {
        x: startTime,
        x2: endTime,
        y: data?.rows?.indexOf(item.y),
        color: item.color || "gray",
      };
    });
  }, [data]);

  const { min, max } = getTimeRange(data?.shift);

  console.log(data, "nuev");

  const options = useMemo(
    () => ({
      chart: {
        type: "xrange",
        backgroundColor: "transparent",
        height: 200,
        marginTop: 35,
        marginBottom: 30,
      },
      title: {
        text: null,
      },
      xAxis: {
        type: "datetime",
        min: min || Date.UTC(2025, 0, 5, 7, 0, 0),
        max: max || Date.UTC(2025, 0, 5, 19, 0, 0),
        lineColor: "#A6A6A6",
        lineWidth: 0.5,
        tickInterval: 3600 * 1000,
        crosshair: true,
        tickWidth: 1,
        tickLength: 0,
        gridLineWidth: 1,
        labels: {
          style: {
            color: "#A6A6A6",
            fontSize: "0.6em",
          },
          format: "{value:%H:%M}",
        },
      },
      yAxis: [
        {
          title: {
            text: null,
          },
          lineColor: "#A6A6A6",
          gridLineWidth: 0,
          categories: data?.rows,
          reversed: true,
          lineWidth: 0.5,
          tickWidth: 0,
          minorTickInterval: 0,
          tickAmount: 2,
          labels: {
            align: "right",
            style: {
              color: "#6e6d7a",
              fontSize: "9px",
            },
          },
        },
      ],
      tooltip: {
        shared: true,
        valueSuffix: " toneladas",
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
          // Obtener las horas en formato HH:mm
          const startTime = Highcharts.dateFormat("%H:%M", this.point.x);
          const endTime = Highcharts.dateFormat("%H:%M", this.point.x2);
          const category = data?.rows[this.point.y]; // Obtener la categoría original

          return `
            <b>${category}</b><br/>
            <span style="color:${this.point.color}">\u25CF</span> ${startTime} - ${endTime}
          `;
        },
      },
      plotOptions: {
        xrange: {
          borderRadius: 0,
          borderWidth: 0,
          grouping: false,
          dataLabels: {
            align: "center",
            enabled: true,
          },
          colorByPoint: true,
        },
      },
      series: [
        {
          name: "valores",
          pointWidth: 20,
          data: transformedData,
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
    }),
    [data, transformedData, min, max]
  );

  return (
    <>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </>
  );
}
