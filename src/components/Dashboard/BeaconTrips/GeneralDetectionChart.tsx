import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useMemo } from "react";
// Types
import type { BeaconDetection } from "@/types/Beacon";

interface GeneralDetectionChartPops {
  data: BeaconDetection[];
  filterValue: string;
  chartTitle?: string;
  chartColor?: string;
}

const GeneralDetectionChart = ({
  data,
  filterValue = "bocamina",
  chartTitle = "",
  chartColor = "#42A3B1",
}: GeneralDetectionChartPops) => {
  const chartData = useMemo(() => {
    const bocaminaData = data.filter(
      (beaconDetection) => beaconDetection.ubicationType === filterValue
    );
    const bocaminaCount = bocaminaData.reduce((acc, curr) => {
      acc[curr.ubication] = (acc[curr.ubication] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return {
      labels: Object.keys(bocaminaCount),
      values: Object.values(bocaminaCount),
    };
  }, [data]);

  const options = useMemo(
    () => ({
      chart: {
        backgroundColor: "transparent",
        height: 300,
        marginTop: 40,
        marginBottom: 40,
      },
      title: {
        text: null,
        align: "center",
        style: { fontSize: "14px", fontWeight: "bold" },
      },
      xAxis: {
        categories: chartData.labels,
        lineColor: "transparent",
        crosshair: true,
        tickWidth: 0,
        tickLength: 0,
        labels: {
          style: {
            fontSize: "0.65rem",
            fontWeight: "600",
            color: "#A1A1AA",
            fontFamily: "Nunito, sans-serif",
            lineHeight: "10",
          },
        },
      },
      yAxis: [
        {
          title: { text: null },
          labels: {
            enabled: false,
          },
          gridLineColor: "#D9D9D9",
          gridLineWidth: 0.5,
          gridLineDashStyle: "Dash",
        },
        {
          title: { text: null },
          labels: {
            enabled: false,
          },
          opposite: true,
          gridLineColor: "#D9D9D9",
          gridLineWidth: 0.5,
          gridLineDashStyle: "Dash",
        },
      ],
      tooltip: {
        backgroundColor: "#111214",
        borderWidth: 0,
        shadow: false,
        borderRadius: 10,
        padding: 10,
        style: { color: "#FFFFFF", fontSize: "0.65em" },
        shared: true,
      },
      plotOptions: {
        column: {
          borderRadius: "15%",
          pointPadding: 0.02,
          groupPadding: 0.02,
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            inside: true,
            verticalAlign: "middle",
            style: { fontSize: "0.6rem", color: "#000", textOutline: "none" },
            formatter: function () {
              return this.y == 0 ? "" : this.y;
            },
          },
        },
      },
      series: [
        {
          type: "column",
          name: chartTitle,
          data: chartData.values,
          color: chartColor,
          yAxis: 0,
        },
      ],
      legend: {
        align: "right",
        verticalAlign: "top",
        layout: "horizontal",
        itemStyle: {
          color: "#A6A6A6",
          fontSize: "9px",
          fontWeight: "bold",
          textTransform: "uppercase",
        },
        itemHoverStyle: { color: "#1EE0EE" },
        symbolWidth: 10,
        symbolHeight: 9,
        symbolRadius: 2,
        itemMarginTop: 0,
        itemMarginBottom: 0,
      },
      credits: { enabled: false },
      exporting: { enabled: false },
      accessibility: { enabled: false },
    }),
    [chartData]
  );

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default GeneralDetectionChart;
