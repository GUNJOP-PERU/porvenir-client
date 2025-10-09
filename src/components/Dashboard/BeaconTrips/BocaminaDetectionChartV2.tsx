import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useMemo } from "react";

interface BocaminaDetectionChart {
  data : Record<string, number>
}

const  BocaminaDetectionChart = ({ data } : BocaminaDetectionChart) => {
  const chartData = useMemo(() => {
    return {
      labels: Object.keys(data),
      values: Object.values(data)
    }
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
        // formatter: function () {
        //   const category =
        //     this.series.chart.xAxis[0].categories[this.point.x] || this.x;
        //   let tooltipText = `<b>${category}</b><br/>`;
        //   this.points.forEach((point) => {
        //     tooltipText += `<span style="color:${point.color}">●</span> <b>${
        //       point.series.name
        //     }</b>: ${roundAndFormat(point.y)}${
        //       point.series.name.includes("Improd/Viaje") ? " min" : " hr"
        //     }<br/>`;
        //   });
        //   return tooltipText;
        // },
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
            formatter: function (this : any) {
              return this.y == 0 ? "" : this.y;
            },
          },
        }
      },
      series: [
        {
          type: "column",
          name: "Detección de Bocamina",
          data: chartData.values,
          color: "#42A3B1",
          yAxis: 0,
        }
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

  return (
    <div className=" ">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}

export default BocaminaDetectionChart;