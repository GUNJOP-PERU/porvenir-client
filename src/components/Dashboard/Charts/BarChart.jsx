import { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import PropTypes from 'prop-types'

const ColumnChart = ({ data, title }) => {
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    console.log("boolean",data,Array.isArray(data))
    if(Array.isArray(data)) {
    const groupedData = data?.filter(item => item.ubicationType === "destino").reduce((groups, item) => {
      const destination = item.ubication;
      if (!groups[destination]) {
        groups[destination] = {
          trips: [],
        };
      }
      groups[destination].trips.push(item);
      return groups;
    }, {});
    setChartData(Object.entries(groupedData).map(([name, value]) => ({
      name,
      y: value.trips.length
    })));
    } else {
      setChartData(Object.entries(data).map(([name, value]) => ({
        name,
        y: value
      })));
    }
  }, [data])


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
  data: PropTypes.arrayOf(PropTypes.shape({
    tag: PropTypes.string.isRequired,
    ubication: PropTypes.string.isRequired,
    ubicationType: PropTypes.string.isRequired,
    duration: PropTypes.number.isRequired,
    durationMin: PropTypes.string.isRequired,
    tsStart: PropTypes.number.isRequired,
    tsEnd: PropTypes.number.isRequired,
    tsStartDate: PropTypes.string.isRequired,
    tsEndDate: PropTypes.string.isRequired
  })).isRequired,
}

export default ColumnChart;