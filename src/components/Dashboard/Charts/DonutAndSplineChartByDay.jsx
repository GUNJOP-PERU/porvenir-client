import DonutChart from "./DonutChart"
import ProgressBar from "./ProgressBar"
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import PropTypes from 'prop-types';

const DonutAndSplineChartByDay = ({ title, donutData , progressBarData, chartData }) => {
  
  const sortDataByDay = (data) => {
    if (!data?.statsByDay) return {
      data: [],
      acumulativeData: []
    };
    const getCurrentWeekDates = () => {
      const currentDate = new Date();
      const currentDay = currentDate.getDay();
      const thursdayOffset = currentDay >= 4 ? currentDay - 4 : currentDay + 3;
      const thursday = new Date(currentDate);
      thursday.setDate(currentDate.getDate() - thursdayOffset);
      const weekDates = [];

      for (let i = 0; i < 7; i++) {
        const date = new Date(thursday);
        date.setDate(thursday.getDate() + i);
        weekDates.push(date.toISOString().split("T")[0]);
      }

      return weekDates;
    };
    const weekDates = getCurrentWeekDates();
    const dataMap = {};
    data.statsByDay.forEach((item) => {
      dataMap[item.date] = item.totalTrips;
    });

    const completedStatsByDays = weekDates.map((date) => dataMap[date] || "");

    const acumulativeData = completedStatsByDays.map((day, index) => {
      const sum = completedStatsByDays.slice(0, index + 1).reduce((acc, val) => acc + (val || 0), 0);
      return day ? sum : "";
    });

    return {
      data: completedStatsByDays,
      acumulativeData: acumulativeData
    };
  };

  const getCurrentWeekDates = () => {
    const currentDate = new Date();
    const currentDay = currentDate.getDay();
    
    const thursdayOffset = (currentDay >= 4) ? currentDay - 4 : currentDay + 3;
    const thursday = new Date(currentDate);
    thursday.setDate(currentDate.getDate() - thursdayOffset);

    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(thursday);
      date.setDate(thursday.getDate() + i);
      weekDates.push(date.toISOString().split('T')[0]);
    }

    return weekDates;
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
          categories: sortDataByDay(chartData).acumulativeData,
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
          categories: [1.8, 4.0, 6.8, 9.4, 11.2],
          tickPositioner: function () { return [0, 1, 2, 3, 4, 5, 6]; },
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
          categories: getCurrentWeekDates(),
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
          data: sortDataByDay(chartData).acumulativeData,
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
          data: [1.8, 4.0, 6.8, 9.4, 11.2, "",""],
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

DonutAndSplineChartByDay.propTypes = {
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
    statsByDays: PropTypes.arrayOf(PropTypes.shape({
      day: PropTypes.string.isRequired,
      totalTrips: PropTypes.number.isRequired,
    })),
  }),
}

export default DonutAndSplineChartByDay