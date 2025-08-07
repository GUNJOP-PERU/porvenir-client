import DonutChart from "./DonutChart"
import ProgressBar from "./ProgressBar"
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import PropTypes from 'prop-types';

const DonutAndSplineChart = ({ title, donutData , progressBarData, chartData }) => {
  console.log("chartData", chartData);
  const sortDataByHour = (data) => {
    if (!data?.statsByHour) return data;
    const sortedStatsByHour = [...data.statsByHour].sort((a, b) => {
      const hourA = parseInt(a.hour.split(':')[0]);
      const hourB = parseInt(b.hour.split(':')[0]);
      return hourA - hourB;
    });

    console.log("sorted1", sortedStatsByHour);

    const acumulativeData = sortedStatsByHour.map((e,i) => e.totalTrips + (sortedStatsByHour[i-1] || 0));

    const completedStatsByHour = [];

    for (let i = 0; i < 12; i++) {
      if (i < acumulativeData.length) {
        completedStatsByHour.push(acumulativeData[i]);
      } else {
        completedStatsByHour.push(null);
      }
    }
    return completedStatsByHour;
  };

  console.log("sorted",sortDataByHour(chartData));

  const getHoursByShift = () => {
    const dayShift = [];
    const nightShift = [];
      for (let hour = 6; hour < 18; hour++) {
      const hourString = hour.toString().padStart(2, '0') + ':00';
      dayShift.push(hourString);
    }
    
    for (let hour = 18; hour < 24; hour++) {
      const hourString = hour.toString().padStart(2, '0') + ':00';
      nightShift.push(hourString);
    }
    for (let hour = 0; hour < 6; hour++) {
      const hourString = hour.toString().padStart(2, '0') + ':00';
      nightShift.push(hourString);
    }
    
    return {
      day: dayShift,
      night: nightShift
    };
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
          categories: [0.6, 1.8, 8.8, 9.4, 12.8, 13.2],
          tickPositioner: function () { return [0, 1, 2, 3, 4, 5]; },
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
          categories: [1.8, 4.0, 6.8, 9.4, 11.2, 13.6, 16.4, 18.2],
          tickPositioner: function () { return [0, 1, 2, 3, 4, 5, 6, 7]; },
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
          categories: getHoursByShift().night,
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
          data: sortDataByHour(chartData),
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
          data: [1.8, 4.0, 6.8, 9.4, 11.2, 13.6, 16.4, 18.2, "","","",""],
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