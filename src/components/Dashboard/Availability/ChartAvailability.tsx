import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { StatusDisplay } from "../StatusDisplay";

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

const ChartAvailability = ({ data, isLoading, isError }: HeatmapProps) => {
  const chartData = data.map((item) => ({
    name: item.hours,
    y: item.disponibilidad,
  }));

  const options = {
    chart: {
      type: "column",
      height: 430,
      backgroundColor: "transparent",
    },
    title: {
      text: "",
      style: { fontSize: "14px", fontWeight: "bold" },
    },
    xAxis: {
      categories: data.map((item) => item.hours),
      title: { text: "" },
      labels: {
        style: {
          color: "#A1A1AA",
          fontSize: "0.8rem",
          fontWeight: "bold",
        },
      },
      lineColor: "transparent",
      crosshair: true,
      tickWidth: 0,
      tickLength: 0,
    },
    yAxis: {
      title: { text: null },
      labels: { enabled: false },
      gridLineColor: "#D9D9D9",
      gridLineWidth: 0.5,
      gridLineDashStyle: "Dash",
    },

    plotOptions: {
      column: {
        stacking: "normal",
        borderRadius: "15%",
        pointPadding: 0.05,
        groupPadding: 0.05,
        borderWidth: 0,
        dataLabels: {
          enabled: true,
          style: {
            fontSize: "0.75em",
            color: "#ffffff",
            fontWeight: "bold",
            textOutline: "none",
          },
          backgroundColor: "#00000050",
          borderRadius: 3,
          padding: 3,
          formatter: function (this: any) {
            return this.y != 0 ? this.y + "%" : null;
          },
        },
      },
    },
    series: [
      {
        type: "column",
        name: "Disponibilidad",
        data: chartData,
        color: "#ff5000",
        dataLabels: {
          style: {
            fontSize: "1rem",
            color: "#ffffff",
            fontWeight: "bold",
            textOutline: "none",
          },
        },
      },
      {
        type: "spline",
        name: "Operativo",
        data: chartData,
        color: "#f9c83e",
      },
    ],
    tooltip: {
      shared: true,
      valueSuffix: "%",
      backgroundColor: "#111214",
      borderWidth: 0,
      shadow: false,
      borderRadius: 10,
      padding: 15,
      style: {
        color: "#FFFFFF",
        fontSize: "0.65em",
      },
    },
    legend: { enabled: false },
    credits: {
      enabled: false,
    },
    exporting: {
      enabled: false,
    },
    accessibility: {
      enabled: false,
    },
  };

  if (isLoading || isError || !data || data.length === 0)
    return (
      <StatusDisplay
        isLoading={isLoading}
        isError={isError}
        noData={!data || data.length === 0}
        height={"430px"}
      />
    );

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default ChartAvailability;
