import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { roundAndFormat } from "@/lib/utilsGeneral";
// Types
import type { BeaconUnitTrip } from "@/types/Beacon";

interface LineAndBarChartByHourProps {
  title?: string;
  mineralWeight: number;
  chartColor?: string;
  chartData: {
    hour: string,
    trips: BeaconUnitTrip[]
  }[];
}

const LineAndBarChartByHour = ({ title, chartData, mineralWeight, chartColor = "#000000" }: LineAndBarChartByHourProps) => {
  const hourLabels = chartData.map(item => item.hour);
  const tripsCounts = chartData.map(item => item.trips.length * mineralWeight);

  const plan = new Array(12).fill(100);
  const diff = plan.map((exp, i) => {
    const currentData = tripsCounts;
    const value =
      typeof currentData[i] === "number" ? (currentData[i] as number) : 0;
    const e = Math.abs(exp - value);
    return +e;
  });

  const diffColor = plan.map((exp, i) => {
    const currentData = tripsCounts;
    return currentData[i] !== undefined && currentData[i] >= exp
      ? "#04c286"
      : "#fe7887";
  });


  const options = {
    chart: {
      type: "column",
      height: 280,
      // margin: [50, 20, 70, 20]
    },
    title: "",
    xAxis: [
      {
        title: "",
        categories: tripsCounts.map(value => `${roundAndFormat(value)} TM`),
        opposite: false,
        lineColor: "transparent",
        labels: {
          style: {
            color: "#000000",
            fontSize: "0.8em",
            fontWeight: "bold",
          },
        },
      },
      {
        title: "",
        categories: plan.map((e) => `${roundAndFormat(e)} TM`),
        opposite: false,
        lineColor: "transparent",
        labels: {
          y: 0,
          style: {
            color: "#00000080",
            fontSize: "0.8em",
            fontWeight: "bold",
          },
        },
      },
      {
        title: "",
        categories: hourLabels,
        opposite: true,
        linkedTo: 0,
        lineColor: "#D9D9D9",
        labels: {
          style: {
            color: "#00000080",
            fontSize: "0.8em",
            fontWeight: "bold",
          },
        },
      },
    ],
    yAxis: {
      title: "",
      visible: false,
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
        name: "Faltante",
        data: diff,
        colorByPoint: true,
        colors: diffColor,
        xAxis: 1,
        dataLabels: {
          enabled: true,
          formatter: function () {
            return `${roundAndFormat(diff[this.point.index])}`;
          },
        },
      },
      {
        name: "Extraído",
        data: tripsCounts,  
        color: chartColor,
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
          tooltipText += `<span style="color:${point.color}">●</span> ${point.series.name}: <b>${point.y} TM</b><br/>`;
        });
        return tooltipText;
      },
    },
    legend: {
      align: "right",
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

export default LineAndBarChartByHour;
