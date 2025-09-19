import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
// Utils
import { getCurrentWeekDates, getCurrentWeekDatesFormatted } from "@/utils/dateUtils";

interface LineAndBarChartByDayProps {
  title: string,
  mineralWeight: number,
  chartColor?: string,
  chartData: {
    totalTrips: number,
    statsByDay: {
      date: string,
      totalTrips: number,
    }[],
  },
}

const LineAndBarChartByDay = ({ title, chartData, mineralWeight, chartColor = "#000000" } : LineAndBarChartByDayProps) => {

  const sortDataByDay = (data : LineAndBarChartByDayProps['chartData']) => {
    if (!data?.statsByDay) return {
      data: [],
      acumulativeData: []
    };

    const weekDates = getCurrentWeekDates();
    const dataMap :any = {};
    data.statsByDay.forEach((item) => {
      dataMap[item.date] = {
        totalTrips: item.totalTrips,
      };
    });

    const completedStatsByDays = weekDates.map((date) => dataMap[date] || {
      totalTrips: "",
    });

    const acumulativeData = completedStatsByDays.map((day, index) => {
      const sum = completedStatsByDays.slice(0, index + 1).reduce((acc, val) => acc.totalTrips + (val || 0), 0);
      return day ? sum : "";
    });

    return {
      data: completedStatsByDays.map(e => e.totalTrips ? e.totalTrips * mineralWeight : ""),
      acumulativeData: acumulativeData.map(e => e ? e * mineralWeight : ""),
      dataText: completedStatsByDays.map(e => e.totalTrips ? `${e.totalTrips * mineralWeight} TM` : ""),
      acumulativeDataText: acumulativeData.map(e => e ? `${e * mineralWeight} TM` : "")
    };
  };

  const plan = new Array(7).fill(1200);

  const diff = plan.map((exp, i) => {
    const currentData = sortDataByDay(chartData).data;
    const value = typeof currentData[i] === "number" ? currentData[i] as number : 0;
    const e = Math.abs(exp - value);
    return +e;
  });

  const diffColor = plan.map((exp, i) => {
    const currentData = sortDataByDay(chartData).data;
    return currentData[i] !== undefined && currentData[i] >= exp ? "#04c286" : "#fe7887";
  });

  const averageData = (array : number[]) => {
    console.log(array)
    if (array.length === 0) {
      return 0;
    }
    const suma = array.reduce((acumulador, valor) => acumulador + Number(valor), 0);
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
        categories: getCurrentWeekDatesFormatted(),
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
        name: "Extraído",
        data: sortDataByDay(chartData).data,
        color: chartColor,
      }
    ],
    tooltip: {
      shared: true,
      formatter: function () {
        const categoryName = this.points[0].point.category || getCurrentWeekDates()[this.x];
        let tooltipText = `<b>${categoryName}</b><br/>`;
        this.points.forEach(function (point : any) {
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

export default LineAndBarChartByDay