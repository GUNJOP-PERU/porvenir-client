import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
// Types
import type { BeaconCycle } from "@/types/Beacon";

interface UnitTripChartProps {
  mineralWeight: number;
  chartData: BeaconCycle[];
  currentChart?: "trips" | "tonnage" | "totalHours" | "maintenanceHours";
}

const UnitTripChart = ({
  chartData,
  mineralWeight,
  currentChart,
}: UnitTripChartProps) => {
  const data = chartData.sort((a, b) => a.unit.localeCompare(b.unit));
  const unitLabels = data.map((item) => item.unit.toUpperCase());
  const tripsCounts = data.map((item) => item.trips.length);
  const tonnageCounts = data.map((item) => item.trips.length * mineralWeight);
  const unitTotalHours = data.map((item) =>
    Math.round(
      item.trips.reduce(
        (acc, trip) => acc + parseFloat(trip.totalDuration),
        0
      ) / 3600
    )
  );
  const maintenanceHours = data.map((item) =>
    Number((item.totalMaintanceTimeMin / 60).toFixed(2))
  );

  const options = {
    chart: {
      type: "bar",
      height: 650,
      marginBottom: 0,
    },
    title: "",
    xAxis: [
      {
        title: "",
        categories: unitLabels,
        opposite: false,
        lineColor: "transparent",
        labels: {
          step: 1,
          reserveSpace: true,
          allowOverlap: true,
          style: {
            fontSize: "0.7em",
            fontWeight: "bold",
            color: "#A1A1AA",
            lineHeight: "1",
          },
        },
      },
    ],
    yAxis: {
      title: "Viajes",
      visible: true,
      gridLineColor: "#D9D9D9",
      gridLineWidth: 0.5,
      gridLineDashStyle: "Dash",
      labels: {
        enabled: false,
      },
    },
    plotOptions: {
      series: {
        borderRadius: "20%",
        valueSuffix: " viajes",
        pointPadding: 0,
        groupPadding: 0.1,
        borderWidth: 0,
        dataLabels: {
          enabled: true,
          inside: false,
          crop: false,
          overflow: "allow",
          allowOverlap: true,
          style: {
            fontSize: "0.7em",
            color: "#000",
            fontWeight: "bold",
            textOutline: "none",
            lineHeight: "1",
          },
          formatter: function () {
            return this.y === 0 ? null : this.y;
          },
        },
      },
    },
    series: [
      {
        name: "Viajes",
        data: tripsCounts,
        color: "#00a6fb",
        visible: currentChart === "trips",
      },
      {
        name: "Tonelaje",
        data: tonnageCounts,
        color: "#02c39a",
        visible: currentChart === "tonnage",
      },
      {
        name: "Duración Total (hrs)",
        data: unitTotalHours,
        color: "#d4a373",
        visible: currentChart === "totalHours",
      },
      {
        name: "Mantenimiento (hrs)",
        data: maintenanceHours,
        color: "#f79d65",
        visible: currentChart === "maintenanceHours",
      },
    ],
    tooltip: {
      shared: true,
      valueSuffix: "TM",
      backgroundColor: "#111214",
      borderWidth: 0,
      shadow: false,
      borderRadius: 10,
      padding: 10,
      style: {
        color: "#FFFFFF",
        fontSize: "0.65em",
        zIndex: 10,
      },
      formatter: function () {
        const categoryName =
          this.points[0].point.category || hourLabels[this.x];
        let tooltipText = `<b>${categoryName}</b><br/>`;
        this.points.forEach(function (point: any) {
          tooltipText += `<span style="color:${point.color}">●</span> ${point.series.name}: <b>${point.y}</b><br/>`;
        });
        return tooltipText;
      },
    },
    legend: {
      align: "right",
      enabled: false,
      verticalAlign: "top",
      layout: "horizontal",
      floating: false,
      itemStyle: {
        color: "#A6A6A6",
        fontSize: "0.55em",
        fontWeight: "600",
        textTransform: "uppercase",
      },
      itemHoverStyle: { color: "black" },
      symbolWidth: 10,
      symbolHeight: 9,
      symbolRadius: 2,
      itemMarginTop: 0,
      itemMarginBottom: 0,
    },
    credits: {
      enabled: false,
    },
  };

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
      updateArgs={[true, true, true]}
    />
  );
};

export default UnitTripChart;