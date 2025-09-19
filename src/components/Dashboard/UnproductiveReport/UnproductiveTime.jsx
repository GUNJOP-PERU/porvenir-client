import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useMemo } from "react";
import dayjs from "dayjs";
import { formatShortDay, roundAndFormat } from "@/lib/utilsGeneral";
import { StatusDisplay } from "../StatusDisplay";

export default function UnproductiveTime({
  data,
  selectedRange,
  isLoading,
  isError,
}) {
  const { dates, series } = useMemo(() => {
    if (!data || data.length === 0 || !selectedRange) {
      return {
        dates: [],
        series: [
          { type: "column", name: "T_IMPRODUCTIVO", data: [], total: 0 },
          { type: "spline", name: "%_IMPRODUCTIVO", data: [], total: 0 },
        ],
      };
    }
  
    const start = dayjs(selectedRange.startDate);
    const end = dayjs(selectedRange.endDate);
  
    const allDates = [];
    for (
      let d = start.clone();
      d.isBefore(end) || d.isSame(end, "day");
      d = d.add(1, "day")
    ) {
      allDates.push(d.format("YYYY-MM-DD"));
    }
  
    const grouped = data.reduce((acc, curr) => {
      const date = curr.dateStr || curr.date?.substring(0, 10) || "Sin Fecha";
      if (!acc[date]) acc[date] = { sum: 0, total: 0 };
      acc[date].sum += curr.duration ?? 0;
      acc[date].total += 1;
      return acc;
    }, {});
  
    const t_improductivo = allDates.map((date) => grouped[date]?.sum ?? 0);
    const totalHoras = t_improductivo.reduce((a, b) => a + b, 0);
    const perc_improductivo = allDates.map((date) =>
      totalHoras > 0 ? ((grouped[date]?.sum ?? 0) / totalHoras) * 100 : 0
    );
  
    const displayDates = allDates.map(formatShortDay);
    
    return {
      dates: displayDates,
      series: [
        {
          type: "column",
          name: "T_IMPRODUCTIVO",
          data: t_improductivo,
          color: "#0FC47A",
          total: totalHoras, // total listo aquí
          yAxis: 0,
        },
        {
          type: "spline",
          name: "%_IMPRODUCTIVO",
          data: perc_improductivo,
          color: "#FCB03C",
          total: perc_improductivo.reduce((a, b) => a + b, 0), // total %
          yAxis: 1,
        },
      ],
    };
  }, [data, selectedRange]);
  

  const options = useMemo(
    () => ({
      chart: {
        type: "column",
        backgroundColor: "transparent",
        height: 330,
        marginTop: 40,
        marginBottom: 40,
      },
      title: { text: null },
      xAxis: {
        categories: dates,
        lineColor: "transparent",
        tickWidth: 0,
        tickLength: 0,
        labels: {
          style: {
            fontSize: "0.6rem",
            fontWeight: "600",
            color: "#A1A1AA",
          },
        },
      },
      yAxis: [
        {
          title: { text: null },
          labels: { enabled: false },
          gridLineColor: "#D9D9D9",
          gridLineWidth: 0.5,
          gridLineDashStyle: "Dash",
        },
        {
          title: { text: null },
          labels: { enabled: false },
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
        formatter: function () {
          const category =
            this.series.chart.xAxis[0].categories[this.point.x] || this.x;
          let tooltipText = `<b>${category}</b><br/>`;
          this.points.forEach((point) => {
            tooltipText += `<span style="color:${point.color}">●</span> <b>${
              point.series.name
            }</b>: ${
              point.series.name.includes("%")
                ? point.y.toFixed(1) + "%"
                : point.y.toFixed(1) + " hr"
            }<br/>`;
          });
          return tooltipText;
        },
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
              return this.y == 0 ? "" : roundAndFormat(this.y);
            },
          },
        },
        spline: {
          marker: { enabled: true, radius: 4, symbol: "circle" },
          dataLabels: {
            enabled: true,
            allowOverlap: true,
            style: {
              fontSize: "0.6rem",
              color: "#4070EB",
              fontWeight: "600",
              textOutline: "none",
            },
            formatter: function () {
              return `${this.y.toFixed(2)}%`;
            },
            backgroundColor: "#eaeaea80",
            borderRadius: 3,
            padding: 3,
          },
        },
      },
      series,
      legend: {
        align: "left",
        verticalAlign: "top",
        layout: "horizontal",
        floating: false,
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
        labelFormatter: function () {
          return `<b style="color:#000">${roundAndFormat(this.options.total)}</b> | ${this.name}`; 
        },
      },
      credits: { enabled: false },
      accessibility: { enabled: false },
    }),
    [dates, series]
  );

  if (isLoading || isError || !data || data.length === 0)
    return (
      <StatusDisplay
        isLoading={isLoading}
        isError={isError}
        noData={!data || data.length === 0}
        height={280}
      />
    );
  return <HighchartsReact highcharts={Highcharts} options={options} />;
}
