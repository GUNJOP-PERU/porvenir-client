import DonutChart from "./DonutChart"
import ProgressBar from "./ProgressBar"
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
//Utils
import { getCurrentWeekDates, getCurrentWeekDatesFormatted } from "@/utils/dateUtils";

interface IDonutAndSplineChartByDayProps {
  title: string,
  mineralWeight: number,
  donutData: {
    total: number,
    currentValue: number,
    currentValueColor: string,
  },
  progressBarData: {
    total: number,
    currentValue: number,
    prediction: number,
    currentValueColor: string,
    showDifference: boolean,
    forecastText: string,
  },
  chartData: {
    totalTrips: number,
    statsByDay: {
      date: string,
      totalTrips: number,
    }[],
  },
}

const DonutAndSplineChartByDay = ({ title, donutData , progressBarData, chartData, mineralWeight } : IDonutAndSplineChartByDayProps) => {
  const sortDataByDay = (data: IDonutAndSplineChartByDayProps['chartData']) => {
    const weekDates = getCurrentWeekDates();
    const dataMap : any = {};
    data.statsByDay.forEach((item) => {
      dataMap[item.date] = item.totalTrips;
    });

    const completedStatsByDays = weekDates.map((date) => dataMap[date] || "");

    const acumulativeData = completedStatsByDays.map((day, index) => {
      const sum = completedStatsByDays.slice(0, index + 1).reduce((acc, val) => acc + (val || 0), 0);
      return day ? sum : "";
    });

    return {
      data: completedStatsByDays.map(e => e ? e * mineralWeight : ""),
      acumulativeData: acumulativeData.map(e => e ? e * mineralWeight : ""),
      dataText: completedStatsByDays.map(e => e ? `${e * mineralWeight} TM` : ""),
      acumulativeDataText: acumulativeData.map(e => e ? `${e * mineralWeight} TM` : "")
    };
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
          categories: sortDataByDay(chartData).acumulativeDataText,
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
          categories: new Array(7).fill(1200).map((e,i) => `${e * (i+1)} TM`),
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
          categories: getCurrentWeekDatesFormatted(),
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
      title: {
        text: "Toneladas" // Agrega la unidad al título del eje Y
      },
      opposite: true,
      labels: {
        formatter:  (e : any) => {
          return `${e.value} t`; 
        },
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
          },
          tooltip: {
            pointFormatter: (e : any) => {
              return `<span style="color:${e.color}">●</span> ${e.series.name}: <b>${e.y} TM</b><br/>`; // Agrega la unidad al tooltip
            }
          }
      },
      {
          name: "Plan",
          data: new Array(7).fill(18720).map((e,i) => e * (i+1)),
          color: "#9696ab",
          xAxis: 1,
          fillColor: "#ffd0d63d",
          marker: {
            fillColor: 'white',
            lineWidth: 2,
            lineColor: '#9696ab'
          },
          tooltip: {
            pointFormatter: (e : any) => {
              return `<span style="color:${e.color}">●</span> ${e.series.name}: <b>${e.y} TM</b><br/>`; // Agrega la unidad al tooltip
            }
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
          showPrediction={false}
          progressBarData= {progressBarData}
        />
      </div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  )
}

export default DonutAndSplineChartByDay