import { useEffect, useMemo } from "react";
import { useProductionWebSocket } from "@/hooks/useProductionWebSocket";
import { formatThousands } from "@/lib/utilsGeneral";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HighchartsMore from "highcharts/highcharts-more";
import solidGauge from "highcharts/modules/solid-gauge";
import { useGlobalStore } from "@/store/GlobalStore";

if (typeof solidGauge === "function") {
  solidGauge(Highcharts);
}

export default function CardGauge() {
  useProductionWebSocket();
  const fetchDataGauge = useGlobalStore((state) => state.fetchDataGauge);
  const { dataGuage } = useGlobalStore();

  useEffect(() => {
    fetchDataGauge();
  }, [fetchDataGauge]);

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
        max: dataGuage?.goal_tonnages?.value || 0, // Meta
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
          data: [dataGuage?.total_tonnages_accumulated?.value || 0], // Tonelada
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
    [dataGuage]
  );

  return (
    <div className="bg-zinc-100/50 rounded-2xl py-2 px-4 flex items-center justify-center ">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}
