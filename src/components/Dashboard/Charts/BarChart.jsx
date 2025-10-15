import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import PropTypes from "prop-types";

const BarChart = ({ data, title }) => {
  const chartData = Object.entries(data).map(([name, value]) => ({
    name,
    y: value,
  }));

  const options = {
    chart: {
      type: "column",
      height: 260,
      backgroundColor: "transparent",
    },
    title: {
      text: title,
      style: {
        fontSize: "14px",
        fontWeight: "bold",
      },
    },
    xAxis: {
      type: "category",
      lineColor: "transparent",
      crosshair: true,
        tickWidth: 0,
        tickLength: 0,
        labels: {
          style: {
            color: "#A1A1AA",
            fontSize: "0.65em",
            fontWeight: "700",
          },
        },
    },
    yAxis: {
      title: {
        text: null,
      },
      labels: {
        enabled: false,
      },
      gridLineColor: "#D9D9D9",
      gridLineWidth: 0.5,
      gridLineDashStyle: "Dash",
    },
    legend: {
      enabled: false,
    },
    credits: {
      enabled: false,
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
            color: "#000",
            fontWeight: "bold",
            textOutline: "none",
          },
          backgroundColor: "rgba(255, 255, 255, 0.5)",
          borderRadius: 3,
          padding: 3,
          borderWidth: 0,
        },
        colorByPoint: true,
      },
    },
    series: [
      {
        name: "Viajes",
        data: chartData,
      },
    ],
    colors: [
      "#3b82f6",
      "#ef4444",
      "#10b981",
      "#f59e0b",
      "#8b5cf6",
      "#06b6d4",
      "#ec4899",
      "#84cc16",
    ],
  };

  return (
    <div className="w-full h-full border border-[#F0F0F0] shadow-sm rounded-2xl px-4 py-2">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

BarChart.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.shape({
    totalTrips: PropTypes.number.isRequired,
    hourRangesWithTrips: PropTypes.number.isRequired,
    tripsByDestination: PropTypes.objectOf(PropTypes.number).isRequired,
    tripsByFrontLabors: PropTypes.objectOf(PropTypes.number).isRequired,
    tripsByUnit: PropTypes.arrayOf(
      PropTypes.shape({
        unit: PropTypes.string.isRequired,
        count: PropTypes.number.isRequired,
        firstMineEntrance: PropTypes.shape({
          name: PropTypes.string.isRequired,
          durationMin: PropTypes.number.isRequired,
          start: PropTypes.string.isRequired,
          end: PropTypes.string.isRequired,
        }).isRequired,
      })
    ).isRequired,
  }),
};

export default BarChart;
