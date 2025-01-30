import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import Heatmap from "highcharts/modules/heatmap";
import { useMemo } from "react";

// Inicializar los módulos
if (typeof Highcharts === "object") {
}

export default function HighchartsHeatmap({ data, title }) {
  const xCategories = useMemo(() => {
    return [
      ...new Set(data?.origins_destinies_tonnages.map((item) => item.destiny)),
    ];
  }, [data?.origins_destinies_tonnages]);

  const yCategories = useMemo(() => {
    return [
      ...new Set(data?.origins_destinies_tonnages.map((item) => item.origin)),
    ];
  }, [data?.origins_destinies_tonnages]);

  const heatmapData = useMemo(() => {
    return data?.origins_destinies_tonnages.map((item) => {
      const xIndex = xCategories.indexOf(item.destiny);
      const yIndex = yCategories.indexOf(item.origin);
      return [xIndex, yIndex, item.value]; // Formato: [xIndex, yIndex, value]
    });
  }, [data?.origins_destinies_tonnages, xCategories, yCategories]);

  const options = useMemo(
    () => ({
      chart: {
        backgroundColor: "transparent",
        type: "heatmap",
        plotBorderWidth: 1,
        height: 300,
      },

      title: {
        text: "",
      },

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
            color: "#6e6d7a",
            fontSize: "0.7em",
          },
        },
      },

      yAxis: {
        categories: yCategories,
        title: {
          text: "",
        },
        labels: {
          style: {
            color: "#6e6d7a",
            fontSize: "0.7em",
          },
        },
        gridLineColor: "#2D3343",
        gridLineWidth: 0.5,
        gridLineDashStyle: "Dash",
      },

      colorAxis: {
        min: 0,
        stops: [
          [0, "#e0f3f8"],  // Azul claro
          [0.5, "#abd9e9"], // Azul medio
          [0.75, "#74add1"], // Azul fuerte
          [1, "#4575b4"], // Azul oscuro
        ],
      },
      

      series: [
        {
          name: "Valores",
          borderWidth: 1,
          data: heatmapData,
          dataLabels: {
            enabled: true,
            color: "#000000",
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
      tooltip: {
        formatter: function () {
          return (
            "<b>" +
            this.series.xAxis.categories[this.point.x] +
            "</b> tiene un valor de <br><b>" +
            this.point.value +
            "</b> en <br><b>" +
            this.series.yAxis.categories[this.point.y] +
            "</b>"
          );
        },
      },
    }),
    [heatmapData, xCategories, yCategories]
  );
  return (
    <>
      <h4 className="text-xs font-bold">{title}</h4>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </>
  );
}
