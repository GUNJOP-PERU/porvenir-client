import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import PropTypes from 'prop-types'
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const LineAndBarChart = ({ title, chartData }) => {
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
    return completedStatsByMonths.map((e) => e ? Number((e*36 / 1000).toFixed(2)) : "");
  };

  const plan = new Array(12).fill(554205).map((e) => Number((e / 1000).toFixed(2)));
  const fact = sortDataByMonth(chartData); 
  const diff = plan.map((exp, i) => {
    const e = Math.abs(exp - fact[i]).toFixed(2);
    return +e;
  });

  const diffColor = plan.map((exp, i) =>
    fact[i] >= exp ? "#04c286" : "#fe7887"
  );

  const averageData = (array) => {
    if (array.length === 0) {
      return 0;
    }
    const suma = array.reduce((acumulador, valor) => acumulador + Number(valor), 0);
    return suma
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
        categories: plan.map((e) => `${e} kTM`),
        opposite: false,
        lineColor: 'transparent',
        labels: {
          y: sortDataByMonth(chartData).length !== 0 ? 0 : 10,
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
            return diff[this.point.index];
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
        const hoursByShift = getMonthsOfYear().fullMonths;
        const currentHour = hoursByShift[this.x] || `Hora ${this.x + 1}`;
        
        let tooltipText = `<b>${currentHour}</b><br/>`;

        this.points.forEach(function (point) {
          tooltipText += `<span style="color:${point.color}">●</span> ${point.series.name}: <b>${point.y} kTM</b><br/>`;
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
          <div className="flex flex-col gap-0 mb-[-2px]">
            <span className="flex items-baseline gap-2 font-bold text-[12px] text-[#000000]">
              Fact
              <b className="font-bold text-[14px]/[15px] text-[#000000]">
                {averageData(fact).toFixed(2)}
              </b>
            </span>
            <span className="flex items-baseline gap-2 font-bold text-[12px] text-[#9696ab]">
              Plan
              <b className="font-bold text-[14px]/[15px] text-[#9696ab]">
                {averageData(plan)}
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
  chartData: PropTypes.shape({
    totalTrips: PropTypes.number.isRequired,
    hourRangesWithTrips: PropTypes.number.isRequired,
    statsByHour: PropTypes.arrayOf(PropTypes.shape({
      hour: PropTypes.string.isRequired,
      totalTrips: PropTypes.number.isRequired,
      totalTripsDay: PropTypes.number.isRequired,
      totalTripsNight: PropTypes.number.isRequired,
    })),
  }),
}


export default LineAndBarChart