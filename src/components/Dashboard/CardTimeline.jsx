import { memo, useMemo } from "react";
import Highcharts from "highcharts/highcharts-gantt";
import HighchartsReact from "highcharts-react-official";
import highchartsXrange from "highcharts/modules/xrange";
import dayjs from "dayjs";
import "dayjs/plugin/timezone";

dayjs.tz.setDefault("America/Lima");

if (typeof highchartsXrange === "function") {
  highchartsXrange(Highcharts);
}

const CardTimeline = memo(({data =[],isLoading, isError}) => {

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
 
  const transformedData = useMemo(() => {
    const processedData = data?.data?.map((item) => {
      const [startHour, startMinute] = item.x.split(":").map(Number);
      const [endHour, endMinute] = item.x2.split(":").map(Number);
  
      let startTime = Date.UTC(2025, 0, 5, startHour, startMinute);
      let endTime = Date.UTC(2025, 0, 5, endHour, endMinute);
  
      return {
        x: startTime,
        x2: endTime,
        y: data?.rows?.indexOf(item.y),
        color: item.color,
        tajo: item.tajo,
        title: item.title,
      };
    });
  
    // Ordenamos los datos por tiempo de inicio
    processedData?.sort((a, b) => a.x - b.x);
  
    // Ocultamos el texto si el tajo es el mismo y son continuos
    return processedData?.map((item, index, arr) => {
      if (index === 0) return { ...item, showText: true };
  
      const prev = arr[index - 1];
  
      // Tolerancia en la comparación de tiempo (por si hay pequeñas diferencias)
      const isContinuous = Math.abs(prev.x2 - item.x) < 1000; // 1 segundo de tolerancia
  
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

      if (categoryData.length === 0) return; // Si no hay datos en la categoría, no hacemos nada

      // Encontrar el último evento en esta categoría
      const lastItem = categoryData.reduce(
        (max, item) => (item.x2 > max.x2 ? item : max),
        categoryData[0]
      );
      const lastEndTime = lastItem.x2; // Última hora de finalización

      let previousEnd = min; // Comenzamos desde el inicio del turno

      categoryData
        .sort((a, b) => a.x - b.x) // Ordenamos por tiempo de inicio
        .forEach((item) => {
          if (item.x > previousEnd && item.x2 <= lastEndTime) {
            // Solo rellenamos si el hueco está antes del último dato
            filledData.push({
              x: previousEnd,
              x2: item.x,
              y: categoryIndex,
              color: "red", // Color plomo claro
              tajo: "",
            });
          }
          previousEnd = item.x2; // Actualizamos el último tiempo registrado
        });
    });

    return filledData;
  };

  // Aplicamos la función antes de renderizar el gráfico
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

  if (isLoading)
    return (
      <div className="bg-zinc-200 rounded-2xl py-2 px-4 flex items-center justify-center w-full h-full animate-pulse"></div>
    );

  if (isError)
    return (
      <div className="bg-zinc-100/50 rounded-2xl py-2 px-4 flex items-center justify-center h-[100px] md:h-[90px] animate-pulse">
        <span className="text-[8px] text-red-500">Ocurrió un error</span>
      </div>
    );

  return (
    <>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </>
  );
});
CardTimeline.displayName = "CardTimeline";
export default CardTimeline;


// const data = {
  //   shift: "dia",
  //   data: [
  //     {
  //       x: "06:10",
  //       x2: "07:40",
  //       y: "SC-21",
  //       color: "red",
  //       format: 1,
  //       tajo: "TJ-381",
  //     },
  //     {
  //       x: "10:40",
  //       x2: "12:40",
  //       y: "SC-21",
  //       color: "black",
  //       format: 1,
  //       tajo: "TJ-381",
  //     },
  //     {
  //       x: "12:40",
  //       x2: "17:30",
  //       y: "SC-21",
  //       color: "gray",
  //       format: 1,
  //       tajo: "TJ-381",
  //     },
  //     {
  //       x: "17:30",
  //       x2: "17:40",
  //       y: "SC-21",
  //       color: "blue",
  //       format: 1,
  //       tajo: "TJ-381",
  //     },
  //     {
  //       x: "06:50",
  //       x2: "08:20",
  //       y: "SC-22",
  //       color: "blue",
  //       format: 1,
  //       tajo: "TJ-381",
  //     },
  //     {
  //       x: "08:45",
  //       x2: "09:15",
  //       y: "SC-23",
  //       color: "green",
  //       format: 1,
  //       tajo: "TJ-381",
  //     },
  //     {
  //       x: "11:35",
  //       x2: "12:15",
  //       y: "SC-23",
  //       color: "gray",
  //       format: 1,
  //       tajo: "TJ-382",
  //     },
  //     {
  //       x: "13:45",
  //       x2: "15:15",
  //       y: "SC-23",
  //       color: "pink",
  //       format: 1,
  //       tajo: "TJ-382",
  //     },
  //     {
  //       x: "15:35",
  //       x2: "15:45",
  //       y: "SC-23",
  //       color: "gray",
  //       format: 1,
  //       tajo: "TJ-382",
  //     },
  //     {
  //       x: "15:46",
  //       x2: "15:55",
  //       y: "SC-23",
  //       color: "pink",
  //       format: 1,
  //       tajo: "TJ-383",
  //     },
  //     {
  //       x: "16:35",
  //       x2: "17:15",
  //       y: "SC-23",
  //       color: "gray",
  //       format: 1,
  //       tajo: "TJ-383",
  //     },
  //     {
  //       x: "17:30",
  //       x2: "17:45",
  //       y: "SC-23",
  //       color: "pink",
  //       format: 1,
  //       tajo: "TJ-384",
  //     },
  //     {
  //       x: "17:30",
  //       x2: "17:45",
  //       y: "SC-24",
  //       color: "pink",
  //       format: 1,
  //       tajo: "TJ-385",
  //     },
  //   ],
  //   rows: ["SC-21", "SC-22", "SC-23", "SC-24"],
  // };