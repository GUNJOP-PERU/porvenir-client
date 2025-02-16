import React, { Suspense, useMemo } from "react";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highchartsHeatmap from "highcharts/modules/heatmap";

// Inicializar los módulos
if (typeof highchartsHeatmap === "function") {
  highchartsHeatmap(Highcharts);
}

const HighchartsHeatmap = React.memo(({ data, title }) => {
  const dataTemporal = {
    xCategories: ["Cancha 100", "Faja 4", "Pocket 3"],
    yCategories: ["CX-097"],
    heatmapData: [
      {
        y: "CX-097",
        x: "Cancha 100",
        value: 100,
      },
    ],
  };

  const xCategories = useMemo(() => {
    return [...new Set(data?.map((item) => item?.destiny))];
  }, [data]);

  const yCategories = useMemo(() => {
    return [...new Set(data?.map((item) => item?.origin))];
  }, [data]);

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
      title: {
        text: "",
      },
      xAxis: {
        categories: xCategories || dataTemporal.xCategories,
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
        categories: yCategories || dataTemporal.yCategories,
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
          data: heatmapData || dataTemporal.heatmapData,
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
            "</span></b> tiene un valor de <br><b><span style='color:#F59E0B;'>" +
            this.point.value +
            "</span></b> en <b><span style='color:#10B981;'>" +
            this.series.yAxis.categories[this.point.y] +
            "</span></b>"
          );
        },
      },
    }),
    [heatmapData, xCategories, yCategories]
  );
  return (
    <>
      <h4 className="text-xs font-bold">{title}</h4>
      <div style={{ width: "100%", overflowX: "auto" }}>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    </>
  );
});
HighchartsHeatmap.displayName = "HighchartsHeatmap";
export default HighchartsHeatmap;
