import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import PropTypes from 'prop-types'

const LineAndBarChart = ({ title }) => {
  const plan = [5, 6.7, 6.7, 6.7, 6.7, 6.7, 6.7, 5];
  const fact = [3.4, 5.5, 7.1, 6.7, 7.7, 7.3, 0, 0]; 
  const diff = plan.map((exp, i) => {
    const e = Math.abs(exp - fact[i]);
    return +e.toFixed(1);
  });

  const diffColor = plan.map((exp, i) =>
    fact[i] >= exp ? "#04c286" : "#fe7887"
  );

  const averageData = (array) => {
    if (array.length === 0) {
      return 0;
    }
    const suma = array.reduce((acumulador, valor) => acumulador + valor, 0);
    return suma / array.length;
  }

  const options = {
    chart: {
      type: "column",
      height: 180,
    },
    title: "",
    xAxis: [
      {
        categories: ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"],
        opposite: true,
        lineColor: 'transparent',
        labels: {
          style: {
            color: '#9696ab',
            fontSize: '14px',
            fontWeight: 'bold'
          }
        },
      },
      {
        categories: [3.4, 5.5, 7.1, 6.7, 7.7, 7.3, 0, 0],
        opposite: false,
        tickPositioner: function () { return [0, 1, 2, 3, 4, 5]; },
        linkedTo: 0,
        lineColor: 'transparent',
        labels: {
          y: 0,
          style: {
              color: '#000000',
              fontSize: '14px',
              fontWeight: 'bold'
          }
        }
      },
      {
        categories: [5, 6.7, 6.7, 6.7, 6.7, 6.7, 6.7, 5],
        opposite: false,
        linkedTo: 0,
        lineColor: 'transparent',
        labels: {
          y: -5,
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
      visible: false
    },
    legend: {
      enabled: false
    },
    plotOptions: {
      column: {
        stacking: "normal",
        pointPadding: 0.2,
        borderWidth: 0,
      },
    },
    series: [
      {
        name: "Diff",
        data: diff,
        colorByPoint: true,
        colors: diffColor,
        dataLabels: {
          enabled: true,
          formatter: function () {
            return diff[this.point.index].toFixed(1);
          },
        },
      },
      {
        name: "Base",
        data: fact,
        color: "#d6d6df",
      }
    ],
    tooltip: {
      shared: true,
    },
    credits: {
      enabled: false
    }
  };

  return (
    <div>
      <h3 className="font-bold text-center">
        {title}
      </h3>
      <div className="grid grid-cols-[100px_1fr]">
        <div className="flex flex-col">
          <div className="flex items-center grow">
            Icono
          </div>
          <div className="flex flex-col gap-0">
            <span className="flex items-baseline gap-2 font-bold text-[12px] text-[#000000]">
              Fact
              <b className="font-bold text-[16px] text-[#fe7887]">
                {averageData(plan).toFixed(1)}
              </b>
            </span>
            <span className="flex items-baseline gap-2 font-bold text-[12px] text-[#9696ab]">
              Pan
              <b className="font-bold text-[16px] text-[#9696ab]">
                {averageData(fact).toFixed(1)}
              </b>
            </span>
          </div>
        </div>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    </div>
  )
}

LineAndBarChart.propTypes = {
  title: PropTypes.string.isRequired,
}


export default LineAndBarChart