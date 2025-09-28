import Highcharts, { chart, color } from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { roundAndFormat } from "@/lib/utilsGeneral";
// Types
import type { BeaconCycle } from "@/types/Beacon";

interface LineAndBarChartByHourProps {
  title?: string;
  mineralWeight: number;
  chartColor?: string;
  chartData: BeaconCycle[];
  currentChart?: "trips" | "tonnage" | "totalHours" | "maintenanceHours";
}

const UnitTripChart = ({ title, chartData, mineralWeight, chartColor = "#000000", currentChart }: LineAndBarChartByHourProps) => {
  const data = chartData.sort((a, b) => a.unit.localeCompare(b.unit));
  const unitLabels = data.map(item => item.unit.toUpperCase());
  const tripsCounts = data.map(item => item.trips.length);
  const tonnageCounts = data.map(item => item.trips.length * mineralWeight);
  const unitTotalHours = data.map(item => Math.round(item.trips.reduce((acc, trip) => acc + parseFloat(trip.totalDuration), 0) / 3600));
  const maintenanceHours = data.map(item => Number((item.totalMaintanceTimeMin / 60).toFixed(2)));

  const options = {
    chart: {
      type: "bar",
      height: 650,
      // margin: [50, 20, 70, 20]
    },
    title: "",
    xAxis: [
      {
        title: "",
        categories: unitLabels,
        opposite: false,
        lineColor: "#000000",
        labels: {
          style: {
            color: "#000000",
            fontSize: "0.8em",
            fontWeight: "bold",
          },
        },
      },
      // {
      //   title: "",
      //   categories: plan.map((e) => `${roundAndFormat(e)} TM`),
      //   opposite: false,
      //   lineColor: "transparent",
      //   labels: {
      //     y: 0,
      //     style: {
      //       color: "#00000080",
      //       fontSize: "0.8em",
      //       fontWeight: "bold",
      //     },
      //   },
      // },
      // {
      //   title: "",
      //   categories: hourLabels,
      //   opposite: true,
      //   linkedTo: 0,
      //   lineColor: "#D9D9D9",
      //   labels: {
      //     style: {
      //       color: "#00000080",
      //       fontSize: "0.8em",
      //       fontWeight: "bold",
      //     },
      //   },
      // },
    ],
    yAxis: {
      title: "Viajes",
      visible: true,
      lineColor: "#000000",
    },
    plotOptions: {
      column: {
        stacking: "normal",
        pointPadding: 0,
        groupPadding: 0.05,
        borderWidth: 0,
        borderRadius: "20%",
        dataLabels: {
          enabled: true,
          inside: true,
          style: {
            fontSize: "0.7em",
            color: "#fff",
            fontWeight: "bold",
            textOutline: "none",
            lineHeight: "1",
          },
          backgroundColor: "#00000050",
          borderRadius: 3,
          padding: 2,
          borderWidth: 0,
        },
      },
    },
    series: [
      {
        name: "Viajes",
        data: tripsCounts,  
        color: "#2b88f1",
        visible: currentChart === "trips"
      },
      {
        name: "Tonelaje",
        data: tonnageCounts,
        color: "#2b88f1",
        visible: currentChart === "tonnage"
      },
      {
        name: "Duración Total (hrs)",
        data: unitTotalHours,
        color: "#2b88f1",
        visible: currentChart === "totalHours"
      },
      {
        name: "Mantenimiento (hrs)",
        data: maintenanceHours,
        color: "#2b88f1",
        visible: currentChart === "maintenanceHours"
      },
    ],
    tooltip: {
      shared: true,
      valueSuffix: "TM",
      backgroundColor: "#111214",
      borderWidth: 0,
      shadow: false,
      borderRadius: 10,
      padding: 12,
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
    <>
      <h3 className="font-bold text-center text-sm">{title}</h3>
        <HighchartsReact highcharts={Highcharts} options={options} />
    </>
  );
};

export default UnitTripChart;
