import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useMemo } from "react";

export default function AreaWeek({ data, isLoading, isError }) {

const pieData = useMemo(() => {
    if (!data?.length) return [];

    const superficieTitles = ["FAJ4 CANCHA 100", "PAHUAYPITE", "LABOR A LABOR"];

    let superficieValue = 0;
    let interiorValue = 0;

    data.forEach((item) => {
      const destinyUpper = (item.destiny || "").toUpperCase();
      if (superficieTitles.includes(destinyUpper)) {
        superficieValue += item.tonnage || 0;
      } else {
        interiorValue += item.tonnage || 0;
      }
    });

    return [
      { name: "Superficie", y: superficieValue, color: "#9B9B9B" },
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
          colorByPoint: true,
          name: "Extracción",
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
          dataLabels: {
            enabled: true,
            format:
              '<b><span style="color:{point.color}">{point.name}</span></b><br>' +
              '<span style=" font-size:14px">{point.y}TM {point.percentage:.2f}%</span>',
            distance: 15,
            style: {
              fontSize: "10px",
              color: "#000",
              fontWeight: "bold",
              textOutline: "none",
              whiteSpace: "normal", // Permite saltos de línea
              wordWrap: "break-word", // Divide automáticamente si es largo
              width: "80px", // Define un ancho para el ajuste automático
              textAlign: "center", // Centra el texto
            },
          },
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

  if (isLoading)
    return (
      <div className="bg-zinc-200 rounded-2xl flex items-center justify-center h-[280px] w-full animate-pulse" />
    );

  if (isError)
    return (
      <div className="flex items-center justify-center h-[280px] w-full">
        <span className="text-[10px] text-red-500">Ocurrió un error</span>
      </div>
    );
  return <HighchartsReact highcharts={Highcharts} options={options} />;
}
