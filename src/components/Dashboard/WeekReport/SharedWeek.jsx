import { useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { filterData, filterValidTrips } from "@/lib/utilsGeneral";
import { useFetchGraphicData } from "@/hooks/useGraphicData";
import { getLast4WeeksIncludingCurrent } from "./MiningWeeksSelect";

export default function SharedWeek() {
  const last4Weeks = getLast4WeeksIncludingCurrent();
  const start = last4Weeks[0]?.startTimestamp;
  const end = last4Weeks[last4Weeks.length - 1]?.endTimestamp;

  const {
    data = [],
    isLoading,
    isError,
  } = useFetchGraphicData({
    queryKey: ["comparative-week", start, end],
    endpoint: "cycle/by-date-range",
    filters: start && end ? `startDate=${start}&endDate=${end}` : "",
  });

  const filteredInvalidData = useMemo(() => filterValidTrips(data), [data]);
  const filteredMineral = useMemo(() => filterData(data, "mineral"), [data]);
  const filteredDesmonte = useMemo(() => filterData(data, "desmonte"), [data]);

  const { categories, series, tableData } = useMemo(() => {
    const grouped = {};

    // Agrupar por semana (weekNumber)
    last4Weeks.forEach((w) => {
      grouped[w.weekNumber] = { mineral: 0, desmonte: 0, remanejo: 0 };
    });

    // Viajes mineral
    filteredMineral.forEach((item) => {
      if (!item.date) return;
      const dateMs = new Date(item.date).getTime();
      const week = last4Weeks.find(
        (w) => dateMs >= w.startTimestamp && dateMs <= w.endTimestamp
      );
      if (week) grouped[week.weekNumber].mineral++;
    });

    // Viajes desmonte
    filteredDesmonte.forEach((item) => {
      if (!item.date) return;
      const dateMs = new Date(item.date).getTime();
      const week = last4Weeks.find(
        (w) => dateMs >= w.startTimestamp && dateMs <= w.endTimestamp
      );
      if (week) grouped[week.weekNumber].desmonte++;
    });

    // Remanejo (todas las unidades juntas)
    filteredInvalidData.forEach((item) => {
      if (!item.date) return;
      const dateMs = new Date(item.date).getTime(); // <-- convertir
      const week = last4Weeks.find(
        (w) => dateMs >= w.startTimestamp && dateMs <= w.endTimestamp
      );
      if (week) grouped[week.weekNumber].remanejo++;
    });

    const categories = last4Weeks.map((w) => `Semana ${w.weekNumber}`);

    const series = [
      {
        name: "Mineral",
        type: "column",
        data: last4Weeks.map((w) => grouped[w.weekNumber].mineral),
        color: "#14B8A6",
      },
      {
        name: "Desmonte",
        type: "column",
        data: last4Weeks.map((w) => grouped[w.weekNumber].desmonte),
        color: "#F59E0B",
      },
      {
        name: "% Remanejo",
        type: "line",
        yAxis: 1, // <--- usar segundo eje
        data: last4Weeks.map((w) => {
          const total =
            grouped[w.weekNumber].mineral + grouped[w.weekNumber].desmonte;
          const percent = (grouped[w.weekNumber].remanejo / total) * 100;
          return Number(percent.toFixed(2));
        }),
        color: "black",
        marker: { enabled: true },
      },
    ];
    const tableData = last4Weeks.map((w) => {
      const total =
        grouped[w.weekNumber].mineral + grouped[w.weekNumber].desmonte;
      const percentRemanejo = total
        ? Number(((grouped[w.weekNumber].remanejo / total) * 100).toFixed(2))
        : 0;
      return {
        week: w.weekNumber,
        totalTrips: total,
        percentRemanejo,
      };
    });

    return { categories, series, tableData };
  }, [data, last4Weeks]);

  const options = useMemo(
    () => ({
      chart: { backgroundColor: "transparent", height: 450 },
      title: { text: null },
      xAxis: {
        categories,
        lineColor: "transparent",
        crosshair: true,
        tickWidth: 0,
        tickLength: 0,
        labels: {
          style: {
            fontSize: "0.65rem",
            color: "#A6A6A6",
          },
        },
      },
      yAxis: [
        {
          title: { text: null },
          labels: {
            enabled: false,
          },
        },
        {
          title: { text: null },
          labels: {
            enabled: false,
          },
          opposite: true,
          max: 100,
        },
      ],
      tooltip: {
        backgroundColor: "#111214",
        borderWidth: 0,
        shadow: false,
        borderRadius: 10,
        padding: 10,
        style: {
          color: "#FFFFFF",
          fontSize: "0.65em",
        },
        shared: true,
        formatter: function () {
          const category =
            this.series.chart.xAxis[0].categories[this.point.x] || this.x;
          let tooltipText = `<b>${category}</b><br/>`;
          this.points.forEach((point) => {
            tooltipText += `<span style="color:${point.color}">●</span> <b>${point.series.name}</b>: ${point.y}<br/>`;
          });
          return tooltipText;
        },
      },
      plotOptions: {
        column: {
          grouping: true,
          pointPadding: 0,
          groupPadding: 0.05,
          borderWidth: 0,
          borderRadius: "20%",
          stacking: "normal",
          dataLabels: {
            enabled: true,
            inside: true,
            style: {
              fontSize: "0.7em",
              color: "#000",
              fontWeight: "bold",
              textOutline: "none",
              lineHeight: "1",
            },
            backgroundColor: "rgba(255, 255, 255, 0.3)",
            borderRadius: 3,
            padding: 2,
            borderWidth: 0,
            formatter: function () {
              return this.y === 0 ? null : this.y;
            },
          },
        },
        line: { marker: { enabled: true } },
      },
      series,
      legend: {
        align: "right",
        verticalAlign: "top",
        layout: "horizontal",
        floating: false,
        itemStyle: {
          color: "#A6A6A6",
          fontSize: "9px",
          fontWeight: "bold",
          textTransform: "uppercase",
        },
        itemHoverStyle: {
          color: "#1EE0EE",
        },
        symbolWidth: 10,
        symbolHeight: 9,
        symbolRadius: 2,
        itemMarginTop: 0,
        itemMarginBottom: 0,
        zIndex: 10,
      },
      credits: { enabled: false },
      exporting: { enabled: false },
      accessibility: { enabled: false },
    }),
    [categories, series]
  );

  if (isLoading)
    return (
      <div className="bg-zinc-200 rounded-2xl flex items-center justify-center h-[320px] w-full animate-pulse" />
    );

  if (isError)
    return (
      <div className="flex items-center justify-center h-[320px] w-full">
        <span className="text-[10px] text-red-500">Ocurrió un error</span>
      </div>
    );

  return (
    <>
      <HighchartsReact highcharts={Highcharts} options={options} />
      <div className="flex items-center justify-center w-full">
        <table className="w-full text-xs mt-4 border border-zinc-300 rounded-lg overflow-hidden">
          <thead className="bg-zinc-100 text-zinc-400">
            <tr >
              <th className="py-2">Semana</th>
              <th className="py-2">Viajes</th>
              <th className="py-2">%Viajes de Remanejo</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((w, i) => (
              <tr key={i} className="text-center border-t">
                <td className="py-2">Semana {w.week}</td>
                <td className="py-2">{w.totalTrips}</td>
                <td className="py-2">{w.percentRemanejo}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
