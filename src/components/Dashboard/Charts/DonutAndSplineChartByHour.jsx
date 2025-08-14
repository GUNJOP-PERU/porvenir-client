import DonutChart from "./DonutChart"
import ProgressBar from "./ProgressBar"
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import PropTypes from 'prop-types';

const DonutAndSplineChart = ({ title, donutData , progressBarData, chartData }) => {
  const getHoursByShift = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const isDayShift = currentHour >= 6 && currentHour < 18;
    
    if (isDayShift) {
      const dayShift = [];
      for (let hour = 6; hour < 18; hour++) {
        const hourString = hour.toString().padStart(2, '0') + ':00';
        dayShift.push(hourString);
      }
      return dayShift;
    } else {
      const nightShift = [];
      for (let hour = 18; hour < 24; hour++) {
        const hourString = hour.toString().padStart(2, '0') + ':00';
        nightShift.push(hourString);
      }
      for (let hour = 0; hour < 6; hour++) {
        const hourString = hour.toString().padStart(2, '0') + ':00';
        nightShift.push(hourString);
      }
      return nightShift;
    }
  };

  const sortDataByHour = (data) => {
    if (!data?.statsByHour) return data;
    const sortedStatsByHour = [...data.statsByHour].sort((a, b) => {
      const hourA = parseInt(a.hour.split(':')[0]);
      const hourB = parseInt(b.hour.split(':')[0]);
      return hourA - hourB;
    });

    const dataMap = {};
    sortedStatsByHour.forEach((item) => {
      dataMap[item.hour] = item.totalTrips;
    });

    const completedStatsByHours = getHoursByShift().map((e) => e.split(":")[0]).map((hour) => dataMap[hour] || "");

    const acumulativeData = completedStatsByHours.map((e,i) => {
      const sum = completedStatsByHours.slice(0, i + 1).reduce((acc, val) => acc + (val || 0), 0);
      return e ? sum : "";
    });

    const completedStatsByHour = [];

    for (let i = 0; i < 12; i++) {
      if (i < acumulativeData.length) {
        completedStatsByHour.push(acumulativeData[i]);
      } else {
        completedStatsByHour.push("");
      }
    }
    return completedStatsByHour;
  };

  const options = {
    chart: {
        type: "areaspline",
        height: 250
    },
    title: "",
    xAxis: [
        {
          title: "",
          categories: sortDataByHour(chartData).map((e) => e ? `${e*36} TM`:""),
          opposite: false,
          labels: {
            style: {
                color: '#000000',
                fontSize: '14px',
                fontWeight: 'bold'
            }
          }
        },
        {
          title: "",
          categories: new Array(12).fill(770).map((e,i) => `${e * (i+1)} TM`),
          opposite: false,
          lineColor: 'transparent',
          labels: {
            y: 0,
            style: {
              color: '#9696ab',
              fontSize: '14px',
              fontWeight: 'bold'
            }
          }
        },
        {
          title: "",
          categories: getHoursByShift(),
          opposite: true,
          linkedTo:1,
          labels: {
            style: {
              color: '#9696ab',
              fontSize: '14px',
              fontWeight: 'bold'
            }
          }
        }
    ],
    yAxis: {
      title: "",
      opposite: true,
      labels: {
        style: {
          color: '#9696ab',
          fontSize: '14px',
          fontWeight: 'bold'
        }
      }
    },
    series: [
      {
          name: "Fact",
          data: sortDataByHour(chartData).map(e => e ? e * 36 : ""),
          color: "#000000",
          xAxis: 0,
          fillColor: "#bfefe1",
          marker: {
            fillColor: 'white',
            lineWidth: 2,
            lineColor: '#000000'
          }
      },
      {
          name: "Plan",
          data: new Array(12).fill(770).map((e,i) => e * (i+1)),
          color: "#9696ab",
          xAxis: 1,
          fillColor: "#ffd0d63d",
          marker: {
            fillColor: 'white',
            lineWidth: 2,
            lineColor: '#9696ab'
          }
      },
    ],
    legend: {
      layout: "vertical",
      align: "left",
      verticalAlign: "bottom",
      x: 0,
      y: 0
    },
    credits: {
        enabled: false
    }
};

  return (
    <div className="flex flex-col gap-0">
      <h3 className="font-bold text-center">
        {title}
      </h3>
      <div className="flex flex-row items-center">
        <DonutChart
          donutData={donutData}
          size="small"
        />
        <ProgressBar
          progressBarData= {progressBarData}
        />
      </div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  )
}

DonutAndSplineChart.propTypes = {
  title: PropTypes.string,
  donutData: PropTypes.shape({
    total: PropTypes.number.isRequired,
    currentValue: PropTypes.number.isRequired,
    currentValueColor: PropTypes.string.isRequired,
  }),
  progressBarData: PropTypes.shape({
    total: PropTypes.number.isRequired,
    currentValue: PropTypes.number.isRequired,
    prediction: PropTypes.number.isRequired,
    currentValueColor: PropTypes.string.isRequired,
    showDifference: PropTypes.bool.isRequired,
    forecastText: PropTypes.string.isRequired,
  }),
  chartData: PropTypes.shape({
    totalTrips: PropTypes.number.isRequired,
    hourRangesWithTrips: PropTypes.number.isRequired,
    statsByHour: PropTypes.arrayOf(PropTypes.shape({
      hour: PropTypes.string.isRequired,
      totalTrips: PropTypes.number.isRequired,
    })),
  }),
}

export default DonutAndSplineChart