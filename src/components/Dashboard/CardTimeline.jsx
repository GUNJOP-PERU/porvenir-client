import { useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highchartsXrange from "highcharts/modules/xrange";

// Inicializar los módulos
if (typeof highchartsXrange === "function") {
  highchartsXrange(Highcharts);
}

export default function CardTimeline() {
  const vehicles = ["SC-21 TJ-381", "SC-25 TJ-456", "SC-34 TJ-153", "SC-34 TJ-156", "SC-34 TJ-456", "SC-981 TJ-456", "SC-824 TJ-256", "SC-534 TJ-156", "SC-634 TJ-456","SC-634 TJ-235"];
  const stateAData = [
    { x: 1540430613000, x2: 1540633768100, y: 0 },
    { x: 1540191009000, x2: 1540633768100, y: 1 },
    { x: 1540191009000, x2: 1540530613000, y: 2 },
    { x: 1540530613000, x2: 1540633768100, y: 3 },
  ];
  
  const stateBData = [
    { x: 1540191009000, x2: 1540430613000, y: 0 },
    { x: 1540530613000, x2: 1540633768100, y: 2 },
    { x: 1540191009000, x2: 1540330613000, y: 3 },
  ];
  
  const stateCData = [
    { x: 1540330613000, x2: 1540530613000, y: 3 },
  ];
  const stateDData = [
    { x: 1540330613000, x2: 1540530613000, y: 3 },
  ];

  const data = [1];
  const options = useMemo(
    () => ({
      chart: {
        type: "xrange",
        backgroundColor: "transparent",
        height: 200,
        marginTop: 35,
        marginBottom: 30,
      },
      title: {
        text: null,
      },
      xAxis: {
        type: "datetime",
      },
      yAxis: [
        {
          title: {
            text: null,
          },
          categories: vehicles,
          reversed: true,
        },
      ],
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
        xrange: {
          borderRadius: 0,
          borderWidth: 0,
          grouping: false,
          dataLabels: {
            align: "center",
            enabled: true,
          },
          colorByPoint: false,
        },
      },
     series: [
        {
          name: "State A",
          pointWidth: 20,
          data: stateAData,
          color: "rgb(43, 144, 143)",
        },
        {
          name: "State B",
          pointWidth: 20,
          data: stateBData,
          color: "rgb(144, 238, 126)",
        },
        {
          name: "State C",
          pointWidth: 20,
          data: stateCData,
          color: "rgb(244, 91, 91)",
        },
        {
          name: "State D",
          pointWidth: 20,
          data: stateDData,
          color: "#585EFB",
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
    }),
    []
  );

  return (
    <>
      {data.length > 0 ? (
        <>
          <h4 className="text-xs font-bold">
            Tonelaje - Planificado vs Ejecutado
          </h4>
          <HighchartsReact highcharts={Highcharts} options={options} />
        </>
      ) : (
        <p className="mx-auto text-zinc-400 text-[10px] leading-3 max-w-20 text-center">
          No hay datos disponibles
        </p>
      )}
    </>
  );
}
