import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import React, { Suspense, useMemo } from "react";

const CardPie = React.memo(({ data, title }) => {
  const dataChartTemporal = [
    {
      name: "Produccion",
      y: 0,
      color: "#EBEBEB",
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
        text: null,
      },
      series: [
        {
          name: "Producción", // Agrega un nombre a la serie
          colorByPoint: true, // Permite que cada punto tenga su color
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
        align: "center", // Centra la leyenda
        verticalAlign: "bottom", // Coloca la leyenda en la parte inferior
        layout: "horizontal", // Cambia a diseño horizontal
        floating: false, // Evita que flote sobre el gráfico
        itemStyle: {
          color: "#A6A6A6",
          fontSize: "9px",
          fontWeight: "bold",
        },
        itemHoverStyle: {
          color: "#1EE0EE",
        },
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
      <div className="w-full flex flex-1 justify-center items-center gap-2">
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
                    <small className="font-extrabold">
                      {i.unit?.charAt(0)}
                    </small>
                  </h1>
                </div>
                <span className="text-green-600 leading-[8px] text-[8px]">
                  1.1 % más eficiente
                </span>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400 text-[10px] leading-3 max-w-20">
              <div className="flex flex-col justify-center items-center border rounded-xl p-3 px-3.5 gap-0.5">
                <span className="text-[10px] text-center leading-3 font-semibold text-zinc-700 mb-1.5">
                  Tiempo improductivo
                </span>
                <div className="flex justify-between gap-0.5">
                  <h1 className="text-[#EF9517] font-black text-xl leading-5">
                    0.0
                    <small className="font-extrabold">h</small>
                  </h1>
                </div>
                <span className="text-green-600 leading-[8px] text-[8px]">
                  1.1 % más eficiente
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
});

CardPie.displayName = "CardPie";
export default CardPie;
