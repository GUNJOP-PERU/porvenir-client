import { useGraphicData } from "@/hooks/useGraphicData";
import { hoursDay, hoursNight } from "@/lib/dataDashboard";
import { formatThousands } from "@/lib/utilsGeneral";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useMemo } from "react";

export default function CardColumScoop() {
  const {
    data = [],
    isLoading,
    isError,
  } = useGraphicData( "scoop-tonnage-per-hour","dashboard/scoop/tonnage-per-hour",);

  const selectedData = useMemo(() => {
    return data?.shift === "noche" ? hoursNight : data;
  }, [data, hoursNight]);

  const options = useMemo(
    () => ({
      chart: {
        type: "column",
        backgroundColor: "transparent",
        height: 300,
        marginTop: 35,
        marginBottom: 30,
      },
      title: {
        text: null,
      },
      xAxis: {
        categories: selectedData?.hours || (data?.shift === "noche" ? hoursNight : hoursDay),
        lineColor: "transparent",
        crosshair: true,
        tickWidth: 0,
        tickLength: 0,
        labels: {
          style: {
            color: "#A6A6A6",
            fontSize: "0.6em",
          },
          rotation: 0,
        },
      },
      // yAxis: {
      //   title: {
      //     text: null,
      //   },
      //   labels: {
      //     style: {
      //       color: "#A6A6A6",
      //       fontSize: "0.6em",
      //     },
      //   },
      //   gridLineColor: "#D9D9D9",
      //   gridLineWidth: 0.5,
      //   gridLineDashStyle: "Dash",
      // },
      yAxis: {
        title: {
          text: null,
        },
        labels: {
          enabled: false, // Oculta solo los números del eje Y
        },
        gridLineColor: "#D9D9D9",
        gridLineWidth: 0.5,
        gridLineDashStyle: "Dash",
      },

      tooltip: {
        shared: true,
        valueSuffix: " toneladas",
        backgroundColor: "#111214",
        borderWidth: 0,
        shadow: false,
        borderRadius: 10,
        padding: 15,
        style: {
          color: "#FFFFFF",
          fontSize: "11px",
          fontWeight: "",
        },
      },
      plotOptions: {
        column: {
          stacking: "normal",
          borderRadius: "15%",
          pointPadding: 0.2,
          groupPadding: 0.2,
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            style: {
              fontSize: "9px",
              color: "#000",
              fontWeight: "",
              textOutline: "none",
            },
            borderWidth: 0,
            formatter: function () {
              return formatThousands(this.y);
            },
          },
        },
      },
      series: [
        {
          type: "column",
          name: "Avance",
          data: data?.advance ,
          color: "#F59E0B",
          stack: "Tiempo",
        },
        {
          type: "column",
          name: "Producción",
          data: data?.production ,
          color: "#14B8A6",
          stack: "Tiempo",
        },
      ],
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
        itemMarginTop: 1,
        itemMarginBottom: 1,
        zIndex: 10,
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
    }),
    [data]
  );
  if (isLoading)
  return (
    <div className="bg-zinc-200 rounded-2xl h-[300px] w-full animate-pulse"></div>
  );
if (isError)
  return (
    <div className="bg-zinc-100/50 rounded-2xl py-2 px-4 flex items-center justify-center h-[100px] md:h-[90px] ">
      <span className="text-[10px] text-red-500">Ocurrió un error</span>
    </div>
  );
  return (
    <>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </>
  );
}
