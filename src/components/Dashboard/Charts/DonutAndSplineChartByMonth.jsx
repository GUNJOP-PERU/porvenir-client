import DonutChart from "./DonutChart"
import ProgressBar from "./ProgressBar"
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const DonutAndSplineChart = ({ title, donutData , progressBarData, chartData }) => {
  const getMonthsOfYear = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const months = [];

    for (let month = 0; month < 12; month++) {
      const monthString = (month + 1).toString().padStart(2, '0');
      months.push(`${currentYear}-${monthString}`);
    }
    return {
      months: months,
      fullMonths: months.map(month => {
        const [year, monthNumber] = month.split('-');
        const date = new Date(parseInt(year), parseInt(monthNumber) - 1, 1);
        const monthName = format(date, 'MMMM', { locale: es });
        return monthName.charAt(0).toUpperCase() + monthName.slice(1);
      })
    };
  };

  const sortDataByMonth = (data) => {
    if (!data?.statsByMonth) return data;
    const sortedStatsByMonth = [...data.statsByMonth].sort((a, b) => {
      const monthA = parseInt(a.month.split('-')[1]);
      const monthB = parseInt(b.month.split('-')[1]);
      return monthA - monthB;
    });

    const dataMap = {};
    sortedStatsByMonth.forEach((item) => {
      dataMap[item.monthKey] = item.totalTrips;
    });

    const completedStatsByMonths = getMonthsOfYear().months.map((month) => dataMap[month] || "");

    const acumulativeData = completedStatsByMonths.map((e,i) => {
      const sum = completedStatsByMonths.slice(0, i + 1).reduce((acc, val) => acc + (val || 0), 0);
      return e ? sum : "";
    });
    return acumulativeData.map((e) => e ? Number((e*36 / 1000).toFixed(2)) : "");
  };

  const plan = new Array(12).fill(554205).map((e) => Number((e / 1000).toFixed(2)));

  const options = {
    chart: {
        type: "areaspline",
        height: 250
    },
    title: "",
    xAxis: [
        {
          title: "",
          categories: sortDataByMonth(chartData).map((e) => e ? `${e} kTM`:""),
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
          categories: plan.map((e,i) => `${(e * (i+1)).toFixed(2)} kTM`),
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
          categories: getMonthsOfYear().fullMonths,
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
          data: sortDataByMonth(chartData),
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
          data: plan.map((e,i) => Number((e * (i+1)).toFixed(2))),
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
          unit="kTM"
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
    statsByMonth: PropTypes.arrayOf(PropTypes.shape({
      month: PropTypes.string.isRequired,
      monthKey: PropTypes.string.isRequired,
      totalTrips: PropTypes.number.isRequired,
    })),
  }),
}

export default DonutAndSplineChart