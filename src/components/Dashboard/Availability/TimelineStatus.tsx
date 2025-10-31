import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highcharts.src.js";
import highchartsHeatmap from "highcharts/modules/heatmap";
import { useMemo } from "react";
import { StatusDisplay } from "../StatusDisplay";

if (typeof highchartsHeatmap === "function") {
  highchartsHeatmap(Highcharts);
}

type DataPoint = {
  dateString: string;
  hours: string;
  operativo: number;
  inoperativo: number;
  mantenimiento: number;
  disponibilidad?: number;
};

interface HeatmapProps {
  data: DataPoint[];
  isLoading: boolean;
  isError: boolean;
}

const TimelineStatus = ({ data = [], isLoading, isError }: HeatmapProps) => {
  const statuses = [
    "Equipos Operativos",
    "Mantinimiento Preventivo",
    "Mantinimiento Correctivo",
  ];

  const statusColors = {
    "Equipos Operativos": "#16A34A",
    "Mantinimiento Correctivo": "#ef4444",
    "Mantinimiento Preventivo": "#ff758f",
  };

  const { xCategories, heatData, maxValue } = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) {
      return { xCategories: [], heatData: [], maxValue: 0 };
    }
    const xCats = data.map((r) => r.hours);

    const points: [number, number, number][] = [];
    let max = 0;
    data.forEach((row, x) => {
      const vals = [
        Number(row.operativo ?? 0),
        Number(row.mantenimiento ?? 0),
        Number(row.inoperativo ?? 0),
      ];
      vals.forEach((v, y) => {
        const statusName = statuses[y];
        const baseColor =
          statusColors[statusName as keyof typeof statusColors] ?? "#cccccc";

        const color =
          !v || v === 0
            ? Highcharts.color(baseColor).setOpacity(0.2).get("rgba")
            : baseColor;

        points.push({ x, y, value: v, color });
        if (v > max) max = v;
      });
    });

    return { xCategories: xCats, heatData: points, maxValue: max };
  }, [data]);

  const options: Highcharts.Options = useMemo(
    () => ({
      chart: {
        backgroundColor: "transparent",
        type: "heatmap",
        plotBorderWidth: 0,
        height: 280,
      },
      title: { text: null },
      xAxis: {
        categories: xCategories,
        title: { text: "" },
        lineColor: "transparent",
        alignTicks: false,
        crosshair: true,
        tickWidth: 0,
        tickLength: 0,
        labels: {
          style: {
            color: "#A1A1AA",
            fontSize: "0.8rem",
            fontWeight: "bold",
          },
          rotation: 0,
        },
        gridLineWidth: 0,
        gridLineColor: "transparent",
      },
      yAxis: {
        categories: statuses,
        title: { text: null },
        labels: {
          formatter: function () {
            return this.value.toString().replace(/\s+/g, "<br/>");
          },
          style: {
            color: "#A1A1AA",
            fontSize: "0.8rem",
            fontWeight: "bold",
          },
        },
        gridLineWidth: 0,
        gridLineColor: "transparent",
        reversed: true,
      },
      colorAxis: undefined,
      tooltip: {
        backgroundColor: "#111214",
        borderWidth: 0,
        shadow: false,
        borderRadius: 10,
        padding: 10,
        style: {
          color: "#FFFFFF",
          fontSize: "0.65em",
        },
        formatter: function (this: any) {
          const xIdx = this.point.x;
          const yIdx = this.point.y;
          const cat = xCategories[xIdx] ?? "";
          const status = statuses[yIdx] ?? "";
          const val = this.point.value ?? 0;
          return `<b>${cat}</b><br/><b>${status}:</b> ${val}`;
        },
        useHTML: true,
      },
      plotOptions: {
        series: {
          animation: false,
        },
      },
      series: [
        {
          type: "heatmap",
          name: "Estados",
          borderWidth: 4,
          borderColor: "#ffffff",
          borderRadius: 10,
          nullColor: "#e0f3f870",
          data: heatData,
          dataLabels: {
            enabled: true,
            formatter: function (this: any) {
              return this.point.value ? String(this.point.value) : "";
            },
            style: {
              fontSize: "1.5rem",
              color: "#ffffff",
              fontWeight: "bold",
              textOutline: "none",
            },
          },
        },
      ] as any,
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
    [xCategories, heatData, maxValue]
  );

  if (isLoading || isError || !data || data.length === 0)
    return (
      <StatusDisplay
        isLoading={isLoading}
        isError={isError}
        noData={!data || data.length === 0}
        height={"280px"}
      />
    );
  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default TimelineStatus;
