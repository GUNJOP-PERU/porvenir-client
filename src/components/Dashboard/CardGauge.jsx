import { useFetchDashboardData } from "@/hooks/useGlobalQuery";
import { formatThousands } from "@/lib/utilsGeneral";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HighchartsMore from "highcharts/highcharts-more";
import solidGauge from "highcharts/modules/solid-gauge";
import { useMemo } from "react";

if (typeof Highcharts === "object") {
}

export default function CardGauge({data} ) {
  const { data: dataGuage, isLoading } = useFetchDashboardData(
    "dashboardTruckProgressDay",
    "dashboard/truck/progress-day"
  );

  console.log(dataGuage);

  const options = useMemo(
    () => ({
      chart: {
        backgroundColor: "transparent",
        type: "solidgauge",
        height: 100,
        width: 165,
        marginTop: -20,
        marginBottom: 0,
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
        max: 60000, // Meta
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
          data: [data || 20000], // Tonelada
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
                  <div style="display: flex; flex-direction: column; align-items: center; text-align: center; height:29px">
                    <span style="font-size: 8px; opacity: 0.3;line-height:8px">Toneladas</span>
                    <span style="font-size: 28px; font-weight: 800; color: #5190FF;line-height:1.9rem">
                      ${formatThousands(this.y)}
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

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}
