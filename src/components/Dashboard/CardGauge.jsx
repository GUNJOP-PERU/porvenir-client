import { memo, useMemo, useRef } from "react";
import { formatThousands } from "@/lib/utilsGeneral";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HighchartsMore from "highcharts/highcharts-more";
import solidGauge from "highcharts/modules/solid-gauge";
import { useStockData } from "@/hooks/useStockData";

if (typeof solidGauge === "function") {
  solidGauge(Highcharts);
}

const CardGauge = memo(() => {
  const { data, isLoading, isError } = useStockData(
    "dashboard/progress-shift",
    "progress-shift"
  );

  const options = useMemo(
    () => ({
      chart: {
        backgroundColor: "transparent",
        type: "solidgauge",
        height: 75,
        width: 120,
        marginTop: -20,
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 0,
      },
      title: {
        text: null,
      },
      pane: {
        center: ["50%", "85%"],
        size: "120%",
        innerSize: 0,
        startAngle: -90,
        endAngle: 90,
        background: {
          backgroundColor: "#E9E9E9",
          borderRadius: 50,
          innerRadius: "75%",
          outerRadius: "100%",
          borderColor: 0,
          borderWidth: 1,
          shape: "arc",
        },
      },
      yAxis: {
        min: 0,
        max: data?.goal_tonnages?.value || 0, // Meta
        stops: [[0.1, "#22C2C5"]],
        lineWidth: 0,
        tickWidth: 0,
        minorTickInterval: null,
        tickAmount: 2,
        labels: {
          align: "center",
          distance: -7,
          y: 12,
          style: {
            color: "#6e6d7a",
            fontSize: "9px",
          },
        },
      },
      series: [
        {
          name: "toneladas",
          data: [data?.total_tonnages_accumulated?.value || 0], // Tonelada
          innerRadius: "75%",
          enableMouseTracking: false,
          states: {
            hover: {
              enabled: false,
            },
          },
          dataLabels: {
            useHTML: true,
            formatter: function () {
              return `
                          <div style="display: flex; flex-direction: column; align-items: center; text-align: center; height:29px; padding-top:3px">
                            <span style="font-size: 7px; opacity: 0.3;line-height:8px">Ejecutado</span>
                            <span style="font-size: 1.5rem; font-weight: 800; color: #5190FF;line-height:1.5rem">
                              ${formatThousands(this.y) || `${0}`}
                            </span>
                          </div>
                        `;
            },
          },
        },
      ],
      legend: {
        enabled: false,
      },
      credits: {
        enabled: false,
      },
      exporting: {
        enabled: false,
      },
      accessibility: {
        enabled: false,
      },
      plotOptions: {
        solidgauge: {
          borderRadius: 50,
          dataLabels: {
            y: 0,
            borderWidth: 0,
            useHTML: true,
          },
        },
      },
    }),
    [data]
  );

  if (isLoading)
    return (
      <div className="bg-zinc-200 rounded-2xl h-[100px] md:h-[90px] animate-pulse"></div>
    );
  if (isError)
    return (
      <div className="bg-zinc-100/50 rounded-2xl py-2 px-4 flex items-center justify-center h-[100px] md:h-[90px] ">
        <span className="text-[10px] text-red-500">Ocurrió un error</span>
      </div>
    );

  return (
    <div className="bg-zinc-100/50 rounded-2xl py-2 px-4 flex items-center justify-center h-[100px] md:h-[90px]">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
});
CardGauge.displayName = "CardGauge";
export default CardGauge;
