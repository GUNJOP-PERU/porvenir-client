import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useMemo } from "react";
import { StatusDisplay } from "../StatusDisplay";
import { roundAndFormat } from "@/lib/utilsGeneral";

export default function UnproductiveType({ data, isLoading, isError }) {
  const pieData = useMemo(() => {
    if (!data?.length) return [];
  
    const config = {
      200: { color: "#26b969", name: "PARADA PLANIFICADA" },
      300: { color: "#019cfe", name: "PERDIDAS" },
      400: { color: "#fbbf24", name: "MANTENIMIENTO" },
      500: { color: "#ef4444", name: "OTROS" },
      600: { color: "#8b5cf6", name: "N/A" },
    };
  
    const groups = Object.keys(config).reduce((acc, key) => {
      acc[key] = 0;
      return acc;
    }, {});
  
    data.forEach(({ code_activity, duration }) => {
      const code = parseInt(code_activity || 0, 10);
      if (code >= 200 && code < 700) {
        const groupKey = Math.floor(code / 100) * 100;
        if (groups[groupKey] !== undefined) {
          groups[groupKey] += (duration || 0) / 3600; 
        }
      }
    });
  
    return Object.keys(groups)
      .map((key) => ({
        name: config[key].name,
        y: groups[key],
        color: config[key].color,
        code: key,
      }))
      .filter((d) => d.y > 0);
  }, [data]);
  

  const options = useMemo(
    () => ({
      chart: {
        type: "pie",
        backgroundColor: "transparent",
        height: 330,
      },
      title: { text: "" },
      series: [
        {
          enableMouseTracking: false,
          name: "Transporte",
          innerSize: "35%",
          colorByPoint: true,
          data: pieData,
        },
      ],
      plotOptions: {
        pie: {
          allowPointSelect: true,
          borderWidth: 2,
          cursor: "pointer",
          borderRadius: 10,
          dataLabels: [
            {
              enabled: true,
              distance: 15,
              formatter: function () {
                return (
                  `<b><span style="color:${this.point.color}">${this.point.name}</span></b><br>` +
                  `<span style="font-size:14px;">${roundAndFormat(this.point.y)} <small style="font-size:12px">hrs</small></span><br>`
                );
              },              
              style: {
                fontSize: "0.6rem",
                color: "#000",
                fontWeight: "bold",
                textOutline: "none",
                whiteSpace: "normal",
                wordWrap: "break-word",
                width: "80px",
                textAlign: "center",
              },
            },
            {
              enabled: true,
              distance: "-35%",
              filter: {
                property: "percentage",
                operator: ">",
                value: 5,
              },
              format: "{point.percentage:.2f}%",
              style: {
                fontSize: "0.7em",
                textOutline: "none",
                color: "#ffffff",
              },
            },
          ],
          showInLegend: true,
        },
      },
      legend: {
        enabled: false,
      },
      tooltip: { enabled: false },
      credits: { enabled: false },
      exporting: { enabled: false },
      accessibility: {
        enabled: false,
      },
    }),
    [pieData]
  );

  if (isLoading || isError || !data || Object.keys(data).length === 0) {
    return (
      <StatusDisplay
        isLoading={isLoading}
        isError={isError}
        noData={!data || Object.keys(data).length === 0}
        height="280px"
      />
    );
  }
  return <HighchartsReact highcharts={Highcharts} options={options} />;
}
