import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useMemo } from "react";
import { StatusDisplay } from "../StatusDisplay";

export default function AreaWeek({ data, isLoading, isError }) {
  const pieData = useMemo(() => {
    if (!data?.length) return [];

    const superficieTitles = ["faja 4", "cancha 100", "pahuaypite", "dique 4"];
    const interiorTitles = ["parrilla 1", "parrilla 2", "pocket 3"];

    let superficieValue = 0;
    let interiorValue = 0;

    data.forEach((item) => {
      const destinyLower = (item.destiny || "").toLowerCase();

      if (superficieTitles.some((t) => destinyLower.includes(t))) {
        superficieValue += 1;
      } else if (interiorTitles.some((t) => destinyLower.includes(t))) {
        interiorValue += 1;
      }
    });

    return [
      { name: "Superficie", y: superficieValue, color: "#26b969" },
      { name: "Interior / Mina", y: interiorValue, color: "#019cfe" },
    ];
  }, [data]);

  const options = useMemo(
    () => ({
      chart: {
        type: "pie",
        backgroundColor: "transparent",
        height: 280,
        marginRight: 0,
        marginLeft: 0,
        marginTop: 0,
        marginBottom: 10,
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
          borderWidth: 5,
          cursor: "pointer",
          borderRadius: 20,
          dataLabels: [
            {
              enabled: true,
              distance: 15,
              formatter: function () {
                return (
                  `<b><span style="color:${this.point.color}">${this.point.name}</span></b><br>` +
                  `<span style="font-size:14px;">${this.point.y} <small style="font-size:12px">viajes</small></span><br>`
                );
              },
              style: {
                fontSize: "0.7rem",
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
              distance: "-33%",
              filter: {
                property: "percentage",
                operator: ">",
                value: 5,
              },
              format:
                '<span style=" font-size:14px">{point.percentage:.2f}%</span>',
              style: {
                fontSize: "0.9em",
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
