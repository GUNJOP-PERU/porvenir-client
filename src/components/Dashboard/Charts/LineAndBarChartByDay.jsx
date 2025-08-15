import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import PropTypes from 'prop-types'
import { format } from "date-fns";

const LineAndBarChartByDay = ({ title, chartData, mineralWeight }) => {
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
        weekDates.push(format(date, "yyyy-MM-dd"));
      }

      return weekDates;
    };
    const weekDates = getCurrentWeekDates();
    const dataMap = {};
    data.statsByDay.forEach((item) => {
      dataMap[item.date] = {
        totalTrips: item.totalTrips,
        totalTripsDay: item.totalTripsDay,
        totalTripsNight: item.totalTripsNight
      };
    });

    const completedStatsByDays = weekDates.map((date) => dataMap[date] || {
      totalTrips: "",
      totalTripsDay: "",
      totalTripsNight: ""
    });

    const acumulativeData = completedStatsByDays.map((day, index) => {
      const sum = completedStatsByDays.slice(0, index + 1).reduce((acc, val) => acc.totalTrips + (val || 0), 0);
      return day ? sum : "";
    });

    return {
      data: completedStatsByDays.map(e => e.totalTrips ? e.totalTrips * mineralWeight : ""),
      dataByDay: completedStatsByDays.map(e => e.totalTripsDay ? e.totalTripsDay * mineralWeight : ""),
      dataByNight: completedStatsByDays.map(e => e.totalTripsNight ? e.totalTripsNight * mineralWeight : ""),
      acumulativeData: acumulativeData.map(e => e ? e * mineralWeight : ""),
      dataText: completedStatsByDays.map(e => e.totalTrips ? `${e.totalTrips * mineralWeight} TM` : ""),
      acumulativeDataText: acumulativeData.map(e => e ? `${e * mineralWeight} TM` : "")
    };
  };

  const getCurrentWeekDates = () => {
    const currentDate = new Date();
    const currentDay = currentDate.getDay();
    const thursdayOffset = currentDay >= 4 ? currentDay - 4 : currentDay + 3;
    const thursday = new Date(currentDate);
    thursday.setDate(currentDate.getDate() - thursdayOffset);

    const weekDates = [];
    const formatter = new Intl.DateTimeFormat('es-ES', { weekday: 'short', day: 'numeric' });

    for (let i = 0; i < 7; i++) {
      const date = new Date(thursday);
      date.setDate(thursday.getDate() + i);
      const formattedDate = formatter.format(date);
      weekDates.push(formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1));
    }

    return weekDates;
  };

  const plan = (new Array(7).fill(520)).map((e) => e * mineralWeight);
  const diff = plan.map((exp, i) => {
    const currentData = sortDataByDay(chartData).data;
    const e = Math.abs(exp - currentData[i]);
    return +e;
  });

  const diffColor = plan.map((exp, i) => {
    const currentData = sortDataByDay(chartData).data;
    return currentData[i] >= exp ? "#04c286" : "#fe7887";
  });

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
        categories: sortDataByDay(chartData).dataText,
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
        categories: plan.map((e) => `${e} TM`),
        opposite: false,
        lineColor: 'transparent',
        labels: {
          y: sortDataByDay(chartData).length !== 0 ? 0 : 10,
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
      visible: false,
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
        name: "Faltante",
        data: diff,
        colorByPoint: true,
        colors: diffColor,
        xAxis: 1,
        dataLabels: {
          enabled: true,
          formatter: function () {
            return `${diff[this.point.index].toFixed(1)} t`;
          },
        },
      },
      {
        name: "Turno Dia",
        data: sortDataByDay(chartData).dataByDay,
        xAxis: 0,
        color: "#FFF0C4",
      },
      {
        name: "Turno Noche",
        data: sortDataByDay(chartData).dataByNight,
        xAxis: 0,
        color: "#3E0703",
      },
      {
        name: "Total",
        data: sortDataByDay(chartData).data,
        color: "#d6d6df",
        visible: false,
      }
    ],
    tooltip: {
      shared: true,
      formatter: function () {
        const categoryName = this.points[0].point.category || getCurrentWeekDates()[this.x];
        let tooltipText = `<b>${categoryName}</b><br/>`;
        
        this.points.forEach(function (point) {
          tooltipText += `<span style="color:${point.color}">●</span> ${point.series.name}: <b>${point.y} TM</b><br/>`;
        });
        
        const totalSeriesData = sortDataByDay(chartData).data;
        const totalValue = totalSeriesData[this.x];
        if (totalValue !== "" && totalValue !== null && totalValue !== undefined) {
          tooltipText += `<span style="color:#d6d6df">●</span> Total: <b>${totalValue} TM</b><br/>`;
        }
        
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
              <b className="font-bold text-[14px]/[15px] text-[#000000]">
                {averageData(sortDataByDay(chartData).data).toFixed(0)} t
              </b>
            </span>
            <span className="flex items-baseline gap-2 font-bold text-[12px] text-[#9696ab]">
              Plan
              <b className="font-bold text-[14px]/[15px] text-[#9696ab]">
                {averageData(plan)} t
              </b>
            </span>
          </div>
        </div>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    </div>
  )
}

LineAndBarChartByDay.propTypes = {
  title: PropTypes.string.isRequired,
  mineralWeight: PropTypes.number.isRequired,
  chartData: PropTypes.shape({
    totalTrips: PropTypes.number.isRequired,
    hourRangesWithTrips: PropTypes.number.isRequired,
    statsByDays: PropTypes.arrayOf(PropTypes.shape({
      day: PropTypes.string.isRequired,
      totalTrips: PropTypes.number.isRequired,
      totalTripsDay: PropTypes.number.isRequired,
      totalTripsNight: PropTypes.number.isRequired,
    })),
  }),
}


export default LineAndBarChartByDay