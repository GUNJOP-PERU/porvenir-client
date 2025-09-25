import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useMemo } from "react";
import { getLast4WeeksIncludingCurrent } from "../WeekReport/MiningWeeksSelect";
import { useFetchGraphicData } from "@/hooks/useGraphicData";
import { roundAndFormat } from "@/lib/utilsGeneral";
import ParetoTime from "./ParetoTime";
import { StatusDisplay } from "../StatusDisplay";

export default function WeeklyEvolution() {
  const last4Weeks = getLast4WeeksIncludingCurrent();
  const start = last4Weeks[0]?.startDate;
  const end = last4Weeks[last4Weeks.length - 1]?.endDate;

  const {
    data = [],
    isLoading,
    isError,
  } = useFetchGraphicData({
    queryKey: ["comparative-week-unproductive", start, end],
    endpoint: "activity",
    filters: `startDate=${start}&endDate=${end}&activityType=no productive`,
  });

  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        weeks: [],
        t_impr: [],
        improd_viaje: [],
        perc_impr: [],
        viajes: [],
      };
    }

    // 1️⃣ Agrupar por año + semana
    const grouped = data.reduce((acc, curr) => {
      const key = `${curr.year}-${curr.week}`; // ej: "2025-38"
      if (!acc[key]) {
        acc[key] = { t_impr: 0, viajes: 0 };
      }
      acc[key].t_impr += curr.duration ?? 0; // sumamos duración
      acc[key].viajes += 1; // sumamos viajes
      return acc;
    }, {});

    // 2️⃣ Ordenar por año + semana
    const sortedKeys = Object.keys(grouped)
      .sort((a, b) => {
        const [yearA, weekA] = a.split("-").map(Number);
        const [yearB, weekB] = b.split("-").map(Number);
        if (yearA !== yearB) return yearA - yearB;
        return weekA - weekB;
      })
      .slice(-4);

    const weeks = sortedKeys.map((k) => k.split("-")[1]);
    const t_impr = sortedKeys.map((k) => grouped[k].t_impr);
    const viajes = sortedKeys.map((k) => grouped[k].viajes);
    const improd_viaje = sortedKeys.map((k) =>
      grouped[k].viajes === 0 ? 0 : (grouped[k].t_impr * 60) / grouped[k].viajes
    );
    const totalHoras = t_impr.reduce((a, b) => a + b, 0);
    const perc_impr = t_impr.map((v) =>
      totalHoras === 0 ? 0 : (v / totalHoras) * 100
    );

    return { weeks, t_impr, improd_viaje, perc_impr, viajes };
  }, [data]);

  const options = useMemo(
    () => ({
      chart: {
        backgroundColor: "transparent",
        height: 300,
        marginTop: 40,
        marginBottom: 40,
      },
      title: {
        text: null,
        align: "center",
        style: { fontSize: "14px", fontWeight: "bold" },
      },
      xAxis: {
        categories: chartData.weeks.map((w) => `Sem ${w}`),
        lineColor: "transparent",
        crosshair: true,
        tickWidth: 0,
        tickLength: 0,
        labels: {          
          style: {
            fontSize: "0.65rem",
            fontWeight: "600",
            color: "#A1A1AA",
            fontFamily: "Nunito, sans-serif",
            lineHeight: "10",
          },
        },
      },
      yAxis: [
        {
          title: { text: null },
          labels: {
            enabled: false,
          },
          gridLineColor: "#D9D9D9",
          gridLineWidth: 0.5,
          gridLineDashStyle: "Dash",
        },
        {
          title: { text: null },
          labels: {
            enabled: false,
          },
          opposite: true,
          gridLineColor: "#D9D9D9",
          gridLineWidth: 0.5,
          gridLineDashStyle: "Dash",
        },
      ],
      tooltip: {
        backgroundColor: "#111214",
        borderWidth: 0,
        shadow: false,
        borderRadius: 10,
        padding: 10,
        style: { color: "#FFFFFF", fontSize: "0.65em" },
        shared: true,
        formatter: function () {
          const category =
            this.series.chart.xAxis[0].categories[this.point.x] || this.x;
          let tooltipText = `<b>${category}</b><br/>`;
          this.points.forEach((point) => {
            tooltipText += `<span style="color:${point.color}">●</span> <b>${
              point.series.name
            }</b>: ${roundAndFormat(point.y)}${
              point.series.name.includes("Improd/Viaje") ? " min" : " hr"
            }<br/>`;
          });
          return tooltipText;
        },
      },
      plotOptions: {
        column: {
          borderRadius: "15%",
          pointPadding: 0.02,
          groupPadding: 0.02,
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            inside: true,
            verticalAlign: "middle",
            style: { fontSize: "0.6rem", color: "#000", textOutline: "none" },
            formatter: function () {
              return this.y == 0 ? "" : roundAndFormat(this.y);
            },
          },
        },
        spline: {
          dataLabels: {
            enabled: true,
            style: {
              fontSize: "0.6rem",
              color: "#42A3B1",
              fontWeight: "600",
              textOutline: "none",
            },
            formatter: function () {
              return roundAndFormat(this.y);
            },
            backgroundColor: "#eaeaea80",
            borderRadius: 3,
            padding: 3,
          },
        },
      },
      series: [
        {
          type: "column",
          name: "T. Impr (Hrs)",
          data: chartData.t_impr,
          color: "#42A3B1",
          yAxis: 0,
        },
        {
          type: "spline",
          name: "Improd/Viaje (min)",
          data: chartData.improd_viaje,
          color: "#48EAB0",
          yAxis: 1,
        },
      ],
      legend: {
        align: "right",
        verticalAlign: "top",
        layout: "horizontal",
        itemStyle: {
          color: "#A6A6A6",
          fontSize: "9px",
          fontWeight: "bold",
          textTransform: "uppercase",
        },
        itemHoverStyle: { color: "#1EE0EE" },
        symbolWidth: 10,
        symbolHeight: 9,
        symbolRadius: 2,
        itemMarginTop: 0,
        itemMarginBottom: 0,
      },
      credits: { enabled: false },
      exporting: { enabled: false },
      accessibility: { enabled: false },
    }),
    [chartData]
  );

  if (isLoading || isError || !data || data.length === 0)
    return (
      <StatusDisplay
        isLoading={isLoading}
        isError={isError}
        noData={!data || data.length === 0}
        height={"78vh"}
      />
    );

  return (
    <div className=" ">
      <HighchartsReact highcharts={Highcharts} options={options} />
      <div className="mt-2 flex items-center justify-center w-full border border-sky-100 rounded-lg overflow-hidden">
        <table className="min-w-full bg-white/50">
          <thead className="bg-sky-100 text-sky-500 font-semibold sticky top-0">
            <tr className="text-left text-[10px] leading-[.8rem]">
              <th className="px-4 py-1.5 first:rounded-l-md last:rounded-r-md">
                Semana
              </th>
              <th className="px-4 py-1.5 first:rounded-l-md last:rounded-r-md">
                Viajes
              </th>
              <th className="px-4 py-1.5 first:rounded-l-md last:rounded-r-md">
                Tiempo Improductivo
              </th>
              <th className="px-4 py-1.5 first:rounded-l-md last:rounded-r-md">
                % Improductivo
              </th>
              <th className="px-4 py-1.5 first:rounded-l-md last:rounded-r-md">
                Improd/viaje
              </th>
            </tr>
          </thead>
          <tbody>
            {chartData.weeks.map((w, i) => (
              <tr
                key={i}
                className="border-b border-sky-100/50 first:rounded-l-md last:rounded-r-md last:border-b-0 text-[11px] leading-[.8rem]"
              >
                <td className="px-4 py-1.5">Sem {w}</td>
                <td className="px-4 py-1.5">
                  {roundAndFormat(chartData.viajes[i])}
                </td>
                <td className="px-4 py-1.5">
                  {roundAndFormat(chartData.t_impr[i])}
                </td>
                <td className="px-4 py-1.5">
                  {chartData.perc_impr[i].toFixed(2)}%
                </td>
                <td className="px-4 py-1.5">
                  {roundAndFormat(chartData.improd_viaje[i])}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ParetoTime
        data={data}
        limit={5}
        isLoading={isLoading}
        isError={isError}
      />
    </div>
  );
}
