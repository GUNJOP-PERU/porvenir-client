import { memo, useMemo } from "react";
import Highcharts from "highcharts/highcharts-gantt";
import HighchartsReact from "highcharts-react-official";
import highchartsXrange from "highcharts/modules/xrange";
import dayjs from "dayjs";
import "dayjs/plugin/timezone";
import { StatusDisplay } from "../StatusDisplay";

dayjs.tz.setDefault("America/Lima");

if (typeof highchartsXrange === "function") {
  highchartsXrange(Highcharts);
}

const CardTimeline = memo(({ data = [], isLoading, isError }) => {
  const getTimeRange = (shift) => {
    if (shift === "dia") {
      return {
        min: Date.UTC(2025, 0, 5, 6, 0),
        max: Date.UTC(2025, 0, 5, 18, 0),
      };
    } else if (shift === "noche") {
      return {
        min: Date.UTC(2025, 0, 5, 18, 0),
        max: Date.UTC(2025, 0, 6, 6, 0),
      };
    }
    return {};
  };

  const transformedData = useMemo(() => {
    const processedData = data?.data?.map((item) => {
      const [startHour, startMinute] = item.x?.split(":").map(Number) ?? [0, 0];
      const [endHour, endMinute] = item.x2?.split(":").map(Number) ?? [0, 0];

      let startTime = Date.UTC(2025, 0, 5, startHour, startMinute);
      let endTime = Date.UTC(2025, 0, 5, endHour, endMinute);

      return {
        x: startTime,
        x2: endTime,
        y: data?.rows?.indexOf(item.y) ?? -1,
        color: item.color || "gray",
        tajo: item.tajo || "N/A",
        title: item.title || "N/A",
      };
    });

    processedData?.sort((a, b) => a.x - b.x);

    return processedData?.map((item, index, arr) => {
      if (index === 0) return { ...item, showText: true };

      const prev = arr[index - 1];
      const isContinuous = Math.abs(prev.x2 - item.x) < 1000;

      if (prev.tajo === item.tajo && prev.y === item.y && isContinuous) {
        return { ...item, showText: false };
      }

      return { ...item, showText: true };
    });
  }, [data]);

  const { min, max } = getTimeRange(data?.shift);

  const fillGapsUntilLastEntry = (data, rows) => {
    const filledData = [...data];

    rows?.forEach((category) => {
      const categoryIndex = rows.indexOf(category);
      const categoryData = data.filter((item) => item.y === categoryIndex);

      if (categoryData.length === 0) return;

      const lastItem = categoryData.reduce(
        (max, item) => (item.x2 > max.x2 ? item : max),
        categoryData[0]
      );
      const lastEndTime = lastItem.x2;

      let previousEnd = min;

      categoryData
        .sort((a, b) => a.x - b.x)
        .forEach((item) => {
          if (item.x > previousEnd && item.x2 <= lastEndTime) {
            filledData.push({
              x: previousEnd,
              x2: item.x,
              y: categoryIndex,
              color: "red",
              tajo: "N/A",
              title: "N/A",
            });
          }
          previousEnd = item.x2;
        });
    });

    return filledData;
  };

  const filledTransformedData = useMemo(() => {
    return fillGapsUntilLastEntry(transformedData ?? [], data?.rows ?? []);
  }, [transformedData, data?.rows, min, max]);

  const options = useMemo(
    () => ({
      chart: {
        type: "xrange",
        backgroundColor: "transparent",
        height: 830,
        marginTop: 20,
        marginBottom: 50,
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
            fontWeight: "600",
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
          lineWidth: 0.5,
          tickAmount: 2,
          // categories: data?.rows,
          reversed: true,
          tickWidth: 0,
          minorTickInterval: 0,
          gridLineWidth: 1,
          labels: {
            align: "right",
            style: {
              color: "#6e6d7a",
              fontSize: "9px",
            },
          },
          categories: data?.rows,
        },
      ],
      tooltip: {
        shared: false,
        valueSuffix: " toneladas",
        backgroundColor: "#111214",
        borderWidth: 0,
        shadow: false,
        borderRadius: 10,
        padding: 12,
        style: {
          color: "#FFFFFF",
          fontSize: "11px",
        },
        formatter: function () {
          // Obtener las horas en formato HH:mm
          const startTime = Highcharts.dateFormat("%H:%M", this.point.x);
          const endTime = Highcharts.dateFormat("%H:%M", this.point.x2);
          const category = data?.rows[this.point.y]; // Obtener la categoría original
          const tajo = this.point.tajo || "";
          const title = this.point.title || ""; // Agregar el title

          return `
            <b>${category}</b><br/>
            <span style="color:${this.point.color}">\u25CF</span> ${startTime} - ${endTime}<br/>
            <b>Tajo:</b> ${tajo} <br/>
            <b>Title:</b> ${title}
          `;
        },
      },
      plotOptions: {
        xrange: {
          borderColor: "transparent", // Elimina el borde blanco
          borderWidth: 0, // Asegura que no haya borde
          borderRadius: 0,
          dataLabels: {
            enabled: true,
            align: "center", // Centra el texto horizontalmente
            verticalAlign: "top", // Asegura que el texto esté fuera
            y: -20, // Ajusta la altura para que no quede dentro de la barra
            formatter: function () {
              return this.point.showText ? this.point.tajo : "";
            },
            style: {
              color: "black",
              fontSize: "0.6rem",
              fontWeight: "700",
              textOutline: "none", // borde en el texto
            },
          },
        },
      },

      series: [
        {
          name: "valores",
          data: filledTransformedData,
        },
      ],
      annotations: [
        {
          labels: [
            {
              point: {
                x: Date.UTC(2025, 0, 5, 6, 0), // Ubicación en el eje X
                y: 0, // Ubicación en el eje Y (índice de la fila)
              },
              text: "TA",
              style: {
                color: "white",
                fontSize: "12px",
                fontWeight: "bold",
              },
            },
            {
              point: {
                x: Date.UTC(2025, 0, 5, 7, 0),
                y: 0,
              },
              text: "1h",
              style: { color: "white", fontSize: "10px" },
            },
            {
              point: {
                x: Date.UTC(2025, 0, 5, 10, 0),
                y: 0,
              },
              text: "3h",
              style: { color: "white", fontSize: "10px" },
            },
          ],
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
    [data, transformedData, min, max]
  );

  const noData =
    !data ||
    (!data.data?.length &&
      !data.rows?.length);

  if (isLoading || isError || noData)
    return (
      <StatusDisplay isLoading={isLoading} isError={isError} noData={noData} />
    );

  return (
    <div className="w-full h-full">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
});
CardTimeline.displayName = "CardTimeline";
export default CardTimeline;