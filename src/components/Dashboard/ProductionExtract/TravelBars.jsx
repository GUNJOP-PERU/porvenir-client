import { useMemo, useRef } from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highcharts.src.js";

const TravelBars = ({ data, filterKeywords = [], colorPoint = "#7cb5ec" }) => {
  const chartRef = useRef(null);

  const filteredData = useMemo(() => {
    if (!filterKeywords.length) return data;
    return data.filter((item) =>
      filterKeywords.some((keyword) => item.origin?.includes(keyword))
    );
  }, [data, filterKeywords]);

  const grouped = useMemo(() => {
    return filteredData.reduce((acc, item) => {
      const origen = item.origin || "Sin origen";
      if (!acc[origen]) {
        acc[origen] = { viajes: 0, toneladas: 0 };
      }
      acc[origen].viajes += 1;
      acc[origen].toneladas += item.tonnage || 0;
      return acc;
    }, {});
  }, [filteredData]);

  const categories = Object.keys(grouped);
  const viajesData = categories.map((cat) => ({
    y: grouped[cat].viajes,
    toneladas: grouped[cat].toneladas,
  }));

  const options = useMemo(
    () => ({
      chart: {
        type: "bar",
        backgroundColor: "transparent",
        height: 280,
        marginBottom: 0,
      },
      title: { text: null },
      xAxis: {
        categories,
        lineColor: "transparent",
        reserveSpace: true,
        labels: {
          step: 1,
          reserveSpace: true,
          allowOverlap: true,
          style: {
            fontSize: "0.6em",
            fontWeight: "bold",
            color: "#A1A1AA",
            lineHeight: "1",
          },
        },
      },
      yAxis: {
        min: 0,
        title: { text: null },
        labels: {
          enabled: false,
        },
        gridLineColor: "#D9D9D9",
        gridLineWidth: 0.5,
        gridLineDashStyle: "Dash",
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

      tooltip: {
        backgroundColor: "#111214",
        borderWidth: 0,
        shadow: false,
        borderRadius: 10,
        padding: 10,
        style: { color: "#fff", fontSize: "0.65em" },
        formatter: function () {
          return `
          <b style="color:#eaeaea">${this.series.xAxis.categories[this.point.x]}</b><br/>
         <b style="color:#abd9e9">● ${this.point.toneladas.toLocaleString()} TM en ${this.y} viajes</b>
        `;
        },
      },
      series: [
        {
          name: "Viajes",
          data: viajesData,
          color: colorPoint,
        },
      ],
      legend: {
        enabled: false,
      },
      credits: { enabled: false },
      accessibility: { enabled: false },
    }),
    [categories, viajesData]
  );

  return (
    <HighchartsReact ref={chartRef} highcharts={Highcharts} options={options} />
  );
};

export default TravelBars;
