import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import PropTypes from 'prop-types'

const LineAndBarChart = ({ title, chartData }) => {
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

    return completedStatsByHours;
  };

  const plan = new Array(12).fill(770);
  const fact = sortDataByHour(chartData).map((e) => e ? e * 36 : ""); 
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
      height: 250,
      margin: [50, 20, 50, 20]
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
        categories: new Array(12).fill(770).map((e) => `${e} TM`),
        opposite: false,
        lineColor: 'transparent',
        labels: {
          y: sortDataByHour(chartData).length !== 0 ? 0 : 10,
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
        linkedTo: 1,
        labels: {
          style: {
            color: '#9696ab',
            fontSize: '14px',
            fontWeight: 'bold'
          }
        },
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
        pointPadding: 0.1,
        groupPadding: 0.1,
        pointWidth: 80,
        borderWidth: 0,
      },
    },
    series: [
      {
        name: "Faltante",
        data: diff,
        colorByPoint: true,
        colors: diffColor,
        xAxis: 1,
        dataLabels: {
          enabled: true,
          formatter: function () {
            return diff[this.point.index].toFixed(1);
          },
        },
      },
      {
        name: "Extraído",
        data: fact,
        color: "#d6d6df",
        xAxis: 0,
      },
    ],
    tooltip: {
      shared: true,
      formatter: function () {
        const hoursByShift = getHoursByShift();
        const currentHour = hoursByShift[this.x] || `Hora ${this.x + 1}`;
        
        let tooltipText = `<b>${currentHour}</b><br/>`;

        this.points.forEach(function (point) {
          tooltipText += `<span style="color:${point.color}">●</span> ${point.series.name}: <b>${point.y} TM</b><br/>`;
        });
        return tooltipText;
      }
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
              <b className="font-bold text-[16px] text-[#000000]">
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