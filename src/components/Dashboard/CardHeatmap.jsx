import { useGraphicData } from "@/hooks/useGraphicData";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highcharts.src.js";
import highchartsHeatmap from "highcharts/modules/heatmap";
import React, { useMemo, useRef } from "react";

// Inicializar los módulos
if (typeof highchartsHeatmap === "function") {
  highchartsHeatmap(Highcharts);
}

const CardHeatMap = React.memo(() => {
  const {
    data = [],
    isLoading,
    isError,
  } = useGraphicData("truck-heatmap","dashboard/truck/heatmap" );

  const chartRef = useRef(null); // Referencia al gráfico

  const xCategories = useMemo(
    () => [...new Set(data?.map((item) => item?.destiny))],
    [data]
  );
  const yCategories = useMemo(
    () => [...new Set(data?.map((item) => item?.origin))],
    [data]
  );

  const heatmapData = useMemo(() => {
    return data?.map((item) => {
      const xIndex = xCategories.indexOf(item?.destiny);
      const yIndex = yCategories.indexOf(item?.origin);
      return [xIndex, yIndex, item.value];
    });
  }, [data, xCategories, yCategories]);

  const options = useMemo(
    () => ({
      chart: {
        backgroundColor: "transparent",
        type: "heatmap",
        plotBorderWidth: 0,
        height: 280,
        marginTop: 0,
        marginBottom: 30,
      },
      title: { text: null },
      xAxis: {
        categories: xCategories,
        title: {
          text: "",
        },

        lineColor: "transparent",
        alignTicks: false,
        crosshair: true,
        tickWidth: 0,
        tickLength: 0,
        labels: {
          style: {
            color: "#A1A1AA",
            fontSize: "0.6em",
            fontWeight: "bold",
          },
          rotation: 0,
        },
        gridLineWidth: 1,
        // gridLineColor: "#A1A1AA",
      },
      yAxis: {
        categories: yCategories,
        title: {
          text: "",
        },
        labels: {
          style: {
            color: "#A1A1AA",
            fontSize: "0.6em",
            fontWeight: "bold",
          },
        },
        gridLineWidth: 1,
      },
      colorAxis: {
        min: 0,
        stops: [
          [0, "#e0f3f8"], // Azul claro
          [0.5, "#abd9e9"], // Azul medio
          [0.75, "#74add1"], // Azul fuerte
          [1, "#4575b4"], // Azul oscuro
        ],
      },
      series: [
        {
          name: "Valores",
          data: heatmapData,
          borderWidth: 2,
          borderColor: "#F4F4F580",
          dataLabels: {
            enabled: true,
            color: "#000000",
            style: {
              fontSize: "0.7em",
              color: "#000",
              fontWeight: "bold",
              textOutline: "none",
            },
          },
        },
      ],
      
      tooltip: {
        valueSuffix: " toneladas",
        backgroundColor: "#111214",
        borderWidth: 0,
        shadow: false,
        borderRadius: 10,
        padding: 12,
        style: {
          color: "#FFFFFF",
          fontSize: "11px",
          fontWeight: "",
        },
        formatter: function () {
          return (
            "<b><span style='color:#abd9e9;'>" +
            this.series.xAxis.categories[this.point.x] +
            "</span></b> <br/> <b><span style='color:#F59E0B;'>" +
            this.point.value.toLocaleString("en-US", { maximumFractionDigits: 0 }) +"tn"+
            "</span></b> <br/> <b><span style='color:#10B981;'>" +
            this.series.yAxis.categories[this.point.y] +
            "</span></b>"
          );
        },
      },
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
    [heatmapData, xCategories, yCategories]
  );
  
  if (isLoading)
    return (
      <div className="bg-zinc-200 rounded-2xl h-[280px] w-full animate-pulse"></div>
    );
  if (isError)
    return (
      <div className="py-2 px-4 flex items-center justify-center h-[280px] w-full ">
        <span className="text-[10px] text-red-500">Ocurrió un error</span>
      </div>
    );
  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <HighchartsReact
        ref={chartRef}
        highcharts={Highcharts}
        options={options}
      />
    </div>
  );
});

export default CardHeatMap;
