import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useMemo } from "react";

export default function CardPie({ data, title }) {
  const dataChartTemporal = [
    {
      name: "Descargando",
      y: 0,
      color: "#F44336",
    },
    {
      name: "Viaje Vacio",
      y: 0,
      color: "#FFC107",
    },
    {
      name: "Viaje Cargado",
      y: 0,
      color: "#4CAF50",
    },
    {
      name: "Cargando",
      y: 0,
      color: "#008CBA",
    },
  ];

  const options = useMemo(
    () => ({
      chart: {
        backgroundColor: "transparent",
        type: "pie",
        plotBackgroundColor: null,
        height: 200,
      },
      title: {
        text: "",
      },
      series: [
        {
          name: "",
          colorByPoint: false,
          innerSize: "60%",
          data:
            data?.data_chart?.map((item) => ({
              name: item.title,
              y: item.value,
              color: item.fill,
            })) || dataChartTemporal,
        },
      ],
      tooltip: {
        pointFormat:
          "{series.name}: <b>{point.percentage:.1f}%</b> ({point.y})",
        backgroundColor: "#111214",
        borderWidth: 0,
        shadow: false,
        borderRadius: 10,
        padding: 10,
        style: {
          color: "#FFFFFF",
          fontSize: "11px",
          fontWeight: "",
        },
        headerFormat:
          '<span style="font-size: 11px; color: #A6A6A6; padding:10px">{point.key}</span><br>',
        valueDecimals: 1,
      },

      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: "pointer",
          borderWidth: 2,
          borderColor: "#F4F4F580",
          dataLabels: {
            enabled: false,
          },
        },
      },

      legend: {
        align: "right",
        verticalAlign: "center", // Cambia la leyenda a la parte inferior
        layout: "vertical",
        floating: true,
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

  return (
    <>
      <h4 className="text-xs font-bold">{title}</h4>
      <div className="flex flex-1 justify-center items-center gap-2">
        <HighchartsReact highcharts={Highcharts} options={options} />
        <div className="flex flex-col gap-2">
          {data?.data_card?.length > 0 ? (
            data?.data_card?.map((i, index) => (
              <div
                key={index}
                className="flex flex-col justify-center items-center border rounded-xl p-3 px-3.5 gap-0.5"
              >
                <span className="text-[10px] text-center leading-3 font-semibold text-zinc-700 mb-1.5">
                  {i.title}
                </span>
                <div className="flex justify-between gap-0.5">
                  <h1 className="text-[#EF9517] font-black text-xl leading-5">
                    {i.value?.toFixed(2)}
                    <small className="font-extrabold">{i.unit}</small>
                  </h1>
                </div>
                <span className="text-green-600 leading-[8px] text-[8px]">
                  1.1 % más eficiente
                </span>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400 text-[10px] leading-3 max-w-20">
              {data?.data_card?.length === 0
                ? "No hay datos disponibles."
                : "Cargando datos..."}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
