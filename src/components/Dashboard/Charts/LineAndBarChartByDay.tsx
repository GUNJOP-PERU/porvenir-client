import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
// Utils
import {
  getCurrentWeekDates,
  getCurrentWeekDatesFormatted,
} from "@/utils/dateUtils";
import { roundAndFormat } from "@/lib/utilsGeneral";

interface LineAndBarChartByDayProps {
  title?: string;
  mineralWeight: number;
  chartColor?: string;
  chartData: {
    totalTrips: number;
    statsByDay: {
      date: string;
      totalTrips: number;
    }[];
  };
}

const LineAndBarChartByDay = ({
  title,
  chartData,
  mineralWeight,
  chartColor = "#000000",
}: LineAndBarChartByDayProps) => {
  const sortDataByDay = (data: LineAndBarChartByDayProps["chartData"]) => {
    if (!data?.statsByDay)
      return {
        data: [],
        acumulativeData: [],
      };

    const weekDates = getCurrentWeekDates();
    const dataMap: any = {};
    data.statsByDay.forEach((item) => {
      dataMap[item.date] = {
        totalTrips: item.totalTrips,
      };
    });

    const completedStatsByDays = weekDates.map(
      (date) =>
        dataMap[date] || {
          totalTrips: "",
        }
    );

    const acumulativeData = completedStatsByDays.map((day, index) => {
      const sum = completedStatsByDays
        .slice(0, index + 1)
        .reduce((acc, val) => acc.totalTrips + (val || 0), 0);
      return day ? sum : "";
    });

    return {
      data: completedStatsByDays.map((e) =>
        e.totalTrips ? e.totalTrips * mineralWeight : ""
      ),
      acumulativeData: acumulativeData.map((e) => (e ? e * mineralWeight : "")),
      dataText: completedStatsByDays.map((e) =>
        e.totalTrips ? `${e.totalTrips * mineralWeight} ` : ""
      ),
      acumulativeDataText: acumulativeData.map((e) =>
        e ? `${e * mineralWeight}` : ""
      ),
    };
  };

  const plan = new Array(7).fill(1200);

  const diff = plan.map((exp, i) => {
    const currentData = sortDataByDay(chartData).data;
    const value =
      typeof currentData[i] === "number" ? (currentData[i] as number) : 0;
    const e = Math.abs(exp - value);
    return +e;
  });

  const diffColor = plan.map((exp, i) => {
    const currentData = sortDataByDay(chartData).data;
    return currentData[i] !== undefined && currentData[i] >= exp
      ? "#04c286"
      : "#fe7887";
  });

  const averageData = (array: number[]) => {
    console.log(array);
    if (array.length === 0) {
      return 0;
    }
    const suma = array.reduce(
      (acumulador, valor) => acumulador + Number(valor),
      0
    );
    return suma / array.length;
  };

  const options = {
    chart: {
      type: "column",
      height: 280,
      // margin: [50, 20, 70, 20]
    },
    title: "",
    xAxis: [
      {
        title: "",
        categories: sortDataByDay(chartData).dataText,
        opposite: false,
        lineColor: "transparent",
        labels: {
          style: {
            color: "#000000",
            fontSize: "0.8em",
            fontWeight: "bold",
          },
        },
      },
      {
        title: "",
        categories: plan.map((e) => `${roundAndFormat(e)}`),
        opposite: false,
        lineColor: "transparent",
        labels: {
          y: 0,
          style: {
            color: "#00000080",
            fontSize: "0.8em",
            fontWeight: "bold",
          },
        },
      },
      {
        title: "",
        categories: getCurrentWeekDatesFormatted(),
        opposite: true,
        linkedTo: 1,
        lineColor: "#D9D9D9",
        labels: {
          style: {
            color: "#00000080",
            fontSize: "0.8em",
            fontWeight: "bold",
          },
        },
      },
    ],
    yAxis: {
      title: "",
      visible: false,
    },

    plotOptions: {
      column: {
        stacking: "normal",
        pointPadding: 0,
        groupPadding: 0.05,
        borderWidth: 0,
        borderRadius: "20%",
        dataLabels: {
          enabled: true,
          inside: true,
          style: {
            fontSize: "0.7em",
            color: "#fff",
            fontWeight: "bold",
            textOutline: "none",
            lineHeight: "1",
          },
          backgroundColor: "#00000050",
          borderRadius: 3,
          padding: 2,
          borderWidth: 0,
        },
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
            return `${roundAndFormat(diff[this.point.index])}`;
          },
        },
      },
      {
        name: "Extraído",
        data: sortDataByDay(chartData).data,
        color: chartColor,
      },
    ],
    tooltip: {
      shared: true,
      valueSuffix: "TM",
      backgroundColor: "#111214",
      borderWidth: 0,
      shadow: false,
      borderRadius: 10,
      padding: 12,
      style: {
        color: "#FFFFFF",
        fontSize: "0.65em",
        zIndex: 10,
      },
      formatter: function () {
        const categoryName =
          this.points[0].point.category || getCurrentWeekDates()[this.x];
        let tooltipText = `<b>${categoryName}</b><br/>`;
        this.points.forEach(function (point: any) {
          tooltipText += `<span style="color:${point.color}">●</span> ${point.series.name}: <b>${point.y} TM</b><br/>`;
        });
        return tooltipText;
      },
    },
    legend: {
      align: "right",
      verticalAlign: "top",
      layout: "horizontal",
      floating: false,
      itemStyle: {
        color: "#A6A6A6",
        fontSize: "0.55em",
        fontWeight: "600",
        textTransform: "uppercase",
      },
      itemHoverStyle: { color: "black" },
      symbolWidth: 10,
      symbolHeight: 9,
      symbolRadius: 2,
      itemMarginTop: 0,
      itemMarginBottom: 0,
    },
    credits: {
      enabled: false,
    },
  };

  return (
    <>
      <h3 className="font-bold text-center text-sm">{title}</h3>
    
        {/* <div className="flex flex-col">
          <div className="flex items-center grow">Icono</div>
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
        </div> */}
        <HighchartsReact highcharts={Highcharts} options={options} />
      
    </>
  );
};

export default LineAndBarChartByDay;
