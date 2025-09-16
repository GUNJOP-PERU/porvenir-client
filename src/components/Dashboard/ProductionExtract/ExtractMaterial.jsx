import { useMemo, useCallback } from "react";
import { getMetrics, roundAndFormat } from "@/lib/utilsGeneral";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { StatusDisplay } from "../StatusDisplay";

export default function ExtractMaterial({
  data,
  dataPlan,
  programmedTonnage,
  colorPoint,
  tonnageMaterial,
  material,
  isLoading,
  isError,
}) {
  const filteredPlan = useMemo(() => {
    if (!material) return dataPlan || [];
    return (dataPlan || []).filter(
      (p) => p.phase?.toLowerCase() === material.toLowerCase()
    );
  }, [dataPlan, material]);

  const filteredData = useMemo(() => {
    if (!material) return data || [];
    return (data || []).filter((d) =>
      filteredPlan.map((p) => p.frontLabor).includes(d.origin)
    );
  }, [data, filteredPlan, material]);

  const metrics = useMemo(
    () => getMetrics(filteredData, programmedTonnage, tonnageMaterial),
    [filteredData, programmedTonnage, tonnageMaterial]
  );

  const { labels, totals, planValues } = useMemo(() => {
    const merged = {};

    filteredPlan.forEach((p) => {
      merged[p.frontLabor] = {
        origin: p.frontLabor,
        plan: p.tonnage || 0,
        executed: 0,
      };
    });

    filteredData.forEach((d) => {
      const origin = d.origin || "Sin tajo";
      if (!merged[origin]) {
        merged[origin] = { origin, plan: 0, executed: d.tonnage || 0 };
      } else {
        merged[origin].executed += d.tonnage || 0;
      }
    });

    const labels = Object.keys(merged);
    const totals = labels.map((key) => merged[key].executed);
    const planValues = labels.map((key) => merged[key].plan);

    return { labels, totals, planValues };
  }, [filteredData, filteredPlan]);

  const getLabelsFromData = useCallback(() => labels, [labels]);

  const options = useMemo(
    () => ({
      chart: {
        type: "areaspline",
        height: 280,
        backgroundColor: "transparent",
        marginBottom: 60,
        spacing: [0, 0, 0, 0],
      },
      title: undefined,
      xAxis: [
        {
          categories: totals.map((v) => roundAndFormat(v)),
          offset: 0,
          opposite: true,
          lineColor: "#9696ab",
          labels: {
            formatter: function () {
              return roundAndFormat(totals[this.pos]);
            },
            style: {
              color: colorPoint,
              fontSize: "0.7rem",
              fontWeight: "bold",
            },
          },
        },
        {
          categories: planValues.map(String),
          offset: 15,
          opposite: true,
          lineColor: "transparent",
          labels: {
            formatter: function () {
              const val = Number(this.value);
              return isNaN(val) ? "" : roundAndFormat(val);
            },
            style: {
              color: "#00000080",
              fontSize: "0.65rem",
              fontWeight: "bold",
            },
          },
        },
        {
          categories: getLabelsFromData(),
          linkedTo: 1,
          lineColor: "transparent",
          labels: {
            // useHTML: true,
            formatter: function () {
              return this.value.replace(/_/g, "_<br>");
            },
            style: {
              fontSize: "0.6rem",
              fontWeight: "bold",
              color: "#9696ab",
              fontFamily: "Nunito, sans-serif",
              lineHeight: "12px",
              whiteSpace: "normal",
              textAlign: "center",
              textOverflow: "none",
            },
          },
        },
      ],
      yAxis: {
        title: { text: "" },
        opposite: true,
        labels: { enabled: false },
      },
      series: [
        {
          name: "EJECUTADO",
          data: totals,
          color: colorPoint,
          type: "areaspline",
          fillColor: Highcharts.color(colorPoint).setOpacity(0.3).get(),
          lineColor: colorPoint,
          marker: {
            fillColor: colorPoint,
            lineWidth: 2,
            lineColor: colorPoint,
          },
          zIndex: 10,
        },
        {
          name: "PROGRAMADO",
          data: planValues,
          color: "#1EE0EE",
          xAxis: 1,
          fillColor: Highcharts.color("#1EE0EE").setOpacity(0.2).get(),
          lineColor: "#1EE0EE",
          marker: { fillColor: "#1EE0EE", lineWidth: 2, lineColor: "#1EE0EE" },
          type: "areaspline",
          zIndex: 2,
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
          const labels = getLabelsFromData();
          const origin = labels[this.point.x] || this.x;

          let tooltipText = `<b style="color:#eaeaea">${origin}</b><br/>`;

          this.points.forEach((point) => {
            tooltipText += `<span style="color:${
              point.series.color
            }">●</span> <b style="color:#eaeaea">${
              point.series.name
            }:</b> <b style="color:${point.series.color}">${roundAndFormat(
              point.y
            )} TM</b><br/>`;
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
          fontSize: "9px",
          fontWeight: "bold",
          textTransform: "uppercase",
        },
        itemHoverStyle: { color: "black" },
        symbolWidth: 10,
        symbolHeight: 9,
        symbolRadius: 2,
        itemMarginTop: 0,
        itemMarginBottom: 0,
      },
      credits: { enabled: false },
      accessibility: { enabled: false },
    }),
    [totals, planValues, roundAndFormat, getLabelsFromData, colorPoint]
  );

  if (isLoading || isError || !data || data.length === 0)
    return (
      <StatusDisplay
        isLoading={isLoading}
        isError={isError}
        noData={!data || data.length === 0}
      />
    );

  return (
    <div className="flex flex-col gap-2 py-2">
      <div className="w-full grid md:grid-cols-4 grid-cols-2 gap-2">
        <div className="flex flex-col bg-zinc-50 px-4 py-2 rounded-lg">
          <span className="text-[10px] text-zinc-400 leading-none mb-1">
            Toneladas Programadas
          </span>
          <b className="text-[#1EE0EE] leading-none font-extrabold text-xl">
            {roundAndFormat(programmedTonnage)} <small>TM</small>
          </b>
          <span className="mt-1 text-xs leading-none text-zinc-500 font-bold">
            para {metrics.programmedTravels} viajes
          </span>
        </div>
        <div className="flex flex-col bg-zinc-50 px-4 py-2 rounded-lg">
          <span className="text-[10px] text-zinc-400 leading-none mb-1">
            Toneladas Ejecutadas
          </span>
          <b className="text-[#04C286] leading-none font-extrabold text-xl">
            {roundAndFormat(metrics.executedTonnage)} <small>TM</small>
          </b>
          <span className="mt-1 text-xs leading-none text-zinc-500 font-bold">
            en {metrics.executedTravels} viajes
          </span>
        </div>
        <div className="flex flex-col bg-zinc-50 px-4 py-2 rounded-lg">
          <span className="text-[10px] text-zinc-400 leading-none mb-1">
            Toneladas Variación
          </span>
          <b className="text-[#FE7887] leading-none font-extrabold text-xl">
            {roundAndFormat(metrics.variationTonnage)} <small>TM</small>
          </b>
          <span className="mt-1 text-xs leading-none text-zinc-500 font-bold">
            en {metrics.variationTravels} viajes
          </span>
        </div>
        <div className="flex justify-between items-center bg-zinc-50 px-4 py-2 rounded-lg pr-3">
          <div className="flex flex-col">
            <span className="text-[10px] text-zinc-400 leading-none mb-1">
              %Cumplimiento
            </span>
            <b className="text-[#1E64FA] leading-none font-extrabold text-xl">
              {metrics.goalCompletionPercentage.toFixed(2)} <small>%</small>
            </b>
            <span className="mt-1 text-xs leading-none text-zinc-500 font-bold">
              {(100 - metrics.goalCompletionPercentage).toFixed(2)}%
            </span>
          </div>
          <ProgressChart
            percentage={metrics.goalCompletionPercentage.toFixed(1)}
          />
        </div>
      </div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}

const ProgressChart = ({ percentage }) => {
  const size = 52;
  const radius = 20; // Del nuevo path
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="circular-container" style={{ "--percentage": percentage }}>
      <svg viewBox={`0 0 ${size} ${size}`} className="circular-chart">
        <path
          className="circle-bg"
          d="M26 6 a 20 20 0 0 1 0 40 a 20 20 0 0 1 0 -40"
        />
        <path
          className="circle"
          // Cálculo en línea para stroke-dasharray
          strokeDasharray={`${(percentage / 100) * circumference}, ${
            circumference - (percentage / 100) * circumference
          }`}
          d="M26 6 a 20 20 0 0 1 0 40 a 20 20 0 0 1 0 -40"
        />
      </svg>
      <div className="percentage-text">{percentage}%</div>
    </div>
  );
};
