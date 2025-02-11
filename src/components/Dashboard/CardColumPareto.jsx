import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useMemo } from "react";

export default function CardColumPareto({ data }) {
  console.log(data);
  const options = useMemo(
    () => ({
      chart: {
        type: "column",
        backgroundColor: "transparent",
        height: 280,
        marginTop: 25,
        marginBottom:25,
      },
      title: {
        text: null,
      },
      xAxis: {
        categories: data?.dates,
        lineColor: "transparent",
        crosshair: true,
        tickWidth: 0,
        tickLength: 0,
        labels: {
          style: {
            color: "#A6A6A6",
            fontSize: "0.6em",
          },
        
        },
      },

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
        // formatter: function () {
        //   return `<b>${this.series.name}</b>: ${Number(this.y).toFixed(1)} toneladas`;
        // },
      },
      plotOptions: {
        column: {
          stacking: "normal",
          borderRadius: "15%",
          pointPadding: 0.05,
          groupPadding: 0.05,
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            style: {
              fontSize: "8px",
              color: "#000",
              fontWeight: "bold",
              textOutline: "none",
            },
            backgroundColor: "rgba(255, 255, 255, 0.5)",  
            borderRadius: 3,            
            padding: 3,    
            borderWidth: 0,
            formatter: function () {
              return this.y !== 0 ? Number(this.y).toFixed(1) : "";
            },
          },
        },
      },
      series: [
        {
          type: "column",
          name: "Mantenimiento y falla",
          data: data?.maintenance_act,
          color: "#FF9500",
          stack: "Hour",
        },
        {
          type: "column",
          name: "Act.Programada",
          data: data?.programming_act,
          color: "#22C2C5",
          stack: "Hour",
        },
        {
          type: "column",
          name: "Servicio y Apoyo",
          data: data?.service_act,
          color: "#F43F5E",
          stack: "Hour",
        },
        {
          type: "column",
          name: "Act.No Programada",
          data: data?.unplanned_act,
          color: "#347AE2",
          stack: "Hour",
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
        enabled: false
      },
    }),
    [data]
  );

  return (
    <>
      {data?.dates?.length > 0 ? (
        <>
          <h4 className="text-xs font-bold">Actividades Improductivas Mes</h4>
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
