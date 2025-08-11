import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import PropTypes from 'prop-types'

const ColumnChart = ({ data, title }) => {
  const chartData = Object.entries(data).map(([name, value]) => ({
    name,
    y: value
  }));

  const options = {
    chart: {
      type: 'column',
      height: 400,
      backgroundColor: 'transparent'
    },
    title: {
      text: title,
      style: {
        fontSize: '16px',
        fontWeight: 'bold'
      }
    },
    xAxis: {
      type: 'category',
      labels: {
        rotation: -45,
        style: {
          fontSize: '11px'
        }
      }
    },
    yAxis: {
      title: {
        text: 'Cantidad de Viajes'
      }
    },
    legend: {
      enabled: false
    },
    credits: {
      enabled: false
    },
    plotOptions: {
      column: {
        dataLabels: {
          enabled: true,
          format: '{y}'
        },
        colorByPoint: true
      }
    },
    series: [{
      name: 'Viajes',
      data: chartData
    }],
    colors: [
      '#3b82f6', '#ef4444', '#10b981', '#f59e0b', 
      '#8b5cf6', '#06b6d4', '#ec4899', '#84cc16'
    ]
  };

  return (
    <div className="w-full h-full">
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
      />
    </div>
  )
}

ColumnChart.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.shape({
    totalTrips: PropTypes.number.isRequired,
    hourRangesWithTrips: PropTypes.number.isRequired,
    tripsByDestination: PropTypes.objectOf(PropTypes.number).isRequired,
    tripsByFrontLabors: PropTypes.objectOf(PropTypes.number).isRequired,
    tripsByUnit: PropTypes.arrayOf(PropTypes.shape({
      unit: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired,
      firstMineEntrance: PropTypes.shape({
        name: PropTypes.string.isRequired,
        durationMin: PropTypes.number.isRequired,
        start: PropTypes.string.isRequired,
        end: PropTypes.string.isRequired,
      }).isRequired,
    })).isRequired,
  }),
}

export default ColumnChart;