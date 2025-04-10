import DonutChart from "./DonutChart"
import ProgressBar from "./ProgressBar"
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import PropTypes from 'prop-types';

const DonutAndSplineChart = ({ title, donutData , progressBarData }) => {
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
          categories: ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"],
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
          data: [0.6, 1.8, 8.8, 9.4, 12.8, 13.2, "",""],
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
          data: [1.8, 4.0, 6.8, 9.4, 11.2, 13.6, 16.4, 18.2],
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
}

export default DonutAndSplineChart