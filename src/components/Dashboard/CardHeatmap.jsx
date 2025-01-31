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
        plotBorderWidth: 0, 
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
            color: "#A1A1AA",
            fontSize: "0.6em",
            fontWeight: "bold",
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
            color: "#A1A1AA",
            fontSize: "0.6em",
            fontWeight: "bold",
          },
        },
        gridLineWidth: 0,
      
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
          borderRadius: "15%",
          data: heatmapData,
          borderWidth: 2,
          borderColor: "#FFFFFF",
          dataLabels: {
            enabled: true,
            color: "#000000",
            style: {
              fontSize: "0.7em",
              color: "#000",
              fontWeight: "bold",
              textOutline: "none",
            },
            borderWidth: 0,
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
      <HighchartsReact highcharts={Highcharts} options={options} />
    </>
  );
}
